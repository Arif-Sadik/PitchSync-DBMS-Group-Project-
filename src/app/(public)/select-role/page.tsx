import { PitchSyncMark } from "@/components/branding/pitchsync-mark";
import { BackendStatusBadge } from "@/components/feedback/backend-status-badge";
import { RoleSelector } from "@/features/demo-auth";

export default function SelectRolePage() {
  return <main className="min-h-screen bg-[var(--background)]"><header className="border-b bg-white"><div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-8"><PitchSyncMark compact subtitle="Role selection" /><BackendStatusBadge /></div></header><div className="mx-auto max-w-[1240px] px-8 py-12"><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">Temporary access scaffolding</p><h1 className="heading-font mt-3 text-4xl font-semibold">Choose a demonstration role</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">Select a workspace to review role-specific navigation and the implemented frontend modules. This selection remains only for the current browser session.</p></div><RoleSelector /></div></main>;
}
