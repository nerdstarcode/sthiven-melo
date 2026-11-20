import { CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { TextField } from '@/components/molecules/FormField'
import type { AzureConfig } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { format, useTranslation } from '@/i18n'

export interface AzureTokenFormProps {
  initialConfig: AzureConfig
  onSave: (config: AzureConfig) => void
  /** Resolve com a quantidade de projetos visíveis para o token. */
  onTest: (config: AzureConfig) => Promise<number>
  onClear?: () => void
}

type Feedback = { kind: 'success' | 'error'; message: string } | null

const parseList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

/**
 * Conexão com o Azure DevOps: organização, PAT e os campos usados nos pontos. Explica as
 * permissões mínimas (somente leitura) que o token precisa.
 */
export function AzureTokenForm({ initialConfig, onSave, onTest, onClear }: AzureTokenFormProps) {
  const t = useTranslation('apps')
  const [organization, setOrganization] = useState(initialConfig.organization)
  const [pat, setPat] = useState(initialConfig.pat)
  const [storyPointsField, setStoryPointsField] = useState(initialConfig.storyPointsField)
  const [pointTypes, setPointTypes] = useState(initialConfig.pointTypes.join(', '))
  const [showPat, setShowPat] = useState(false)
  const [testing, setTesting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const canSubmit = organization.trim() !== '' && pat.trim() !== ''
  const buildConfig = (): AzureConfig => ({
    ...initialConfig,
    organization: organization.trim(),
    pat: pat.trim(),
    storyPointsField: storyPointsField.trim() || initialConfig.storyPointsField,
    pointTypes: parseList(pointTypes).length ? parseList(pointTypes) : initialConfig.pointTypes,
  })

  const test = async () => {
    setTesting(true)
    setFeedback(null)
    try {
      const count = await onTest(buildConfig())
      setFeedback({ kind: 'success', message: format(t.azure.testOk, { count }) })
    } catch (error) {
      setFeedback({ kind: 'error', message: error instanceof Error ? error.message : String(error) })
    } finally {
      setTesting(false)
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    onSave(buildConfig())
    setFeedback({ kind: 'success', message: t.azure.saved })
  }

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]'>
      <form onSubmit={submit} className='flex flex-col gap-4'>
        <TextField
          label={t.azure.organization}
          hint={t.azure.organizationHint}
          value={organization}
          autoComplete='off'
          onChange={(e) => setOrganization(e.target.value)}
        />
        <div className='relative'>
          <TextField
            label={t.azure.pat}
            hint={t.azure.patHint}
            type={showPat ? 'text' : 'password'}
            value={pat}
            autoComplete='off'
            className='pr-10'
            onChange={(e) => setPat(e.target.value)}
          />
          <Button
            variant='ghost'
            size='sm'
            className='absolute top-6 right-1'
            aria-label={showPat ? t.azure.hidePat : t.azure.showPat}
            onClick={() => setShowPat((v) => !v)}
          >
            {showPat ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
          </Button>
        </div>
        <TextField
          label={t.azure.storyPointsField}
          hint={t.azure.storyPointsFieldHint}
          value={storyPointsField}
          onChange={(e) => setStoryPointsField(e.target.value)}
        />
        <TextField
          label={t.azure.pointTypes}
          hint={t.azure.pointTypesHint}
          value={pointTypes}
          onChange={(e) => setPointTypes(e.target.value)}
        />

        {feedback && (
          <p
            role='status'
            className={
              feedback.kind === 'success'
                ? 'flex items-center gap-2 text-sm text-fg-strong'
                : 'text-sm text-danger'
            }
          >
            {feedback.kind === 'success' && (
              <CheckCircle2 size={16} className='text-success' aria-hidden />
            )}
            {feedback.message}
          </p>
        )}

        <div className='flex flex-wrap gap-2'>
          <Button type='submit' disabled={!canSubmit}>
            {t.azure.save}
          </Button>
          <Button variant='secondary' disabled={!canSubmit || testing} onClick={test}>
            {testing ? t.azure.testing : t.azure.test}
          </Button>
          {onClear && (
            <Button
              variant='ghost'
              onClick={() => {
                onClear()
                setOrganization('')
                setPat('')
                setFeedback(null)
              }}
            >
              {t.azure.clear}
            </Button>
          )}
        </div>
      </form>

      <aside
        aria-labelledby='azure-scopes-title'
        className='flex flex-col gap-3 rounded-md border border-line bg-surface-elevated p-4 text-sm'
      >
        <h2 id='azure-scopes-title' className='flex items-center gap-2 font-semibold text-fg-strong'>
          <ShieldCheck size={16} className='text-success' aria-hidden /> {t.azure.scopesTitle}
        </h2>
        <p className='text-fg'>{t.azure.scopesIntro}</p>
        <ul className='flex flex-col gap-2'>
          {t.azure.scopes.map((scope) => (
            <li key={scope.name}>
              <span className='font-medium text-fg-strong'>
                {scope.name}: {scope.level}
              </span>
              <span className='block text-xs text-fg'>{scope.why}</span>
            </li>
          ))}
        </ul>
        <p className='text-xs text-fg'>{t.azure.scopesSafety}</p>
      </aside>
    </div>
  )
}

export default AzureTokenForm
