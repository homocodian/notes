import { createContext, ReactNode, useContext, useState } from "react";

interface IAppState {
  isLoading: boolean;
  isError: { isOpen: boolean; message: string };
  handleLoadingState: (prop: boolean) => void;
  handleErrorState: (prop: { isOpen: boolean; message: string }) => void;
}

const AppState = createContext({} as IAppState);
export const useAppState = () => useContext(AppState);

function AppStateProvider(props: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ isOpen: false, message: "" });
  const values = {
    isLoading,
    isError,
    handleErrorState: setIsError,
    handleLoadingState: setIsLoading,
  };
  return <AppState.Provider value={values}>{props.children}</AppState.Provider>;
}

export default AppStateProvider;
