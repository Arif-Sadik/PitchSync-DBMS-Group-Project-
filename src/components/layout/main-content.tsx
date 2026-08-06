export function MainContent({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-[1440px] p-7"><div className="space-y-7">{children}</div></main>;
}
