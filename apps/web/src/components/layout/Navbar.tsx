import { Bell, Menu, Search } from "lucide-react";

interface NavbarProps {
  title: string;
  onOpenSidebar: () => void;
  userName: string;
  clientName: string;
}

export function Navbar({ title, onOpenSidebar, userName, clientName }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <h1 className="hidden text-lg font-semibold text-slate-900 md:block">{title}</h1>

        <div className="relative ml-auto w-full max-w-xs sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            placeholder="Search"
          />
        </div>

        <button type="button" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <button type="button" className="flex items-center gap-3 rounded-lg p-1 hover:bg-slate-100">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-300 to-violet-500" />
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-slate-800">{userName}</p>
            <p className="text-xs text-slate-500">{clientName}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
