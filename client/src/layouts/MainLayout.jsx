import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="main flex-1 overflow-y-scroll mb-3">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}