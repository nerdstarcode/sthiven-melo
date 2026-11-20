import { act, renderHook, waitFor } from '@testing-library/react'
import { loadPeople, savePeople } from '@/features/location-overview/lib/peopleStorage'
import { demoPeople } from '@/features/seed/demoSeed'
import { useStoredList } from './useStoredList'

describe('useStoredList', () => {
  it('grava a demonstração na primeira leitura e marca ready', async () => {
    const { result } = renderHook(() => useStoredList(loadPeople))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.items).toHaveLength(demoPeople.length)
  })

  it('não sobrescreve dados que o visitante já tem', async () => {
    window.localStorage.setItem('portfolio:demo-seeded', '1')
    savePeople([])
    const { result } = renderHook(() => useStoredList(loadPeople))
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.items).toEqual([])
  })

  it('reload relê o storage', async () => {
    const { result } = renderHook(() => useStoredList(loadPeople))
    await waitFor(() => expect(result.current.ready).toBe(true))
    savePeople([])
    act(() => result.current.reload())
    expect(result.current.items).toEqual([])
  })
})
