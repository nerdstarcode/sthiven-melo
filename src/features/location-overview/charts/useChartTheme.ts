import type { EChartsOption } from 'echarts'
import { useContext, useMemo } from 'react'
import { ThemeContext } from '@/contexts/ThemeContext'
import { PALETTE } from '@/features/location-overview/lib/chartPalettes'

interface ChartColors {
  text: string
  strong: string
  line: string
}

const COLORS: Record<'light' | 'dark', ChartColors> = {
  dark: { text: '#a1a1aa', strong: '#f4f4f5', line: '#3f3f46' },
  light: { text: '#52525b', strong: '#18181b', line: '#e4e4e7' },
}

/** Cores e eixos padrão dos gráficos do Location Overview, conforme o tema claro/escuro. */
export function useChartTheme(darkModeOverride?: boolean) {
  const ctx = useContext(ThemeContext)
  const dark = darkModeOverride ?? ctx?.darkMode ?? true

  return useMemo(() => {
    const colors = COLORS[dark ? 'dark' : 'light']
    const textStyle = { color: colors.text }
    return {
      colors,
      palette: PALETTE,
      textStyle,
      baseOption: (option: EChartsOption): EChartsOption => ({
        backgroundColor: 'transparent',
        textStyle,
        grid: { left: 8, right: 8, top: 40, bottom: 8, containLabel: true },
        ...option,
      }),
      categoryAxis: (data: string[]) => ({
        type: 'category' as const,
        data,
        axisLabel: textStyle,
        axisLine: { lineStyle: { color: colors.line } },
      }),
      valueAxis: (extra: Record<string, unknown> = {}) => ({
        type: 'value' as const,
        axisLabel: textStyle,
        nameTextStyle: textStyle,
        splitLine: { lineStyle: { color: colors.line } },
        ...extra,
      }),
    }
  }, [dark])
}
