"use client";
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  UserPlus, 
  Settings, 
  LogOut,
  Bell,
  Search
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Groups", href: "/dashboard/groups" },
    { icon: Receipt, label: "Expenses", href: "/dashboard/expenses" },
    { icon: UserPlus, label: "Friends", href: "/dashboard/friends" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-zinc-900/20 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="gradient-text text-xl font-bold italic tracking-tighter">
            SmartSplit.
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "group-hover:text-white transition-colors"}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all group">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-900/10 backdrop-blur-md">
          <div className="flex-1 max-w-xl hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search groups or expenses..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[var(--background)]"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20"></div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 page-transition">
          {children}
        </div>
      </main>
    </div>
  );
}
