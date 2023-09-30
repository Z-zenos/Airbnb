import { createContext, useState } from "react";

export const ModalContext = createContext({});

// eslint-disable-next-line react/prop-types
export function ModalContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatePlaceModalOpen, setIsCreatePlaceModalOpen] = useState(false);
  

  return (
    <ModalContext.Provider value={{
      isOpen, isCreatePlaceModalOpen,
      setIsOpen, setIsCreatePlaceModalOpen
    }}>
      { children }
    </ModalContext.Provider>
  );
}