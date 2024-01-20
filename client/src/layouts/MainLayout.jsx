import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer/Footer";
import { useContext } from "react";
import { ModalContext } from "../contexts/modal.context";
import SearchModal from "../components/Modals/SearchModal";
import IntlModal from "../components/Modals/IntlModal";

export default function MainLayout() {
  const { 
    isSearchModalOpen,
    isIntlModalOpen
  } = useContext(ModalContext);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="main flex-1 overflow-y-scroll mb-3">
        <Outlet />
      </div>
      <Footer />
      { isSearchModalOpen && <SearchModal /> }
      { isIntlModalOpen && <IntlModal /> }
    </div>
  );
}