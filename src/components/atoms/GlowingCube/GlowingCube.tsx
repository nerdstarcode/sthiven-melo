const CUBE_SIZE_PX = 150
const HALF = CUBE_SIZE_PX / 2
const GLOW_DEPTH = (7 * CUBE_SIZE_PX) / 10

/** Faces laterais: índice × 90° em torno do eixo Y. A face 3 tem um tom mais claro. */
const SIDE_FACES = [
  { index: 3, gradient: 'from-fuchsia-500' },
  { index: 2, gradient: 'from-fuchsia-600' },
  { index: 1, gradient: 'from-fuchsia-600' },
  { index: 0, gradient: 'from-fuchsia-600' },
]

const FACE = 'absolute top-0 left-0 h-full w-full'

/** Cubo 3D em CSS puro, com brilho na base. Demonstração da página de exemplos. */
export function GlowingCube() {
  return (
    <div
      data-testid='glowing-cube'
      style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-30deg)' }}
      className='rotate-cube relative h-[151.5px] w-[151.5px]'
    >
      <div
        style={{ transformStyle: 'preserve-3d', transform: `rotateX(90deg) translateZ(${HALF}px)` }}
        className={`${FACE} bg-dark`}
      />
      <div style={{ transformStyle: 'preserve-3d' }} className={FACE}>
        {SIDE_FACES.map(({ index, gradient }) => (
          <span
            key={index}
            style={{ transform: `rotateY(${90 * index}deg) translateZ(${HALF}px)` }}
            className={`${FACE} bg-linear-to-t to-dark ${gradient} via-fuchsia-950`}
          />
        ))}
      </div>
      {['blur-md', 'blur-3xl'].map((blur) => (
        <div
          key={blur}
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(90deg) translateZ(-${GLOW_DEPTH}px)`,
          }}
          className={`${FACE} bg-fuchsia-600 ${blur}`}
        />
      ))}
    </div>
  )
}

export default GlowingCube
