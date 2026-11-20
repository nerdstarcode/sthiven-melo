import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { SelectField, TextField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { DataTable } from '@/components/organisms/DataTable'
import {
  CARGO_TIPOS,
  deleteCargo,
  loadCargos,
  upsertCargo,
  type CargoConfig,
} from '@/features/location-overview/lib/cargosStorage'
import { createId } from '@/features/location-overview/lib/createId'
import { loadLevels } from '@/features/location-overview/lib/levelsStorage'
import { useStoredList } from '@/features/shared/useStoredList'
import { useTranslation } from '@/i18n'

const EMPTY_CARGO: CargoConfig = { id: '', cargo: '', tipo: 'Dev', nivel: '' }

/** Cadastro de cargos: cada cargo define o tipo (Dev, QA…) e o nível da pessoa. */
export function CargosManager() {
  const t = useTranslation('apps')
  const { items: cargos, setItems: setCargos, ready } = useStoredList(loadCargos)
  const { items: levels } = useStoredList(loadLevels)
  const [draft, setDraft] = useState<CargoConfig | null>(null)
  const [errors, setErrors] = useState<{ cargo?: string; nivel?: string }>({})

  const open = (cargo: CargoConfig) => {
    setDraft(cargo)
    setErrors({})
  }

  const save = () => {
    if (!draft) return
    const cargo = draft.cargo.trim()
    const nextErrors = {
      cargo: cargo ? undefined : t.roles.roleRequired,
      nivel: draft.nivel ? undefined : t.roles.levelRequired,
    }
    setErrors(nextErrors)
    if (nextErrors.cargo || nextErrors.nivel) return
    setCargos(upsertCargo({ ...draft, cargo, id: draft.id || createId() }))
    setDraft(null)
  }

  const columns: ColumnDef<CargoConfig, unknown>[] = [
    { accessorKey: 'cargo', header: t.roles.role },
    { accessorKey: 'tipo', header: t.roles.type },
    { accessorKey: 'nivel', header: t.roles.level },
    {
      id: 'actions',
      header: t.common.actions,
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex gap-1'>
          <Button
            variant='ghost'
            size='sm'
            aria-label={`${t.common.edit} ${row.original.cargo}`}
            onClick={() => open(row.original)}
          >
            <Pencil size={14} aria-hidden />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            aria-label={`${t.common.delete} ${row.original.cargo}`}
            onClick={() => setCargos(deleteCargo(row.original.id))}
          >
            <Trash2 size={14} aria-hidden />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className='flex flex-col gap-4' aria-labelledby='roles-title'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 id='roles-title' className='text-lg font-semibold text-fg-strong'>
            {t.roles.title}
          </h2>
          <p className='text-sm text-fg'>{t.roles.description}</p>
        </div>
        <Button size='sm' onClick={() => open(EMPTY_CARGO)}>
          <Plus size={14} aria-hidden /> {t.roles.add}
        </Button>
      </div>

      <DataTable
        data={cargos}
        columns={columns}
        caption={t.roles.title}
        emptyMessage={ready ? t.roles.empty : t.common.loading}
      />

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? t.roles.editTitle : t.roles.addTitle}
        closeLabel={t.common.close}
        footer={
          <>
            <Button variant='secondary' onClick={() => setDraft(null)}>
              {t.common.cancel}
            </Button>
            <Button onClick={save}>{t.common.save}</Button>
          </>
        }
      >
        {draft && (
          <form
            className='flex flex-col gap-4'
            onSubmit={(event) => {
              event.preventDefault()
              save()
            }}
          >
            <TextField
              label={t.roles.role}
              value={draft.cargo}
              error={errors.cargo}
              autoFocus
              onChange={(e) => setDraft({ ...draft, cargo: e.target.value })}
            />
            <SelectField
              label={t.roles.type}
              value={draft.tipo}
              options={CARGO_TIPOS.map((tipo) => ({ value: tipo, label: tipo }))}
              onChange={(e) => setDraft({ ...draft, tipo: e.target.value as CargoConfig['tipo'] })}
            />
            <SelectField
              label={t.roles.level}
              value={draft.nivel}
              placeholder='—'
              error={errors.nivel}
              options={levels.map((l) => ({ value: l.nivel, label: `${l.nivel} · ${l.label}` }))}
              onChange={(e) => setDraft({ ...draft, nivel: e.target.value })}
            />
          </form>
        )}
      </Modal>
    </section>
  )
}

export default CargosManager
