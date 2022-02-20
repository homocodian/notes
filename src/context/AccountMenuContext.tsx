import { createContext, useState, useContext, ReactNode } from "react";

interface IAccountMenuContext {
  isProfileOpen: boolean;
  isError: boolean;
  setIsProfileOpen: (prop: boolean) => void;
  setIsError: (prop: boolean) => void;
}

const AccountMenuContext = createContext({} as IAccountMenuContext);
export const useAccountMenu = () => useContext(AccountMenuContext);

type AccountMenuProviderProps = {
  children: ReactNode;
};

function AccountMenuProvider({ children }: AccountMenuProviderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <AccountMenuContext.Provider
      value={{
        isProfileOpen,
        isError,
        setIsProfileOpen,
        setIsError,
      }}
    >
      {children}
    </AccountMenuContext.Provider>
  );
}

export default AccountMenuProvider;
