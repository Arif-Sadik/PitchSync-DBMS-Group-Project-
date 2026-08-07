"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabNavigation({ tabs }: { tabs: readonly { value: string; label: string }[] }) {
  return <TabsList>{tabs.map((tab) => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}</TabsList>;
}
