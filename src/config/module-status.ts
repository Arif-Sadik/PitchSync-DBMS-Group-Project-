export type ModuleStatus = "implemented" | "preview" | "planned" | "temporary";

export const moduleStatus = {
  rootRedirect: { route: "/", status: "temporary" },
  signIn: { route: "/sign-in", status: "temporary" },
  superAdminDashboard: { route: "/super-admin/dashboard", status: "implemented" },
  boardAdminDashboard: { route: "/board-admin/dashboard", status: "implemented" },
  performanceDashboard: { route: "/performance/dashboard", status: "implemented" },
  matchOfficialDashboard: { route: "/match-official/dashboard", status: "implemented" },
  integrityDashboard: { route: "/integrity/dashboard", status: "implemented" },
  playerDashboard: { route: "/player/dashboard", status: "implemented" },
  playerRegistry: { route: "/players", status: "implemented" },
  playerProfile: { route: "/players/[playerId]", status: "implemented" },
  playerProfilePreview: { route: "/players/preview", status: "preview" },
  registerPlayer: { route: "/players/new", status: "implemented" },
  teamManagement: { route: "/teams", status: "implemented" },
  tournamentManagement: { route: "/tournaments", status: "implemented" },
  matchDetails: { route: "/matches/[matchId]", status: "implemented" },
  matchDetailsPreview: { route: "/matches/preview", status: "preview" },
  complaintRegistry: { route: "/integrity/complaints", status: "implemented" },
  integrityCaseDetails: { route: "/integrity/cases/[caseId]", status: "implemented" },
  integrityCasePreview: { route: "/integrity/cases/preview", status: "preview" },
  reports: { status: "planned" }, notifications: { status: "planned" }, oracleSettings: { status: "planned" }, userManagement: { status: "planned" }, roleEditor: { status: "planned" }, systemLogs: { status: "planned" }, evidenceManagement: { status: "planned" }, documentManagement: { status: "planned" }, fitnessManagement: { status: "planned" }, trainingManagement: { status: "planned" }, selectionWorkflows: { status: "planned" }, fixtureManagement: { status: "planned" }, resultsEntry: { status: "planned" },
} as const satisfies Record<string, { route?: string; status: ModuleStatus }>;
