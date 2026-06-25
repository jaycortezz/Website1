import { useEffect, useState } from 'react'

// Loads an image, samples its pixels on a grid, and builds the buffer
// attributes needed to render it as a morphing point cloud:
//  - position : the "home" layout that reconstructs the portrait
//  - aTarget  : a dispersed galaxy-swirl layout to morph toward on scroll
//  - aColor   : per-particle color sampled from the photo (blue-tinted)
//  - aRandom  : per-particle noise for staggered, organic motion
export function useImageParticles(
  src,
  { density = 3, height = 9, threshold = 0.16, fallback = `${import.meta.env.BASE_URL}images/artist-1.svg` } = {}
) {
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'

    // If the real hero photo isn't present yet, quietly fall back to the
    // placeholder silhouette so the page never renders an empty hero.
    img.onerror = () => {
      if (cancelled || img.src.endsWith(fallback)) return
      img.src = fallback
    }

    img.src = src

    img.onload = () => {
      if (cancelled) return
      const W = img.naturalWidth || 640
      const H = img.naturalHeight || 860
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0, W, H)
      const pixels = ctx.getImageData(0, 0, W, H).data

      const positions = []
      const targets = []
      const colors = []
      const randoms = []

      const worldScale = height / H // map pixel space to world units

      for (let y = 0; y < H; y += density) {
        for (let x = 0; x < W; x += density) {
          const i = (y * W + x) * 4
          const r = pixels[i] / 255
          const g = pixels[i + 1] / 255
          const b = pixels[i + 2] / 255
          const a = pixels[i + 3] / 255
          const lum = 0.299 * r + 0.587 * g + 0.114 * b
          if (a < 0.5 || lum < threshold) continue

          // Home position: portrait reconstructed, centered, facing camera.
          const hx = (x - W / 2) * worldScale
          const hy = -(y - H / 2) * worldScale
          const hz = (lum - 0.5) * 0.6 // subtle relief from brightness
          positions.push(hx, hy, hz)

          // Dispersed target: a slowly rotating galaxy disc.
          const baseAngle = Math.atan2(hy, hx)
          const rad = 3.5 + Math.random() * 6.0
          const angle = baseAngle + rad * 0.55 + Math.random() * 0.4
          const tx = Math.cos(angle) * rad
          const ty = hy * 0.35 + (Math.random() - 0.5) * 4.0
          const tz = Math.sin(angle) * rad - 2.0
          targets.push(tx, ty, tz)

          // Color: keep the photo's tone but lift toward cobalt.
          colors.push(
            Math.min(1, r * 0.7 + 0.05),
            Math.min(1, g * 0.8 + 0.12),
            Math.min(1, b * 0.9 + 0.35)
          )

          randoms.push(Math.random())
        }
      }

      setData({
        count: randoms.length,
        positions: new Float32Array(positions),
        targets: new Float32Array(targets),
        colors: new Float32Array(colors),
        randoms: new Float32Array(randoms),
      })
    }

    return () => {
      cancelled = true
    }
  }, [src, density, height, threshold])

  return data
}
