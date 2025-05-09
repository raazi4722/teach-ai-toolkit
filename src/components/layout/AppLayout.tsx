
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        {!isMobile && <Sidebar />}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
