import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/atoms/Input'

export interface NumberCellProps {
  value: number
  /** Chamado ao sair do campo ou com Enter, só se o número for válido e diferente. */
  onCommit: (value: number) => void
  'aria-label': string
  min?: number
}

function parse(text: string): number | null {
  const parsed = Number(text.trim().replace(',', '.'))
  return text.trim() !== '' && Number.isFinite(parsed) ? parsed : null
}

/**
 * Número editável em tabela. Guarda o texto enquanto a pessoa digita (permite "2." ou "")
 * e só confirma ao sair do campo ou com Enter. Esc ou valor inválido voltam ao original.
 */
export function NumberCell({ value, onCommit, min = 0, ...rest }: NumberCellProps) {
  const [text, setText] = useState(String(value))
  /** O Esc dispara um blur logo em seguida; sem isso o blur confirmaria o texto descartado. */
  const discardOnBlur = useRef(false)

  useEffect(() => setText(String(value)), [value])

  const commit = () => {
    if (discardOnBlur.current) {
      discardOnBlur.current = false
      return setText(String(value))
    }
    const parsed = parse(text)
    if (parsed === null || parsed < min) return setText(String(value))
    if (parsed !== value) onCommit(parsed)
  }

  return (
    <Input
      type='text'
      inputMode='decimal'
      aria-label={rest['aria-label']}
      className='ml-auto h-8 w-24 text-right'
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') {
          discardOnBlur.current = true
          e.currentTarget.blur()
        }
      }}
    />
  )
}

export default NumberCell
