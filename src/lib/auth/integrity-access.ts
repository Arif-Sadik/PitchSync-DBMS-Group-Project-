import "server-only";

import type {
  AuthSession,
  IntegrityScope,
} from "@/features/auth/types";

import type { Connection } from "@/lib/db/oracle";

import {
  getActiveIntegrityScope,
  hasActiveInvestigationAssignment,
  hasActiveInvestigationAssignmentForPlayer,
} from "@/lib/db/queries/integrity/07-access/integrity-access";

export type IntegrityOfficerSession =
  AuthSession & {
    role: "integrity-officer";
    integrityScope: IntegrityScope;
  };


export function requireIntegrityOfficer(
  session: AuthSession | null,
): IntegrityOfficerSession | null {
  if (
    !session ||
    session.role !== "integrity-officer" ||
    (
      session.integrityScope !== "MANAGER" &&
      session.integrityScope !== "INVESTIGATOR"
    )
  ) {
    return null;
  }

  return session as IntegrityOfficerSession;
}


export async function requireIntegrityManager(
  connection: Connection,
  session: AuthSession | null,
): Promise<IntegrityOfficerSession | null> {
  const officer = requireIntegrityOfficer(session);

  if (!officer) {
    return null;
  }

  const currentScope =
    await getActiveIntegrityScope(
      connection,
      Number(officer.personId),
    );

  if (currentScope !== "MANAGER") {
    return null;
  }

  return {
    ...officer,
    integrityScope: "MANAGER",
  };
}


export async function requireAssignedInvestigator(
  connection: Connection,
  session: AuthSession | null,
  caseId: number,
): Promise<IntegrityOfficerSession | null> {
  const officer = requireIntegrityOfficer(session);

  if (!officer) {
    return null;
  }

  const adminId = Number(officer.personId);

  if (
    !Number.isInteger(adminId) ||
    !Number.isInteger(caseId)
  ) {
    return null;
  }

  const currentScope =
    await getActiveIntegrityScope(
      connection,
      adminId,
    );

  if (currentScope !== "INVESTIGATOR") {
    return null;
  }

  const assigned =
    await hasActiveInvestigationAssignment(
      connection,
      adminId,
      caseId,
    );

  if (!assigned) {
    return null;
  }

  return {
    ...officer,
    integrityScope: "INVESTIGATOR",
  };
}

export async function requireAssignedInvestigatorForPlayer(
  connection: Connection,
  session: AuthSession | null,
  caseId: number,
  playerId: number,
): Promise<IntegrityOfficerSession | null> {
  const officer = requireIntegrityOfficer(session);

  if (!officer) {
    return null;
  }

  const adminId = Number(officer.personId);

  if (
    !Number.isInteger(adminId) ||
    !Number.isInteger(caseId) ||
    !Number.isInteger(playerId)
  ) {
    return null;
  }

  const currentScope =
    await getActiveIntegrityScope(
      connection,
      adminId,
    );

  if (currentScope !== "INVESTIGATOR") {
    return null;
  }

  const assigned =
    await hasActiveInvestigationAssignmentForPlayer(
      connection,
      adminId,
      caseId,
      playerId,
    );

  if (!assigned) {
    return null;
  }

  return {
    ...officer,
    integrityScope: "INVESTIGATOR",
  };
}