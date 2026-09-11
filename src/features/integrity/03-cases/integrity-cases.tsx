"use client";

import { useAuth } from "@/features/auth";
import { InvestigatorCases } from "@/features/integrity/03-cases/investigator-cases";
import { IntegrityCaseRegistry } from "@/features/integrity/03-cases/case-registry";

export function IntegrityCases() {
  const { session } = useAuth();
  const scope = session?.integrityScope;
  return scope === "INVESTIGATOR" ? <InvestigatorCases /> : <IntegrityCaseRegistry />;
}
