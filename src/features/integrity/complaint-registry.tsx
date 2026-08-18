"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarRange, FileWarning, Link2, LockKeyhole, Plus, ShieldAlert, Unlink } from "lucide-react";
import { MetricCard } from "@/components/data-display/metric-card";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { DataStateView } from "@/components/feedback/data-state-view";
import { FilterBar } from "@/components/forms/filter-bar";
import { SearchField } from "@/components/forms/search-field";
import { Pagination } from "@/components/navigation/pagination";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseDataStatus } from "@/lib/data-state";

const columns = ["Complaint ID", "Date Received", "Source Type", "Misconduct Type", "Description", "Case Link", "Actions"] as const;

const sourceTypes = ["Email", "Phone", "Written", "In Person", "Hotline", "Internal Report", "Other"] as const;

const misconductTypes = ["Match Fixing", "Conduct", "Competition Integrity", "Safeguarding", "Administrative", "Other"] as const;

export function ComplaintRegistry() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`);
  };
  const state = { status: parseDataStatus(searchParams.get("state"), "empty"), data: [] as readonly never[], message: "No complaint records found." } as const;

  return (
    <>
      <div className="flex items-start gap-3 rounded-xl border border-[#eadfb8] bg-[#faf6e9] p-4">
        <LockKeyhole className="mt-0.5 size-5 shrink-0 text-[#866d1e]" />
        <div>
          <p className="text-sm font-semibold text-[#6e5a1c]">Confidentiality notice</p>
          <p className="mt-1 text-xs leading-5 text-[#7d6b35]">Complaint and case information is restricted to authorized integrity personnel.</p>
        </div>
      </div>
      <PageHeader
        eyebrow="Integrity management"
        title="Complaint registry"
        description="Search, filter, and review complaint records."
        actions={<Button disabled aria-disabled="true"><Plus />File Complaint</Button>}
      />
      <section className="grid grid-cols-4 gap-4">
        <MetricCard label="Total complaints" icon={ShieldAlert} />
        <MetricCard label="Unlinked complaints" icon={Unlink} />
        <MetricCard label="Complaints linked to cases" icon={Link2} />
        <MetricCard label="Referred cases" icon={FileWarning} />
      </section>
      <FilterBar>
        <SearchField value={searchParams.get("q") ?? ""} onChange={(value) => setFilter("q", value)} placeholder="Search complaint registry" />
        <Select value={searchParams.get("source") ?? "all"} onValueChange={(value) => setFilter("source", value)}>
          <SelectTrigger aria-label="Filter by source type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {sourceTypes.map((source) => <SelectItem key={source} value={source}>{source}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={searchParams.get("misconduct") ?? "all"} onValueChange={(value) => setFilter("misconduct", value)}>
          <SelectTrigger aria-label="Filter by misconduct type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All misconduct types</SelectItem>
            {misconductTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={searchParams.get("link") ?? "all"} onValueChange={(value) => setFilter("link", value)}>
          <SelectTrigger aria-label="Filter by case link"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Linked or unlinked</SelectItem>
            <SelectItem value="linked">Linked to case</SelectItem>
            <SelectItem value="unlinked">Not linked to case</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 rounded-[10px] border px-3">
          <CalendarRange className="size-4 text-[var(--text-muted)]" />
          <Input className="w-32 border-0 p-0 shadow-none focus:ring-0" type="date" value={searchParams.get("from") ?? ""} onChange={(event) => setFilter("from", event.target.value)} aria-label="Received from date" />
          <span className="text-xs text-[var(--text-muted)]">to</span>
          <Input className="w-32 border-0 p-0 shadow-none focus:ring-0" type="date" value={searchParams.get("to") ?? ""} onChange={(event) => setFilter("to", event.target.value)} aria-label="Received to date" />
        </div>
      </FilterBar>
      <div className="overflow-hidden rounded-xl border bg-white">
        {state.status === "empty" || state.status === "ready" ? <DataTableShell columns={columns} emptyTitle="No complaints found" /> : <DataStateView state={state} emptyTitle="No complaints found" />}
        <Pagination />
      </div>
    </>
  );
}
