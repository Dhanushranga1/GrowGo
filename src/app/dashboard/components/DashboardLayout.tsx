"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import {
  Home,
  LineChart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      router.push("/login"); // Redirect after successful logout
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 p-4">
        <div className="flex items-center p-2 mb-8">
          <span className="text-xl font-semibold text-indigo-600">GrowGo 🌱</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem href="/dashboard" icon={<Home size={18} />} label="My Goal" active />
          <NavItem href="/dashboard/progress" icon={<LineChart size={18} />} label="Progress" />
          <NavItem href="/dashboard/pod" icon={<Users size={18} />} label="Pod" />
          <NavItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between p-4">
          <span className="text-lg font-semibold text-indigo-600">GrowGo 🌱</span>
          <button className="p-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-0 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}

type NavItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
};

function NavItem({ href, icon, label, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center p-2 rounded-lg transition-colors ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
