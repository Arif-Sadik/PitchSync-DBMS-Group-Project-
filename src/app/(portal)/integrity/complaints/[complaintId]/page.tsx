import { ComplaintDetails } from "@/features/integrity/02-complaints/complaint-details";

export default async function Page({ params }: PageProps<"/integrity/complaints/[complaintId]">) {
  const { complaintId } = await params;
  return <ComplaintDetails complaintId={complaintId} />;
}
