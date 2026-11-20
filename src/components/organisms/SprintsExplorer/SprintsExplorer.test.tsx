import { screen, within } from '@testing-library/react'
import { useState } from 'react'
import type { SprintsSelection } from '@/features/location-overview/navigation'
import {
  loadPersonAllocations,
  savePersonAllocations,
} from '@/features/location-overview/lib/personAllocationsStorage'
import { loadPersonSupports } from '@/features/location-overview/lib/personSupportsStorage'
import { loadSprints } from '@/features/location-overview/lib/sprintsStorage'
import { seedDemoDataIfNeeded } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { SprintsExplorer } from './SprintsExplorer'

/** 20/11/2026: sp-10 fechada, sp-11 atual, sp-12 aberta. */
const TODAY = new Date(2026, 10, 20)

function Harness({
  initial = {},
  onNavigate,
}: {
  initial?: SprintsSelection
  onNavigate?: (selection: SprintsSelection) => void
}) {
  const [selection, setSelection] = useState(initial)
  return (
    <SprintsExplorer
      {...selection}
      today={TODAY}
      confirm={() => true}
      onNavigate={(next) => {
        onNavigate?.(next)
        setSelection(next)
      }}
    />
  )
}

const trail = () => screen.getByRole('navigation', { name: 'Você está em' })

describe('SprintsExplorer · linha do tempo', () => {
  it('mostra atual + abertas por padrão e as fechadas no filtro', async () => {
    const { user } = renderWithProviders(<Harness />)
    expect(await screen.findByRole('row', { name: 'Abrir Sprint 11 - FY26-27' })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: 'Abrir Sprint 10 - FY26-27' })).not.toBeInTheDocument()
    expect(within(screen.getByRole('row', { name: 'Abrir Sprint 11 - FY26-27' })).getByText('Atual')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fechadas' }))
    expect(screen.getByRole('row', { name: 'Abrir Sprint 10 - FY26-27' })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: 'Abrir Sprint 11 - FY26-27' })).not.toBeInTheDocument()
  })

  it('cria uma sprint pelo modal', async () => {
    const { user } = renderWithProviders(<Harness />)
    await user.click(await screen.findByRole('button', { name: 'Nova sprint' }))
    const number = screen.getByLabelText('Número da sprint')
    await user.clear(number)
    await user.type(number, '13')
    await user.type(screen.getByLabelText('Ano fiscal'), 'fy26-27')
    await user.type(screen.getByLabelText('Início'), '2026-12-14')
    await user.type(screen.getByLabelText('Fim'), '2026-12-25')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(loadSprints().find((s) => s.number === 13)).toMatchObject({ fiscalYear: 'FY26-27' })
    expect(screen.getByRole('row', { name: 'Abrir Sprint 13 - FY26-27' })).toBeInTheDocument()
  })

  it('exclui uma sprint', async () => {
    const { user } = renderWithProviders(<Harness />)
    await user.click(await screen.findByRole('button', { name: 'Excluir Sprint 12 - FY26-27' }))
    expect(loadSprints().some((s) => s.id === 'sp-12')).toBe(false)
  })
})

describe('SprintsExplorer · squads da sprint', () => {
  it('abre a sprint com um card por squad e a situação de cada uma', async () => {
    const onNavigate = vi.fn()
    const { user } = renderWithProviders(<Harness onNavigate={onNavigate} />)
    await user.click(await screen.findByRole('row', { name: 'Abrir Sprint 11 - FY26-27' }))
    expect(onNavigate).toHaveBeenCalledWith({ sprintId: 'sp-11' })
    expect(within(trail()).getByText('Sprint 11 - FY26-27')).toHaveAttribute('aria-current', 'page')

    // Plataforma: 29 SP planejados × máximo com extensão 22,8 → sobrecarga (vem primeiro)
    const cards = within(screen.getByRole('list', { name: 'Squads da sprint' })).getAllByRole('button')
    expect(cards[0]).toHaveAccessibleName('Abrir Plataforma')
    expect(within(cards[0]).getByText('Sobrecarga')).toBeInTheDocument()
    const web = screen.getByRole('button', { name: 'Abrir Frontend Web' })
    expect(within(web).getByText('Acima do previsto')).toBeInTheDocument()
  })

  it('lista os apoios da sprint e copia da sprint anterior', async () => {
    const { user } = renderWithProviders(<Harness initial={{ sprintId: 'sp-12' }} />)
    const supports = await screen.findByRole('region', { name: 'Apoios da sprint' })
    expect(within(supports).getByText('Nenhum apoio cadastrado nesta sprint.')).toBeInTheDocument()
    await user.click(within(supports).getByRole('button', { name: 'Copiar de Sprint 11 - FY26-27' }))
    expect(within(supports).getByText('1 apoio(s) copiado(s) de Sprint 11 - FY26-27.')).toBeInTheDocument()
    expect(within(supports).getByRole('cell', { name: 'Ana (exemplo)' })).toBeInTheDocument()
    expect(loadPersonSupports().filter((s) => s.sprintId === 'sp-12')).toHaveLength(1)
  })

  it('squad sem alocação oferece a alocação padrão e abre o grupo criado', async () => {
    seedDemoDataIfNeeded()
    savePersonAllocations(loadPersonAllocations().filter((a) => !(a.squadId === 'sq-data' && a.sprintId === 'sp-10')))
    const { user } = renderWithProviders(<Harness initial={{ sprintId: 'sp-10' }} />)
    const empty = await screen.findByRole('listitem', { name: 'Dados sem alocação' })
    await user.click(within(empty).getByRole('button', { name: 'Criar alocação padrão' }))
    const dialog = screen.getByRole('dialog', { name: 'Nova alocação de sprint' })
    expect(within(dialog).getByLabelText('% de Carla (exemplo)')).toHaveValue(100)
    await user.click(within(dialog).getByRole('button', { name: /^Alocar 2 pessoa/ }))

    expect(screen.getByRole('heading', { name: 'Dados · Sprint 10 - FY26-27' })).toBeInTheDocument()
    expect(loadPersonAllocations().filter((a) => a.squadId === 'sq-data' && a.sprintId === 'sp-10')).toHaveLength(2)
  })
})

describe('SprintsExplorer · alocação da squad', () => {
  const open = { sprintId: 'sp-10', squadId: 'sq-web' }

  it('mostra pessoas, apoios, cobertura e a trilha completa', async () => {
    renderWithProviders(<Harness initial={open} />)
    expect(await screen.findByRole('heading', { name: 'Frontend Web · Sprint 10 - FY26-27' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Ana (exemplo)' })).toBeInTheDocument()
    expect(screen.getByText('Apoia Bruno (exemplo) (25%)')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Cobertura de skills' })).toBeInTheDocument()
    expect(within(trail()).getByRole('link', { name: 'Sprint 10 - FY26-27' })).toHaveAttribute(
      'href',
      '/projects/location-overview/sprints?sprint=sp-10',
    )
    expect(within(trail()).getByText('Frontend Web')).toHaveAttribute('aria-current', 'page')
  })

  it('adiciona pela linha do topo com a % que sobra e atualiza a cobertura', async () => {
    const { user } = renderWithProviders(<Harness initial={open} />)
    await user.selectOptions(await screen.findByLabelText('Pessoa para adicionar'), 'demo-diego')
    expect(screen.getByLabelText('% da nova pessoa')).toHaveValue(100)
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(screen.getByRole('cell', { name: 'Diego (exemplo)' })).toBeInTheDocument()
    const tests = screen.getByText('Testes automatizados', { selector: 'span' }).closest('li')!
    expect(within(tests).getByText('Coberta')).toBeInTheDocument()
  })

  it('edita a % na tabela e recusa passar de 100% na sprint', async () => {
    const { user } = renderWithProviders(<Harness initial={open} />)
    const cell = await screen.findByLabelText('% de Sthiven Melo')
    await user.clear(cell)
    await user.type(cell, '80{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent('já tem 50% em outras squads')
    expect(loadPersonAllocations().find((a) => a.id === 'al-sthiven-web-sp-10')!.percentage).toBe(50)
  })

  it('remove com desfazer', async () => {
    const { user } = renderWithProviders(<Harness initial={open} />)
    await user.click(await screen.findByRole('button', { name: 'Remover Ana (exemplo)' }))
    expect(screen.queryByRole('cell', { name: 'Ana (exemplo)' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Desfazer' }))
    expect(screen.getByRole('cell', { name: 'Ana (exemplo)' })).toBeInTheDocument()
  })

  it('mover todos leva o grupo para a nova squad e abre o destino', async () => {
    const { user } = renderWithProviders(<Harness initial={{ sprintId: 'sp-10', squadId: 'sq-data' }} />)
    await user.click(await screen.findByRole('button', { name: 'Alterar squad de todos' }))
    const dialog = screen.getByRole('dialog')
    await user.selectOptions(within(dialog).getByLabelText('Nova squad'), 'sq-web')
    await user.click(within(dialog).getByRole('button', { name: 'Mover 1 pessoa(s)' }))
    expect(screen.getByRole('heading', { name: 'Frontend Web · Sprint 10 - FY26-27' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Carla (exemplo)' })).toBeInTheDocument()
  })

  it('"Cadastrar pessoa" pede o atalho para a tela de pessoas', async () => {
    const onNavigate = vi.fn()
    const { user } = renderWithProviders(<Harness initial={open} onNavigate={onNavigate} />)
    await user.click(await screen.findByRole('button', { name: 'Cadastrar pessoa' }))
    expect(onNavigate).toHaveBeenCalledWith({ createPerson: true })
  })
})
