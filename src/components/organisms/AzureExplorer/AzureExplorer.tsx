import type { ColumnDef } from '@tanstack/react-table'
import { DownloadCloud, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Badge, type BadgeTone } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { SelectField } from '@/components/molecules/FormField'
import { DataTable } from '@/components/organisms/DataTable'
import { useAzureRequest } from '@/features/location-overview/azure/useAzureRequest'
import * as azureApi from '@/features/location-overview/lib/azure/api'
import type { AzureConfig } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { azureWorkItemToRow } from '@/features/location-overview/lib/azure/mappers'
import { syncSprintToBase, syncTeamToBase } from '@/features/location-overview/lib/azure/syncToBase'
import type {
  AzureIteration,
  AzureIterationTimeFrame,
} from '@/features/location-overview/lib/azure/types'
import { formatDateBR } from '@/features/location-overview/lib/dates'
import { format, useTranslation } from '@/i18n'

/** Leituras usadas pela tela; trocáveis nos testes e stories. */
export type AzureReader = Pick<
  typeof azureApi,
  'listProjects' | 'listTeams' | 'listTeamMembers' | 'listTeamIterations' | 'getIterationWorkItems'
>

export interface AzureExplorerProps {
  config: AzureConfig
  projectId?: string
  teamId?: string
  /** Troca projeto/time (a página grava na URL). */
  onSelect: (selection: { projectId?: string; teamId?: string }) => void
  /** Leva ao fluxo de sprints depois de sincronizar. */
  onOpenFlow?: () => void
  api?: AzureReader
}

const TIME_FRAME_TONE: Record<AzureIterationTimeFrame, BadgeTone> = {
  past: 'neutral',
  current: 'accent',
  future: 'neutral',
}

function RequestMessage({
  loading,
  error,
  onRetry,
}: {
  loading: boolean
  error?: string
  onRetry: () => void
}) {
  const t = useTranslation('apps')
  if (loading) return <p className='text-sm text-fg'>{t.azure.loading}</p>
  if (!error) return null
  return (
    <div role='alert' className='flex flex-wrap items-center gap-3 text-sm text-danger'>
      {error}
      <Button variant='secondary' size='sm' onClick={onRetry}>
        <RefreshCw size={14} aria-hidden /> {t.azure.retry}
      </Button>
    </div>
  )
}

/**
 * Projeto → team → pessoas e sprints do Azure DevOps (só leitura). Sincroniza o team (squad,
 * pessoas e sprints) e os work items de cada sprint na base local do Location Overview.
 */
export function AzureExplorer({
  config,
  projectId,
  teamId,
  onSelect,
  onOpenFlow,
  api = azureApi,
}: AzureExplorerProps) {
  const t = useTranslation('apps')
  const [message, setMessage] = useState<string>()
  const [syncingId, setSyncingId] = useState<string | null>(null)

  const connection = `${config.organization}|${config.pat}`
  const projects = useAzureRequest(connection, (signal) => api.listProjects(config, signal))
  const teams = useAzureRequest(
    `${connection}|${projectId}`,
    projectId ? (signal) => api.listTeams(config, projectId, signal) : null,
  )
  const teamKey = `${connection}|${projectId}|${teamId}`
  const ready = projectId && teamId
  const members = useAzureRequest(
    teamKey,
    ready ? (signal) => api.listTeamMembers(config, projectId, teamId, signal) : null,
  )
  const iterations = useAzureRequest(
    teamKey,
    ready ? (signal) => api.listTeamIterations(config, projectId, teamId, signal) : null,
  )
  const team = teams.data?.find((tm) => tm.id === teamId)

  const syncTeam = () => {
    if (!team || !members.data || !iterations.data) return
    const result = syncTeamToBase({
      teamName: team.name,
      members: members.data,
      iterations: iterations.data,
    })
    setMessage(
      format(t.azure.teamSynced, {
        squad: result.squadCreated ? t.azure.squadCreated : t.azure.squadExisting,
        peopleCreated: result.peopleCreated,
        peopleLinked: result.peopleLinked,
        sprints: result.sprintsSynced,
      }),
    )
  }

  const syncIteration = async (iteration: AzureIteration) => {
    if (!team || !members.data || !projectId) return
    setSyncingId(iteration.id)
    setMessage(undefined)
    try {
      const items = await api.getIterationWorkItems(config, projectId, iteration.path)
      const result = syncSprintToBase({
        teamName: team.name,
        members: members.data,
        iteration,
        workItems: items.map((item) => azureWorkItemToRow(item, config)),
        testRuns: null,
      })
      setMessage(
        format(result.sprintCreated === null ? t.azure.iterationNotSprint : t.azure.iterationSynced, {
          name: iteration.name,
          count: result.workItems,
        }),
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setSyncingId(null)
    }
  }

  const columns: ColumnDef<AzureIteration, unknown>[] = [
    { accessorKey: 'name', header: t.azure.iteration },
    {
      id: 'period',
      header: t.azure.period,
      enableSorting: false,
      cell: ({ row }) => {
        const { startDate, finishDate } = row.original.attributes
        return startDate && finishDate
          ? `${formatDateBR(startDate)} – ${formatDateBR(finishDate)}`
          : '—'
      },
    },
    {
      id: 'timeFrame',
      header: t.azure.timeFrame,
      enableSorting: false,
      cell: ({ row }) => {
        const frame = row.original.attributes.timeFrame
        return <Badge tone={TIME_FRAME_TONE[frame]}>{t.azure[frame]}</Badge>
      },
    },
    {
      id: 'actions',
      header: t.common.actions,
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant='secondary'
          size='sm'
          disabled={syncingId !== null || !members.data}
          aria-label={format(t.azure.syncIteration, { name: row.original.name })}
          onClick={() => syncIteration(row.original)}
        >
          <DownloadCloud size={14} aria-hidden />
          {syncingId === row.original.id ? t.azure.syncing : 'Work items'}
        </Button>
      ),
    },
  ]

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <SelectField
            label={t.azure.project}
            value={projectId ?? ''}
            placeholder={t.azure.selectProject}
            disabled={!projects.data}
            options={(projects.data ?? []).map((p) => ({ value: p.id, label: p.name }))}
            onChange={(e) => {
              setMessage(undefined)
              onSelect({ projectId: e.target.value })
            }}
          />
          <RequestMessage
            loading={projects.loading}
            error={projects.error}
            onRetry={projects.reload}
          />
        </div>
        {projectId && (
          <div className='flex flex-col gap-2'>
            <SelectField
              label={t.azure.team}
              value={teamId ?? ''}
              placeholder={t.azure.selectTeam}
              disabled={!teams.data?.length}
              options={(teams.data ?? []).map((tm) => ({ value: tm.id, label: tm.name }))}
              onChange={(e) => {
                setMessage(undefined)
                onSelect({ projectId, teamId: e.target.value })
              }}
            />
            <RequestMessage loading={teams.loading} error={teams.error} onRetry={teams.reload} />
            {teams.data?.length === 0 && <p className='text-sm text-fg'>{t.azure.noTeams}</p>}
          </div>
        )}
      </div>

      {team && (
        <>
          <div className='flex flex-wrap items-center gap-3'>
            <Button disabled={!members.data || !iterations.data} onClick={syncTeam}>
              <DownloadCloud size={14} aria-hidden /> {t.azure.syncTeam}
            </Button>
            {onOpenFlow && (
              <Button variant='ghost' onClick={onOpenFlow}>
                {t.azure.openFlow}
              </Button>
            )}
          </div>
          {message && (
            <p role='status' className='text-sm text-fg-strong'>
              {message}
            </p>
          )}

          <section aria-labelledby='azure-members' className='flex flex-col gap-2'>
            <h2 id='azure-members' className='text-sm font-semibold text-fg-strong'>
              {format(t.azure.members, { count: members.data?.length ?? 0 })}
            </h2>
            <RequestMessage
              loading={members.loading}
              error={members.error}
              onRetry={members.reload}
            />
            {members.data?.length === 0 && <p className='text-sm text-fg'>{t.azure.noMembers}</p>}
            <div className='flex flex-wrap gap-1.5'>
              {(members.data ?? []).map((m) => (
                <Badge key={m.identity.id}>{m.identity.displayName}</Badge>
              ))}
            </div>
          </section>

          <section aria-labelledby='azure-iterations' className='flex flex-col gap-2'>
            <h2 id='azure-iterations' className='text-sm font-semibold text-fg-strong'>
              {t.azure.iterations}
            </h2>
            <p className='text-xs text-fg'>{t.azure.iterationsHint}</p>
            <RequestMessage
              loading={iterations.loading}
              error={iterations.error}
              onRetry={iterations.reload}
            />
            {iterations.data && (
              <DataTable
                data={iterations.data}
                columns={columns}
                caption={t.azure.iterations}
                emptyMessage={t.sprints.empty}
              />
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default AzureExplorer
