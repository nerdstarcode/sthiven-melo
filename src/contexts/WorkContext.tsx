import { createContext, useContext, useState, type ReactNode } from 'react'
import { NO_WORK_AREA, type WorkSelection } from '@/constants/work'

interface DataContextDTO {
  Work: WorkSelection
}

interface DataContextData {
  dataContext: DataContextDTO
  setDataContextData: (work: WorkSelection) => void
}

export const DataContext = createContext<DataContextData>({
  dataContext: { Work: NO_WORK_AREA },
  setDataContextData: () => {},
})

interface DataContextProviderProps {
  children: ReactNode
  initialWork?: WorkSelection
}

export function DataContextProvider({
  children,
  initialWork = NO_WORK_AREA,
}: DataContextProviderProps) {
  const [dataContext, setDataContext] = useState<DataContextDTO>({ Work: initialWork })

  const setDataContextData = (work: WorkSelection) => setDataContext({ Work: work })

  return (
    <DataContext.Provider value={{ dataContext, setDataContextData }}>
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext() {
  return useContext(DataContext)
}
