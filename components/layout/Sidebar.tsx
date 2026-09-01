"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { navForRole } from "@/lib/nav-config";
import { useRole } from "./RoleContext";
import { SCHOOL } from "@/lib/mock-data";

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  const modules = navForRole(role);
  const activeModuleId = modules.find((module) => module.items.some((item) => pathname === item.href))?.id ?? null;
  const [openModule, setOpenModule] = useState<string | null>(activeModuleId);
  const [openPlacement, setOpenPlacement] = useState<"up" | "down">(() =>
    activeModuleId && modules.findIndex((module) => module.id === activeModuleId) > modules.length / 2 ? "up" : "down",
  );

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-dvh w-[268px] shrink-0 bg-spine text-paper z-40 flex flex-col transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* spine texture: stitched line */}
        <div className="absolute inset-y-0 left-[10px] w-px bg-spine-line" />
        <div className="absolute inset-y-0 left-[13px] w-px bg-white/5" />

        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-brass/90 flex items-center justify-center shrink-0 overflow-hidden">
              <Image src="/Logo/school_logo.jpg" alt="School Logo" width={32} height={32} className="object-cover" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-[15px] text-paper">ST. ELIZABETH GIRLS SENIOR SCHOOL</p>
              <p className="text-[10.5px] text-paper/50 tracking-wide">Public School Finance</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-paper/60 hover:text-paper">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto lg:overflow-visible px-3 py-4 space-y-5">
          {modules.map((mod) => (
            <div key={mod.id} className="relative">
              <button
                type="button"
                onClick={(event) => {
                  if (openModule === mod.id) {
                    setOpenModule(null);
                    return;
                  }
                  setOpenPlacement(event.currentTarget.getBoundingClientRect().top > window.innerHeight / 2 ? "up" : "down");
                  setOpenModule(mod.id);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-white/5 text-left"
                aria-expanded={openModule === mod.id}
              >
                <span className="figures text-[10px] text-brass-soft">{mod.number}</span>
                <span className="flex-1 text-[10.5px] uppercase tracking-[0.14em] text-paper/65 font-medium">
                  {mod.label}
                </span>
                {openModule === mod.id ? <ChevronDown size={14} className="text-brass-soft" /> : <ChevronRight size={14} className="text-paper/45" />}
              </button>
              <ul className={`space-y-0.5 mt-1 ${openModule === mod.id ? "block" : "hidden"} lg:absolute lg:left-full ${openPlacement === "up" ? "lg:bottom-0" : "lg:top-0"} lg:ml-2 lg:w-64 lg:max-h-[60dvh] lg:overflow-y-scroll lg:overscroll-contain lg:p-2 lg:rounded-lg lg:bg-spine-soft lg:border lg:border-spine-line lg:shadow-xl lg:z-50 nav-dropdown`}>
                {mod.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => { onClose(); setOpenModule(null); }}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors ${
                          active
                            ? "bg-brass text-spine font-medium"
                            : "text-paper/75 hover:text-paper hover:bg-white/5"
                        }`}
                      >
                        <Icon size={15} strokeWidth={2} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10 text-[11px] text-paper/45 leading-relaxed">
          {SCHOOL.name}
          <br />
          {SCHOOL.registration}
        </div>
      </aside>
    </>
  );
}
