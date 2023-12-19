'use client'
import { createContext, useContext, useState, ReactNode } from "react";

interface DataContextDTO {
  Work: string
}

interface DataContextData {
  dataContext: DataContextDTO;
  setDataContextData: (
    Work: string,
  ) => void;
}

const DataContext = createContext<DataContextData>({
  dataContext: { Work: '' },
  setDataContextData: () => { },
});

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [dataContext, setDataContext] = useState<DataContextDTO>({ Work: '' });

  const setDataContextData = (
    Work: string,
  ) => {
    setDataContext((prevData) => ({
      Work,
    }));
  };

  return (
    <DataContext.Provider value={{ dataContext, setDataContextData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  return useContext(DataContext);
}
