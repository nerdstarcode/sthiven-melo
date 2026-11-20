import type { EChartsOption } from 'echarts'
import { lazy, Suspense, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

// Carregado sob demanda: o ECharts só entra no bundle das telas que têm gráfico.
const ReactECharts = lazy(() => import('echarts-for-react'))

export interface EChartProps {
  option: EChartsOption
  /** Descrição do gráfico para leitores de tela. */
  label: string
  height?: number
  className?: string
}

function Placeholder() {
  return <div aria-hidden className='h-full w-full animate-pulse rounded-md bg-surface-muted' />
}

/** Gráfico do ECharts, renderizado só no cliente (não há canvas no servidor). */
export function EChart({ option, label, height = 320, className }: EChartProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div role='img' aria-label={label} style={{ height }} className={twMerge('w-full', className)}>
      {mounted ? (
        <Suspense fallback={<Placeholder />}>
          <ReactECharts option={option} style={{ height }} notMerge lazyUpdate />
        </Suspense>
      ) : (
        <Placeholder />
      )}
    </div>
  )
}

export default EChart
