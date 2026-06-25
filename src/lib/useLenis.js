import { useEffect } from 'react'
import Lenis from 'lenis'
import { scrollState } from './scroll.js'

// Sets up Lenis smooth scrolling and mirrors its state into scrollState so the
// Three.js scene can react without triggering React renders.
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ({ scroll, velocity, limit }) => {
      scrollState.y = scroll
      scrollState.velocity = velocity
      scrollState.progress = limit > 0 ? scroll / limit : 0
    })

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
