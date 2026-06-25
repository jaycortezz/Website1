import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useImageParticles } from '../lib/useImageParticles.js'
import { scrollState } from '../lib/scroll.js'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // 0 = portrait, 1 = dispersed galaxy
  uniform float uVelocity;   // signed scroll velocity for turbulence
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aTarget;
  attribute vec3 aColor;
  attribute float aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Stagger each particle's transition so the cloud breaks apart organically.
    float stagger = smoothstep(0.0, 1.0, clamp(uProgress * 1.6 - aRandom * 0.6, 0.0, 1.0));

    vec3 pos = mix(position, aTarget, stagger);

    // Gentle constant drift + scroll-driven turbulence.
    float t = uTime * 0.35 + aRandom * 6.2831;
    float turb = 0.15 + abs(uVelocity) * 0.6;
    pos.x += sin(t) * turb * stagger;
    pos.y += cos(t * 1.3) * turb * stagger;
    pos.z += sin(t * 0.7) * turb * (0.4 + stagger);

    // Slow rotation of the dispersed state.
    float ang = uProgress * 0.6 + uTime * 0.05;
    float c = cos(ang), s = sin(ang);
    pos.xz = mat2(c, -s, s, c) * pos.xz * mix(1.0, 1.0, stagger);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (1.0 + aRandom * 0.8);
    gl_PointSize = size * uPixelRatio * (1.0 / -mv.z);

    vColor = aColor;
    vAlpha = mix(1.0, 0.55, stagger);
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    // Slight additive core for a glowing-ember feel.
    vec3 col = vColor + pow(soft, 3.0) * 0.25;
    gl_FragColor = vec4(col, soft * vAlpha);
  }
`

export default function ParticlePortrait({ src = '/images/artist-1.svg' }) {
  const points = useRef()
  const matRef = useRef()
  const { size, viewport } = useThree()
  const data = useImageParticles(src, { density: 3, height: 9.5, threshold: 0.16 })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uVelocity: { value: 0 },
      uSize: { value: 7.0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    []
  )

  const smoothProgress = useRef(0)

  useFrame((state, delta) => {
    if (!matRef.current) return
    const u = matRef.current.uniforms
    u.uTime.value = state.clock.elapsedTime

    // Hero morph happens across the first ~1.4 viewport heights of scroll.
    const heroRange = window.innerHeight * 1.4
    const target = Math.min(1, Math.max(0, scrollState.y / heroRange))
    smoothProgress.current += (target - smoothProgress.current) * Math.min(1, delta * 4)
    u.uProgress.value = smoothProgress.current
    u.uVelocity.value = THREE.MathUtils.clamp(scrollState.velocity * 0.04, -1, 1)

    // Idle breathing rotation of the whole cloud.
    if (points.current) {
      points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.08
    }
  })

  if (!data) return null

  return (
    <points ref={points} position={[viewport.width > 7 ? 1.6 : 0, 0.2, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.positions} count={data.count} itemSize={3} />
        <bufferAttribute attach="attributes-aTarget" array={data.targets} count={data.count} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" array={data.colors} count={data.count} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" array={data.randoms} count={data.count} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
