export function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts.join("").slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function accountStatusLabel(value: string | undefined): string {
  if (!value) return "Active";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function isAdminRole(role: string): boolean {
  return role !== "player";
}