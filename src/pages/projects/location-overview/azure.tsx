import { Settings } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { AzureExplorer } from '@/components/organisms/AzureExplorer'
import { AzureTokenForm } from '@/components/organisms/AzureTokenForm'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { listProjects } from '@/features/location-overview/lib/azure/api'
import {
  clearAzureConfig,
  isAzureConfigured,
  loadAzureConfig,
  saveAzureConfig,
  type AzureConfig,
} from '@/features/location-overview/lib/azure/azureConfigStorage'
import { locationOverviewRoutes } from '@/features/location-overview/navigation'
import { useTranslation } from '@/i18n'

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) || undefined

/** Integração com o Azure DevOps: token (só leitura) e projeto → team → sprints. */
export default function AzurePage() {
  const t = useTranslation('apps')
  const router = useRouter()
  const [config, setConfig] = useState<AzureConfig | null>(null)
  const [editing, setEditing] = useState(false)

  // localStorage só existe no cliente.
  useEffect(() => setConfig(loadAzureConfig()), [])

  const configured = config !== null && isAzureConfigured(config)
  const showForm = config !== null && (!configured || editing)

  return (
    <LocationOverviewLayout
      title={t.azure.title}
      description={t.azure.description}
      actions={
        configured && !editing ? (
          <Button variant='secondary' onClick={() => setEditing(true)}>
            <Settings size={14} aria-hidden /> {t.azure.settings}
          </Button>
        ) : undefined
      }
    >
      {config === null && <p className='text-sm text-fg'>{t.common.loading}</p>}
      {showForm && (
        <div className='flex flex-col gap-4'>
          {!configured && <p className='text-sm text-fg'>{t.azure.notConfigured}</p>}
          <AzureTokenForm
            initialConfig={config}
            onTest={async (draft) => (await listProjects(draft)).length}
            onSave={(next) => {
              saveAzureConfig(next)
              setConfig(next)
              setEditing(false)
            }}
            onClear={
              configured
                ? () => {
                    clearAzureConfig()
                    setConfig(loadAzureConfig())
                  }
                : undefined
            }
          />
        </div>
      )}
      {configured && !editing && (
        <AzureExplorer
          config={config}
          projectId={first(router.query.project)}
          teamId={first(router.query.team)}
          onSelect={({ projectId, teamId }) =>
            router.push(
              { pathname: router.pathname, query: { project: projectId, ...(teamId && { team: teamId }) } },
              undefined,
              { shallow: true },
            )
          }
          onOpenFlow={() => router.push(locationOverviewRoutes.sprints)}
        />
      )}
    </LocationOverviewLayout>
  )
}
