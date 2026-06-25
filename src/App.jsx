import Scene from './components/Scene.jsx'
import Sections from './components/Sections.jsx'
import { useLenis } from './lib/useLenis.js'

export default function App() {
  useLenis()
  return (
    <>
      <Scene />
      <Sections />
    </>
  )
}
