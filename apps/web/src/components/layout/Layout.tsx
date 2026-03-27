import { ReactNode, useState } from "react";
import { Navbar } from "./Navbar";
import { AppPage, Sidebar } from "./Sidebar";
import { UserSession } from "../../types";

interface LayoutProps {
  title: string;
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  user: UserSession;
  onLogout: () => void;
  children: ReactNode;
}

export function Layout({ title, activePage, onNavigate, user, onLogout, children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={onLogout}
      />

      <div className="min-w-0 flex-1">
        <Navbar title={title} onOpenSidebar={() => setMobileOpen(true)} userName={user.fullName} clientName={user.clientName} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
