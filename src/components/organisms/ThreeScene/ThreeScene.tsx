import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const CANVAS_SIZE_PX = 200
const BACKGROUND = '#18181b'
const CUBE_COLOR = 'rgb(59, 130, 246)'
const ROTATION_STEP = 0.01

/** Cubo 3D girando com three.js. Libera renderer, geometria e loop ao desmontar. */
export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(BACKGROUND)
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    camera.position.z = 2

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(CANVAS_SIZE_PX, CANVAS_SIZE_PX, true)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: CUBE_COLOR })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    let frameId = 0
    const renderFrame = () => {
      cube.rotation.x += ROTATION_STEP
      cube.rotation.y += ROTATION_STEP
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(renderFrame)
    }
    renderFrame()

    return () => {
      cancelAnimationFrame(frameId)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} data-testid='three-scene' />
}

export default ThreeScene
