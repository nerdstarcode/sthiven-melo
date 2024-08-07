'use client'

import { useState } from "react"

export function GlowingCube() {
  const [cubeSize, setCubeSize] = useState(150)
  const [cubeColor, setCubeColor] = useState('fuchsia')
  return (
    <div style={{
      transformStyle: 'preserve-3d',
      transform: 'rotateX(-30deg)',
    }} className={`cube rotate-cube relative w-[151.5px] h-[151.5px]`}>
      <div style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(90deg) translateZ(${cubeSize / 2}px)`
      }} className="top absolute top-0 left-0 w-full h-full bg-dark" />

      <div style={{ transformStyle: 'preserve-3d' }} className="absolute top-0 left-0 w-full h-full">
        <span style={{
          transform: `rotateY(${90 * 3}deg) translateZ(${cubeSize / 2}px)`
        }} className={`absolute top-0 left-0 w-full h-full bg-gradient-to-t from-fuchsia-500 via-fuchsia-950 to-dark`} id={`face_3`} />

        <span style={{
          transform: `rotateY(${90 * 2}deg) translateZ(${cubeSize / 2}px)`
        }} className={`absolute top-0 left-0 w-full h-full bg-gradient-to-t from-fuchsia-600 via-fuchsia-950 to-dark`} id={`face_2`} />

        <span style={{
          transform: `rotateY(${90 * 1}deg) translateZ(${cubeSize / 2}px)`
        }} className={`absolute top-0 left-0 w-full h-full bg-gradient-to-t from-fuchsia-600 via-fuchsia-950 to-dark`} id={`face_1`} />

        <span style={{
          transform: `rotateY(${90 * 0}deg) translateZ(${cubeSize / 2}px)`
        }} className={`absolute top-0 left-0 w-full h-full bg-gradient-to-t from-fuchsia-600 via-fuchsia-950 to-dark`} id='face_0' />
      </div>
      <div style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(90deg) translateZ(-${7 * cubeSize / 10}px)`,
      }
      } className={`bottom absolute top-0 left-0 w-full h-full bg-fuchsia-600 blur-md`} />
      <div style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(90deg) translateZ(-${7 * cubeSize / 10}px)`,
      }
      } className={`bottom absolute top-0 left-0 w-full h-full bg-fuchsia-600 blur-3xl`} />
    </div>
  )
}
