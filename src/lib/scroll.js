// Shared scroll state, written by the Lenis loop (DOM side) and read by the
// R3F render loop (canvas side). Keeping it in one mutable object avoids
// React re-renders on every scroll frame.
export const scrollState = {
  y: 0, // current smoothed scroll position in px
  velocity: 0, // px per frame-ish, signed
  progress: 0, // 0..1 across the whole document
}
