"use client";

import { useState } from "react";
import { RoleProvider } from "@/components/layout/RoleContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RoleProvider>
      <div className="flex min-h-dvh w-full">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto">{children}</main>
        </div>
      </div>
    </RoleProvider>
  );
}
