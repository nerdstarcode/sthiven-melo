import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { DataTable } from './DataTable'

interface Row {
  id: string
  nome: string
  pontos: number
}

const rows: Row[] = [
  { id: '1', nome: 'Bruno', pontos: 5 },
  { id: '2', nome: 'Ana', pontos: 8 },
]

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'nome', header: 'Nome' },
  { accessorKey: 'pontos', header: 'Pontos', meta: { align: 'right', numeric: true } },
]

const bodyNames = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent)

function SelectionHarness({ onRowClick }: { onRowClick?: (row: Row) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  return (
    <>
      <output>{[...selected].sort().join(',')}</output>
      <DataTable
        data={rows}
        columns={columns}
        onRowClick={onRowClick}
        selection={{
          selected,
          onChange: setSelected,
          getId: (row) => row.id,
          rowLabel: (row) => `Selecionar ${row.nome}`,
          allLabel: 'Selecionar todas',
        }}
      />
    </>
  )
}

describe('DataTable · seleção', () => {
  it('marca e desmarca linhas', async () => {
    const user = userEvent.setup()
    render(<SelectionHarness />)
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar Ana' }))
    expect(screen.getByRole('status')).toHaveTextContent('2')
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar Ana' }))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('o checkbox do cabeçalho marca todas e fica parcial com algumas', async () => {
    const user = userEvent.setup()
    render(<SelectionHarness />)
    const all = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Selecionar todas' })
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar Bruno' }))
    expect(all.indeterminate).toBe(true)
    await user.click(all)
    expect(screen.getByRole('status')).toHaveTextContent('1,2')
    await user.click(all)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('marcar o checkbox não dispara o clique da linha', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<SelectionHarness onRowClick={onRowClick} />)
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar Ana' }))
    expect(onRowClick).not.toHaveBeenCalled()
  })
})

describe('DataTable', () => {
  it('mostra a mensagem de vazio', () => {
    render(<DataTable data={[]} columns={columns} emptyMessage='Nada aqui' />)
    expect(screen.getByText('Nada aqui')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('ordena ao clicar no cabeçalho (asc, depois desc)', async () => {
    render(<DataTable data={rows} columns={columns} />)
    expect(bodyNames()).toEqual(['Bruno', 'Ana'])
    const header = screen.getByRole('button', { name: /Nome/ })
    await userEvent.click(header)
    expect(bodyNames()).toEqual(['Ana', 'Bruno'])
    expect(screen.getByRole('columnheader', { name: /Nome/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    )
    await userEvent.click(header)
    expect(bodyNames()).toEqual(['Bruno', 'Ana'])
  })

  it('linha clicável responde a clique e Enter', async () => {
    const onRowClick = vi.fn()
    render(
      <DataTable
        data={rows}
        columns={columns}
        onRowClick={onRowClick}
        rowLabel={(r) => `Abrir ${r.nome}`}
      />,
    )
    await userEvent.click(screen.getByRole('row', { name: 'Abrir Ana' }))
    screen.getByRole('row', { name: 'Abrir Bruno' }).focus()
    await userEvent.keyboard('{Enter}')
    expect(onRowClick.mock.calls.map(([r]) => r.nome)).toEqual(['Ana', 'Bruno'])
  })

  it('colunas numéricas são alinhadas à direita', () => {
    render(<DataTable data={rows} columns={columns} />)
    expect(screen.getByText('8')).toHaveClass('text-right', 'font-mono')
  })

  it('renderiza o rodapé por id de coluna', () => {
    render(<DataTable data={rows} columns={columns} footer={{ pontos: 13 }} />)
    const footerRow = screen.getAllByRole('row').at(-1)!
    expect(
      within(footerRow)
        .getAllByRole('cell')
        .map((c) => c.textContent),
    ).toEqual(['', '13'])
  })
})
