import { NextResponse } from "next/server";
import { z } from "zod";
import { paginationMetadata, paginationSchema } from "@/lib/api/pagination";
import { apiError, logServerError } from "@/lib/api/responses";
import { requireIntegrityManager } from "@/lib/auth/server";
import { withOracleConnection, withOracleTransaction } from "@/lib/db/oracle";
import { listComplaints } from "@/lib/db/queries/integrity/02-complaints/complaints";
import { registerComplaint } from "@/lib/db/queries/integrity/02-complaints/register-complaint";

export const runtime = "nodejs";
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const listSchema = paginationSchema.extend({ q: z.string().trim().max(200).optional(), source: z.string().trim().max(50).optional(), from: date.optional(), to: date.optional(), sort: z.enum(["received", "id", "source"]).default("received") });
const registerSchema = z.object({
  sourceType: z.string().trim().min(1).max(50),
  dateReceived: date.optional(),
  description: z.string().trim().min(1).max(2000),
  misconductType: z.string().trim().max(100).optional().nullable(),
});

export async function GET(request: Request) {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError("Integrity Manager access is required.", 403);
  }

  const parsed = listSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return apiError("Invalid complaint registry filters.", 400);
  if (parsed.data.from && parsed.data.to && parsed.data.from > parsed.data.to) return apiError("Received-from date must not be after received-to date.", 400);

  try {
    const result = await withOracleConnection((connection) => listComplaints(connection, parsed.data));
    return NextResponse.json({ data: result.data, pagination: paginationMetadata(parsed.data.page, parsed.data.pageSize, result.totalItems) });
  } catch (error) {
    logServerError("complaint registry", error);
    return apiError("Unable to load the complaint registry.");
  }
}

export async function POST(request: Request) {
  const session = await requireIntegrityManager();

  if (!session) {
    return apiError("Integrity Manager access is required.", 403);
  }

  const parsed = registerSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return apiError(
      "Provide a source type and a complaint description.",
      400,
    );
  }

  const today = new Date();
  const defaultDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  try {
    const complaintId = await withOracleTransaction((connection) =>
      registerComplaint(connection, {
        sourceType: parsed.data.sourceType,
        dateReceived: parsed.data.dateReceived ?? defaultDate,
        description: parsed.data.description,
        misconductType: parsed.data.misconductType ?? null,
      }),
    );

    return NextResponse.json(
      { data: { complaintId: String(complaintId) } },
      { status: 201 },
    );
  } catch (error) {
    logServerError("integrity complaint registration", error);
    return apiError("Unable to register the complaint.");
  }
}
