export type RoleId =
  | "super-admin"
  | "board-admin"
  | "performance-manager"
  | "match-official"
  | "integrity-officer"
  | "player";

export type DemoSession = {
  signedIn: boolean;
  role: RoleId | null;
};
