import type { ColumnDef } from '@tanstack/react-table'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { NumberCell } from '@/components/molecules/NumberCell'
import { DataTable } from '@/components/organisms/DataTable'
import {
  DEFAULT_LEVELS,
  loadLevels,
  saveLevels,
  type LevelConfig,
} from '@/features/location-overview/lib/levelsStorage'
import { useStoredList } from '@/features/shared/useStoredList'
import { useTranslation } from '@/i18n'

type PointsField = 'capacityPointsDay' | 'maxPointsDay'

/** Pontos por dia de cada nível (capacity e máximo), editáveis direto na tabela. */
export function LevelsManager() {
  const t = useTranslation('apps')
  const { items: levels, setItems: setLevels } = useStoredList(loadLevels)

  const update = (nivel: string, field: PointsField, value: number) => {
    const next = levels.map((l) => (l.nivel === nivel ? { ...l, [field]: value } : l))
    saveLevels(next)
    setLevels(next)
  }

  const reset = () => {
    saveLevels(DEFAULT_LEVELS)
    setLevels(DEFAULT_LEVELS)
  }

  const pointsColumn = (field: PointsField, header: string): ColumnDef<LevelConfig, unknown> => ({
    accessorKey: field,
    header,
    meta: { align: 'right', numeric: true },
    cell: ({ row }) => (
      <NumberCell
        aria-label={`${header} ${row.original.nivel}`}
        value={row.original[field]}
        onCommit={(value) => update(row.original.nivel, field, value)}
      />
    ),
  })

  const columns: ColumnDef<LevelConfig, unknown>[] = [
    { accessorKey: 'nivel', header: t.levels.level },
    { accessorKey: 'label', header: t.levels.label },
    pointsColumn('capacityPointsDay', t.levels.capacity),
    pointsColumn('maxPointsDay', t.levels.max),
  ]

  return (
    <section className='flex flex-col gap-4' aria-labelledby='levels-title'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 id='levels-title' className='text-lg font-semibold text-fg-strong'>
            {t.levels.title}
          </h2>
          <p className='text-sm text-fg'>{t.levels.description}</p>
        </div>
        <Button variant='secondary' size='sm' onClick={reset}>
          <RotateCcw size={14} aria-hidden /> {t.levels.reset}
        </Button>
      </div>
      <DataTable data={levels} columns={columns} caption={t.levels.title} />
    </section>
  )
}

export default LevelsManager
