import React from "react";
import Encabezado from "../componentes/Encabezado/Encabezado";
import BarraLateral from "../componentes/BarraLateral/BarraLateral";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-root">
      <Encabezado />
      <div className="layout-main">
        <BarraLateral />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
