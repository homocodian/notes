import { createContext, ReactNode, useContext, useState } from 'react';

type DrawerValues = {
  isDrawerOpen: boolean,
  setDrawerIsOpen: (value:boolean) => void
}

const DrawerContext = createContext({} as DrawerValues);

export const useDrawer = () => useContext(DrawerContext);

type DrawerProviderProps = {
  children: ReactNode
}

function DrawerProvider({children}:DrawerProviderProps) {
  const [isDrawerOpen,setDrawerIsOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{isDrawerOpen,setDrawerIsOpen}}>
      {children}
    </DrawerContext.Provider>
  )
}

export default DrawerProvider
