import type { EChartsOption } from 'echarts'
import { useMemo } from 'react'
import { EChart } from '@/components/atoms/EChart'
import { ChartCard } from '@/components/molecules/ChartCard'
import { useChartTheme } from '@/features/location-overview/charts/useChartTheme'
import {
  MAX_PROFICIENCY,
  SKILL_TYPES,
  type PersonSkillDetail,
} from '@/features/skills/lib/skillsStorage'
import { summarizeProfile } from '@/features/skills/lib/skillsTemplate'
import { format, useTranslation } from '@/i18n'

export interface SkillsRadarProps {
  profile: PersonSkillDetail[]
  darkMode?: boolean
}

/** Um radar com no mínimo três eixos; com menos skills o gráfico não diz nada. */
const MIN_AXES = 3

/** Radar das hard e das soft skills do perfil, com a quantidade e a média de cada tipo. */
export function SkillsRadar({ profile, darkMode }: SkillsRadarProps) {
  const t = useTranslation('apps')
  const chart = useChartTheme(darkMode)
  const summary = summarizeProfile(profile)

  const charts = useMemo(
    () =>
      SKILL_TYPES.map((type, i) => {
        const entries = profile.filter((p) => p.skill.type === type)
        const name = type === 'hard' ? t.skills.hardPlural : t.skills.softPlural
        const option: EChartsOption = chart.baseOption({
          tooltip: {},
          radar: {
            radius: '62%',
            indicator: entries.map((e) => ({ name: e.skill.name, max: MAX_PROFICIENCY })),
            axisName: { color: chart.colors.text },
            splitLine: { lineStyle: { color: chart.colors.line } },
            splitArea: { show: false },
            axisLine: { lineStyle: { color: chart.colors.line } },
          },
          series: [
            {
              name,
              type: 'radar',
              data: [{ value: entries.map((e) => e.level), name }],
              itemStyle: { color: chart.palette[i === 0 ? 0 : 6] },
              areaStyle: { opacity: 0.25 },
            },
          ],
        })
        return { type, name, option, enough: entries.length >= MIN_AXES }
      }),
    [profile, chart, t],
  )

  return (
    <ChartCard title={t.skillsTemplate.radarTitle} description={t.skillsTemplate.radarDescription}>
      <div className='grid gap-4 md:grid-cols-2'>
        {charts.map(({ type, name, option, enough }) => {
          const { count, average } = summary.find((s) => s.type === type)!
          return (
            <figure key={type} className='flex flex-col gap-1'>
              <figcaption className='text-xs font-medium text-fg'>
                {name} · {format(t.skillsTemplate.summary, { count, average })}
              </figcaption>
              {enough ? (
                <EChart label={name} option={option} height={260} />
              ) : (
                <p className='py-10 text-center text-sm text-fg'>{t.skillsTemplate.radarEmpty}</p>
              )}
            </figure>
          )
        })}
      </div>
    </ChartCard>
  )
}

export default SkillsRadar
