"use client";

import { createContext, useContext, useState } from "react";
import type { Role } from "@/lib/nav-config";

const RoleContext = createContext<{ role: Role; setRole: (r: Role) => void }>({
  role: "super_admin",
  setRole: () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("super_admin");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
