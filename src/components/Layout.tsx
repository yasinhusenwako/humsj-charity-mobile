import { ReactNode } from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

const Layout = ({ children, showBottomNav = true }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={`pt-2 pb-20 md:pt-0 md:pb-0 ${showBottomNav ? "" : ""}`}>
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;
