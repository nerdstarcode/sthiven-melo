import { useCallback, useEffect, useState } from 'react'
import { isAbortError } from '@/features/location-overview/lib/azure/client'

export interface AzureRequestState<T> {
  data: T | undefined
  loading: boolean
  error: string | undefined
  reload: () => void
}

/**
 * Executa uma leitura do Azure DevOps e cancela a anterior quando `key` muda (ou ao desmontar).
 * Com `request` nulo, não busca nada (ex.: nenhum projeto escolhido).
 */
export function useAzureRequest<T>(
  key: string,
  request: ((signal: AbortSignal) => Promise<T>) | null,
): AzureRequestState<T> {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setData(undefined)
    setError(undefined)
    if (!request) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    request(controller.signal)
      .then((result) => setData(result))
      .catch((reason: unknown) => {
        if (!isAbortError(reason)) {
          setError(reason instanceof Error ? reason.message : String(reason))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
    // `request` muda a cada render; quem decide refazer a busca é `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])
  return { data, loading, error, reload }
}
