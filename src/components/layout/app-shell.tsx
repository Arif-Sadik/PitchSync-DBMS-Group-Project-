"use client";

import { motion } from "framer-motion";
import { getRole } from "@/config/roles";
import { useDemoAuth } from "@/features/demo-auth";
import { Sidebar } from "@/components/navigation/sidebar";
import { TopBar } from "./top-bar";
import { MainContent } from "./main-content";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role: roleId } = useDemoAuth();
  const role = getRole(roleId);
  if (!role) return null;
  const style = { "--primary": role.accent, "--primary-hover": role.accentHover, "--primary-soft": role.accentSoft } as React.CSSProperties;
  return <div style={style} className="min-h-screen min-w-[1120px]"><Sidebar role={role} /><div className="min-h-screen pl-[248px]"><TopBar /><motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}><MainContent>{children}</MainContent></motion.div></div></div>;
}
