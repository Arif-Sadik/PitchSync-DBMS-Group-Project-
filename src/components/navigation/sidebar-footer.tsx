"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";

export function SidebarFooter() {
  const { signOut, role } = useAuth();
  const router = useRouter();

  const exit = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  const showGenericProfile = role !== "player";

  return (
    <div className="space-y-2 border-t border-white/10 p-3">
      {showGenericProfile ? (
        <Link
          href="/profile"
          className="flex w-full items-center gap-3 rounded-[9px] px-3 py-2 text-sm font-medium text-white/67 transition-colors hover:bg-white/10 hover:text-white"
        >
          <UserRound className="size-[18px] shrink-0" />
          Profile
        </Link>
      ) : null}

      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start text-white/65 hover:bg-white/10 hover:text-white"
        onClick={exit}
      >
        <LogOut />
        Sign out
      </Button>
    </div>
  );
}