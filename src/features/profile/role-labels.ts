export const applicationRoleLabels: Readonly<Record<string, string>> = {
  "super-admin": "Super Administrator",
  "board-admin": "Cricket Board Administrator",
  "performance-manager": "Team Performance Manager",
  "match-official": "Match Official",
  "integrity-officer": "Integrity Officer",
  player: "Player",
};

export function applicationRoleLabel(role: string): string {
  return applicationRoleLabels[role] ?? "User";
}
