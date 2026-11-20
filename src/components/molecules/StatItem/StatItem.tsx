import { twMerge } from 'tailwind-merge'
import { AnimatedNumber } from '@/components/atoms/AnimatedNumber'

export interface StatItemProps {
  value: number
  label: string
  suffix?: string
  labelClassName?: string
}

/** Número grande animado + legenda (ex.: "50+ Repositórios"). */
export function StatItem({ value, label, suffix = '+', labelClassName }: StatItemProps) {
  return (
    <div className='flex flex-col items-end justify-center'>
      <span className='inline-block text-6xl font-bold md:text-7xl'>
        <AnimatedNumber value={value} />
        {suffix}
      </span>
      <h3 className={twMerge('text-xl font-medium text-zinc-400/75 capitalize', labelClassName)}>
        {label}
      </h3>
    </div>
  )
}

export default StatItem
