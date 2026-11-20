import { useInView, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

const SPRING_DURATION_MS = 3000

export interface AnimatedNumberProps {
  value: number
  className?: string
}

/** Conta de 0 até `value` quando entra na viewport (uma única vez). */
export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: SPRING_DURATION_MS })
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, value, motionValue])

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) ref.current.textContent = latest.toFixed(0)
      }),
    [springValue],
  )

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      0
    </span>
  )
}

export default AnimatedNumber
