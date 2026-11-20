import { useCallback, useEffect, useState } from 'react'
import { seedDemoDataIfNeeded } from '@/features/seed/demoSeed'

/**
 * Lista persistida no localStorage, lida só no cliente (o Next pré-renderiza no servidor,
 * onde não há localStorage). Na primeira leitura grava a demonstração, se ainda não existir.
 *
 * `ready` fica `false` até a leitura terminar — use para não mostrar "vazio" antes da hora.
 */
export function useStoredList<T>(load: () => T[]) {
  const [items, setItems] = useState<T[]>([])
  const [ready, setReady] = useState(false)

  const reload = useCallback(() => {
    seedDemoDataIfNeeded()
    setItems(load())
    setReady(true)
  }, [load])

  useEffect(() => {
    reload()
  }, [reload])

  return { items, setItems, ready, reload }
}
