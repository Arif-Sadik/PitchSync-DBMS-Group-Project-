import { NextResponse } from "next/server";

import { apiError, logServerError } from "@/lib/api/responses";
import { requireServerSession } from "@/lib/auth/server";
import { withOracleConnection } from "@/lib/db/oracle";
import {
  getAccountProfile,
  getAdminProfile,
  getMobileNumbers,
} from "@/lib/db/queries/current-user";
import type { CurrentUserProfile } from "@/data/contracts";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireServerSession();

  if (!session) {
    return apiError("Authentication required.", 401);
  }

  try {
    const responsibility =
      session.integrityScope === "MANAGER"
        ? "Manager"
        : session.integrityScope === "INVESTIGATOR"
          ? "Investigator"
          : undefined;

    const base: CurrentUserProfile = {
      id: session.personId,
      fullName: session.fullName,
      role: session.role,
      ...(responsibility ? { responsibility } : {}),
    };

    if (session.role === "player") {
      return NextResponse.json({ data: base });
    }

    const personId = Number(session.personId);

    const [admin, account, mobileNumbers] = await withOracleConnection(
      async (connection) => {
        const [adminResult, accountResult, phoneResult] = await Promise.all([
          getAdminProfile(connection, personId),
          getAccountProfile(connection, personId),
          getMobileNumbers(connection, personId),
        ]);
        return [adminResult, accountResult, phoneResult];
      },
    );

    const profile: CurrentUserProfile = {
      ...base,
      ...(admin?.email ? { email: admin.email } : {}),
      ...(admin?.designation
        ? { designation: admin.designation }
        : {}),
      ...(admin?.department
        ? { department: admin.department }
        : {}),
      ...(session.username ? { username: session.username } : {}),
      ...(account?.accountStatus
        ? { accountStatus: account.accountStatus }
        : {}),
      ...(admin?.joiningDate ? { joiningDate: admin.joiningDate } : {}),
      ...(account?.accountCreated
        ? { accountCreated: account.accountCreated }
        : {}),
      ...(account?.lastLogin ? { lastLogin: account.lastLogin } : {}),
      ...(admin?.dateOfBirth ? { dateOfBirth: admin.dateOfBirth } : {}),
      ...(admin?.presentAddress
        ? { presentAddress: admin.presentAddress }
        : {}),
      ...(admin?.permanentAddress
        ? { permanentAddress: admin.permanentAddress }
        : {}),
      ...(mobileNumbers.length > 0 ? { mobileNumbers } : {}),
    };

    return NextResponse.json({ data: profile });
  } catch (error) {
    logServerError("current user profile", error);
    return apiError("Unable to load your profile.");
  }
}