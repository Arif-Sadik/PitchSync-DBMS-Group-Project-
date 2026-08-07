import { PitchSyncMark } from "@/components/branding/pitchsync-mark";

export function SidebarHeader({ subtitle }: { subtitle: string }) {
  return <div className="flex h-24 items-center border-b border-white/10 px-5"><PitchSyncMark compact dark subtitle={subtitle} /></div>;
}
