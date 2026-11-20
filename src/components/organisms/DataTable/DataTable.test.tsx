import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ColumnDef } from '@tanstack/react-table'
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
