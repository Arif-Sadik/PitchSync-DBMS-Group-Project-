"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/features/demo-auth";

export function SidebarFooter() {
  const { signOut } = useDemoAuth();
  const router = useRouter();
  const exit = () => { signOut(); router.replace("/sign-in"); };
  return <div className="border-t border-white/10 p-3"><div className="mb-3 rounded-lg bg-white/5 px-3 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/35">Session type</p><p className="mt-1 text-xs text-white/65">Frontend demonstration</p></div><Button type="button" variant="ghost" className="w-full justify-start text-white/65 hover:bg-white/10 hover:text-white" onClick={exit}><LogOut />Sign out</Button></div>;
}
