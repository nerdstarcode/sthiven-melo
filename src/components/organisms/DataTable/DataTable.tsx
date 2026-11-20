import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { useState, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface DataTableColumnMeta {
  align?: 'left' | 'right'
  numeric?: boolean
}

declare module '@tanstack/react-table' {
  // Augmentation do TanStack: precisa ter a mesma assinatura genérica e nenhum membro próprio.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
  interface ColumnMeta<TData, TValue> extends DataTableColumnMeta {}
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T, unknown>[]
  emptyMessage?: string
  onRowClick?: (row: T) => void
  /** Rótulo acessível de cada linha clicável. */
  rowLabel?: (row: T) => string
  /** Valores do rodapé por id de coluna. */
  footer?: Record<string, ReactNode>
  caption?: string
  /** Seleção de linhas por checkbox (controlada): adiciona a coluna de seleção no início. */
  selection?: DataTableSelection<T>
}

export interface DataTableSelection<T> {
  selected: ReadonlySet<string>
  onChange: (selected: Set<string>) => void
  getId: (row: T) => string
  /** Rótulo do checkbox de cada linha. */
  rowLabel: (row: T) => string
  /** Rótulo do checkbox que marca/desmarca todas. */
  allLabel: string
}

const CHECKBOX = 'size-4 cursor-pointer accent-accent'
const SELECT_CELL = 'w-10 px-3 py-2'

/** Checkbox do cabeçalho: marca/desmarca todas e fica parcial quando só algumas estão marcadas. */
function SelectAllCheckbox<T>({ data, selection }: { data: T[]; selection: DataTableSelection<T> }) {
  const { selected, onChange, getId, allLabel } = selection
  const ids = data.map(getId)
  const count = ids.filter((id) => selected.has(id)).length
  const all = count > 0 && count === ids.length
  return (
    <input
      type='checkbox'
      aria-label={allLabel}
      className={CHECKBOX}
      checked={all}
      ref={(el) => {
        if (el) el.indeterminate = count > 0 && !all
      }}
      onChange={() => onChange(all ? new Set() : new Set(ids))}
    />
  )
}

function SelectRowCheckbox<T>({ row, selection }: { row: T; selection: DataTableSelection<T> }) {
  const { selected, onChange, getId, rowLabel } = selection
  const id = getId(row)
  return (
    <input
      type='checkbox'
      aria-label={rowLabel(row)}
      className={CHECKBOX}
      checked={selected.has(id)}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      onChange={() => {
        const next = new Set(selected)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        onChange(next)
      }}
    />
  )
}

/** Tabela com ordenação por coluna (TanStack Table), linhas clicáveis, seleção e rodapé opcionais. */
export function DataTable<T>({
  data,
  columns,
  emptyMessage = 'Sem dados.',
  onRowClick,
  rowLabel,
  footer,
  caption,
  selection,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (!data.length) {
    return (
      <div className='rounded-md border border-line p-10 text-center'>
        <p className='text-sm text-fg'>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className='w-full overflow-x-auto rounded-md border border-line'>
      <table className='w-full text-sm'>
        {caption && <caption className='sr-only'>{caption}</caption>}
        <thead className='bg-surface-elevated'>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {selection && (
                <th scope='col' className={twMerge(SELECT_CELL, 'border-b border-line text-left')}>
                  <SelectAllCheckbox data={data} selection={selection} />
                </th>
              )}
              {group.headers.map((header) => {
                const meta = header.column.columnDef.meta ?? {}
                const sorted = header.column.getIsSorted()
                const canSort = header.column.getCanSort()
                return (
                  <th
                    key={header.id}
                    scope='col'
                    aria-sort={
                      sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined
                    }
                    className={twMerge(
                      'border-b border-line px-3 py-2 font-semibold whitespace-nowrap text-fg-strong',
                      meta.align === 'right' ? 'text-right' : 'text-left',
                    )}
                  >
                    {canSort ? (
                      <button
                        type='button'
                        onClick={header.column.getToggleSortingHandler()}
                        className='inline-flex items-center gap-1 hover:text-accent'
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span aria-hidden>
                          {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : ''}
                        </span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onRowClick(row.original)
                      }
                    }
                  : undefined
              }
              tabIndex={onRowClick ? 0 : undefined}
              aria-label={onRowClick ? rowLabel?.(row.original) : undefined}
              className={twMerge(
                'border-b border-line/60 odd:bg-surface even:bg-surface-muted',
                onRowClick &&
                  'cursor-pointer hover:bg-surface-elevated focus-visible:outline-1 focus-visible:outline-accent',
              )}
            >
              {selection && (
                <td className={SELECT_CELL}>
                  <SelectRowCheckbox row={row.original} selection={selection} />
                </td>
              )}
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta ?? {}
                return (
                  <td
                    key={cell.id}
                    className={twMerge(
                      'px-3 py-2 whitespace-nowrap text-fg-strong',
                      meta.align === 'right' && 'text-right',
                      meta.numeric && 'font-mono tabular-nums',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot className='bg-surface-elevated'>
            <tr>
              {selection && <td />}
              {table.getAllLeafColumns().map((column) => {
                const meta = column.columnDef.meta ?? {}
                return (
                  <td
                    key={column.id}
                    className={twMerge(
                      'px-3 py-2 text-xs font-semibold text-fg-strong',
                      meta.align === 'right' && 'text-right',
                      meta.numeric && 'font-mono tabular-nums',
                    )}
                  >
                    {footer[column.id] ?? ''}
                  </td>
                )
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

export default DataTable
