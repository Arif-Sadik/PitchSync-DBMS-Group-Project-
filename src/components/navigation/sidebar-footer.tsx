"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/features/demo-auth";

export function SidebarFooter() {
  const { signOut } = useDemoAuth();
  const router = useRouter();
  const exit = () => { signOut(); router.replace("/sign-in"); };
  return <div className="border-t border-white/10 p-3"><Button type="button" variant="ghost" className="w-full justify-start text-white/65 hover:bg-white/10 hover:text-white" onClick={exit}><LogOut />Sign out</Button></div>;
}
