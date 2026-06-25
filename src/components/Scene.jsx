import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import ParticlePortrait from './ParticlePortrait.jsx'
import { scrollState } from '../lib/scroll.js'

// Faint drifting dust to fill the negative space with atmosphere.
function Dust({ count = 600 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.4
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#4f6bff" transparent opacity={0.5} depthWrite={false} />
    </points>
  )
}

// Camera drifts slightly with scroll so later sections feel like a move-through.
function CameraRig() {
  useFrame((state) => {
    const p = scrollState.progress
    state.camera.position.x += (Math.sin(p * Math.PI) * 0.6 - state.camera.position.x) * 0.05
    state.camera.position.y += (-p * 1.5 - state.camera.position.y) * 0.05
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene() {
  return (
    <div className="scene-fixed">
      <Canvas
        camera={{ position: [0, 0, 13], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#03040a']} />
        <fog attach="fog" args={['#03040a', 10, 26]} />
        <Suspense fallback={null}>
          <ParticlePortrait src={`${import.meta.env.BASE_URL}images/hero.jpg`} />
          <Dust />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  )
}
