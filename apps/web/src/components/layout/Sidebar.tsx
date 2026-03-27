import {
  CalendarDays,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X
} from "lucide-react";

export type AppPage = "dashboard" | "users" | "calendar" | "settings";

interface SidebarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

const NAV_ITEMS: Array<{ key: AppPage; label: string; icon: typeof LayoutDashboard }> = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "users", label: "Members", icon: Users },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "settings", label: "Minutes", icon: Settings }
];

export function Sidebar({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onLogout
}: SidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-200 transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-24" : "lg:w-72"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-content-center rounded-xl bg-indigo-500 text-white">C</div>
            {!collapsed && <span className="text-sm font-semibold tracking-wide">CLEMENS</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:block"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft size={16} className={collapsed ? "rotate-180 transition" : "transition"} />
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
              aria-label="Close mobile sidebar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onNavigate(item.key);
                  onCloseMobile();
                }}
                className={`group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm transition ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/50"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onLogout}
            className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
