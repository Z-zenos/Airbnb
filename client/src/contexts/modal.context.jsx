import { createContext, useState } from "react";

export const ModalContext = createContext({});

// eslint-disable-next-line react/prop-types
export function ModalContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatePlaceModalOpen, setIsCreatePlaceModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isIntlModalOpen, setIsIntlModalOpen] = useState(false);
  const [isInterestSelectModalOpen, setIsInterestSelectModalOpen] = useState(false);
  const [isSearchAddressModalOpen, setIsSearchAddressModalOpen] = useState(false);
  const [isLanguageSelectModalOpen, setIsLanguageSelectModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  
  return (
    <ModalContext.Provider value={{
      isOpen, setIsOpen,
      isCreatePlaceModalOpen, setIsCreatePlaceModalOpen,
      isFilterModalOpen, setIsFilterModalOpen,
      isImageModalOpen, setIsImageModalOpen,
      isSearchModalOpen, setIsSearchModalOpen,
      isIntlModalOpen, setIsIntlModalOpen,
      isInterestSelectModalOpen, setIsInterestSelectModalOpen,
      isSearchAddressModalOpen, setIsSearchAddressModalOpen,
      isLanguageSelectModalOpen, setIsLanguageSelectModalOpen,
      isForgotPasswordModalOpen, setIsForgotPasswordModalOpen,
    }}>
      { children }
    </ModalContext.Provider>
  );
}