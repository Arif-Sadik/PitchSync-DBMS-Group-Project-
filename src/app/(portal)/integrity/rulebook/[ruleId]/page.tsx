import { RulebookDetails } from "@/features/integrity/05-rulebook/rulebook-details";

export default async function Page({ params }: PageProps<"/integrity/rulebook/[ruleId]">) {
  const { ruleId } = await params;
  return <RulebookDetails ruleId={ruleId} />;
}
