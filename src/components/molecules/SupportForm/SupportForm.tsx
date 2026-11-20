import { ArrowLeftRight, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { isQaPerson } from '@/features/location-overview/lib/azure/sprintMetrics'
import type { CargoConfig } from '@/features/location-overview/lib/cargosStorage'
import type { Person } from '@/features/location-overview/lib/peopleStorage'
import {
  DEFAULT_SUPPORT_PERCENTAGE,
  SUPPORT_PRESETS,
  type SupportDraft,
  type SupportDraftError,
} from '@/features/location-overview/lib/personSupportsStorage'
import { format, useTranslation } from '@/i18n'
import type { AppsTranslation } from '@/i18n/apps'

/** Mensagem traduzida de um erro de apoio. */
export function supportErrorMessage(
  error: SupportDraftError,
  t: AppsTranslation['supports'],
): string {
  return error.code === 'notAllocated'
    ? format(t.errors.notAllocated, { name: error.name })
    : t.errors[error.code]
}

export interface SupportFormProps {
  /** Quem pode entrar no apoio: as pessoas alocadas na sprint. */
  people: Person[]
  cargos: CargoConfig[]
  initialSupporterId?: string
  /** Devolve o erro, ou null quando gravou (o formulário então limpa o apoiado). */
  onSubmit: (draft: Omit<SupportDraft, 'sprintId'>) => SupportDraftError | null
}

const fieldLabel = 'text-xs font-medium text-fg'

/**
 * Cadastro rápido de um apoio: quem apoia → quem é apoiado (só do mesmo tipo, QA ou não-QA),
 * a % com os atalhos Leve/Médio/Intenso e Enter para gravar.
 */
export function SupportForm({
  people,
  cargos,
  initialSupporterId = '',
  onSubmit,
}: SupportFormProps) {
  const t = useTranslation('apps')
  const [supporterId, setSupporterId] = useState(initialSupporterId)
  const [supportedId, setSupportedId] = useState('')
  const [percentage, setPercentage] = useState<number>(DEFAULT_SUPPORT_PERCENTAGE)
  const [error, setError] = useState<string>()

  const sorted = [...people].sort((a, b) => a.nome.localeCompare(b.nome))
  const supporter = people.find((p) => p.id === supporterId)
  const supportedOptions = sorted.filter(
    (p) =>
      p.id !== supporterId &&
      (!supporter || isQaPerson(p, cargos) === isQaPerson(supporter, cargos)),
  )

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const result = onSubmit({ supporterId, supportedId, percentage })
    setError(result ? supportErrorMessage(result, t.supports) : undefined)
    if (!result) setSupportedId('')
  }

  const swap = () => {
    setSupporterId(supportedId)
    setSupportedId(supporterId)
  }

  return (
    <form onSubmit={submit} aria-label={t.supports.formLabel} className='flex flex-col gap-2'>
      <div className='flex flex-wrap items-end gap-3'>
        <label className='flex min-w-44 flex-1 flex-col gap-1'>
          <span className={fieldLabel}>{t.supports.supporter}</span>
          <Select
            value={supporterId}
            placeholder={t.supports.chooseSupporter}
            options={sorted.map((p) => ({ value: p.id, label: p.nome }))}
            onChange={(e) => {
              setSupporterId(e.target.value)
              if (e.target.value === supportedId) setSupportedId('')
            }}
          />
        </label>
        <Button variant='ghost' size='sm' aria-label={t.supports.swap} onClick={swap}>
          <ArrowLeftRight size={16} aria-hidden />
        </Button>
        <label className='flex min-w-44 flex-1 flex-col gap-1'>
          <span className={fieldLabel}>{t.supports.supported}</span>
          <Select
            value={supportedId}
            placeholder={t.supports.chooseSupported}
            options={supportedOptions.map((p) => ({ value: p.id, label: p.nome }))}
            onChange={(e) => setSupportedId(e.target.value)}
          />
        </label>
        <label className='flex flex-col gap-1'>
          <span className={fieldLabel}>{t.supports.percentage}</span>
          <Input
            type='number'
            min={1}
            max={100}
            value={percentage}
            className='w-24 text-right'
            onChange={(e) => setPercentage(Number(e.target.value))}
          />
        </label>
        <div className='flex gap-1' role='group' aria-label={t.supports.intensity}>
          {SUPPORT_PRESETS.map((preset) => (
            <button
              key={preset.key}
              type='button'
              aria-pressed={percentage === preset.percentage}
              onClick={() => setPercentage(preset.percentage)}
              className={twMerge(
                'h-10 rounded-md border border-line px-2 text-xs text-fg transition-colors hover:text-fg-strong',
                percentage === preset.percentage && 'border-accent bg-accent/10 text-fg-strong',
              )}
            >
              {t.supports[preset.key]} {preset.percentage}%
            </button>
          ))}
        </div>
        <Button type='submit' disabled={!supporterId || !supportedId}>
          <Plus size={14} aria-hidden /> {t.supports.add}
        </Button>
      </div>
      {error && (
        <p role='alert' className='text-sm text-danger'>
          {error}
        </p>
      )}
    </form>
  )
}

export default SupportForm
