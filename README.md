# NOIR — Melodic Rap Artist Landing Page

A scroll-driven landing page built around a **Three.js particle point-cloud hero**:
the artist's photo is reconstructed from tens of thousands of GPU particles that
scatter into a slowly-rotating galaxy as you scroll, then clear to reveal the
content sections. Moody cobalt-on-black aesthetic, smooth-scroll, atmospheric dust.

## Stack
- **React + Vite**
- **react-three-fiber / drei / three** — the particle system & scene
- **lenis** — smooth scroll, mirrored into the render loop without React re-renders

## Run it
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # serve the build
```

## How the hero works
1. `src/lib/useImageParticles.js` loads an image, samples its pixels on a grid,
   and builds buffer attributes: a **home** layout (reconstructs the portrait) and
   a dispersed **target** layout (galaxy swirl), plus per-particle color & noise.
2. `src/components/ParticlePortrait.jsx` renders them as a `<points>` cloud with a
   custom GLSL shader that `mix()`es home → target by a `uProgress` uniform.
3. `uProgress` is driven by scroll position (`src/lib/scroll.js`), so scrolling
   morphs the portrait apart and back.

## Swap in the real photos
Drop the artist photos into `public/images/` and point the hero at one:

```jsx
// src/components/Scene.jsx
<ParticlePortrait src="/images/your-photo.jpg" />
```

**For best particle results:** a high-contrast portrait on a **dark/black
background** works best (the sampler keeps bright pixels and drops dark ones — see
the `threshold` option in `useImageParticles`). The blue-lit studio shots are ideal.
Tune `density` (lower = more particles) and `threshold` in `ParticlePortrait.jsx`.

The committed `public/images/artist-1.svg` is only a placeholder silhouette.
