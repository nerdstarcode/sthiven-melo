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
}

/** Tabela com ordenação por coluna (TanStack Table), linhas clicáveis e rodapé opcional. */
export function DataTable<T>({
  data,
  columns,
  emptyMessage = 'Sem dados.',
  onRowClick,
  rowLabel,
  footer,
  caption,
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
