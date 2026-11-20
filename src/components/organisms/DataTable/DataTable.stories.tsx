import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { expect, fn, userEvent, within } from 'storybook/test'
import { DataTable } from './DataTable'

interface Row {
  id: string
  nome: string
  nivel: string
  percentual: number
}

const rows: Row[] = [
  { id: '1', nome: 'Bruno (exemplo)', nivel: 'JR', percentual: 100 },
  { id: '2', nome: 'Ana (exemplo)', nivel: 'SR', percentual: 100 },
  { id: '3', nome: 'Sthiven Melo', nivel: 'PL', percentual: 50 },
]

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'nome', header: 'Nome' },
  { accessorKey: 'nivel', header: 'Nível' },
  {
    accessorKey: 'percentual',
    header: '%',
    meta: { align: 'right', numeric: true },
    cell: ({ getValue }) => `${getValue<number>()}%`,
  },
]

const meta = {
  title: 'Organisms/DataTable',
  component: DataTable<Row>,
  tags: ['autodocs'],
  args: { data: rows, columns, caption: 'Pessoas' },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Tabela genérica sobre TanStack Table: ordenação ao clicar no cabeçalho, linhas clicáveis (também via teclado), rodapé por coluna e estado vazio. Colunas aceitam \`meta.align\` e \`meta.numeric\`. É a base das tabelas de pessoas, níveis, squads, sprints e alocações.

\`\`\`tsx
<DataTable data={people} columns={columns} onRowClick={edit} rowLabel={(p) => \`Editar \${p.nome}\`} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof DataTable<Row>>

export default meta
type Story = StoryObj<typeof meta>

export const Ordenavel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Nome/ }))
    const firstCell = canvas.getAllByRole('row')[1].querySelector('td')
    await expect(firstCell).toHaveTextContent('Ana (exemplo)')
  },
}

export const LinhaClicavel: Story = {
  args: { onRowClick: fn(), rowLabel: (row: Row) => `Editar ${row.nome}` },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('row', { name: 'Editar Sthiven Melo' }))
    await expect(args.onRowClick).toHaveBeenCalledWith(rows[2])
  },
}

export const ComRodape: Story = { args: { footer: { nome: 'Total', percentual: '250%' } } }

export const Vazia: Story = { args: { data: [], emptyMessage: 'Nenhuma pessoa cadastrada.' } }
