"use client";

import { PageHeader } from "./_components/page-header";
import { StatsOverview } from "./_components/stats-overview";
import { EmptyModelsWarning } from "./_components/empty-models-warning";

export default function ManagerPage() {
  return (
    <>
      <PageHeader title="Visão Geral" />
      <div className="flex flex-col gap-8 p-6">
        <StatsOverview />
        <EmptyModelsWarning />
      </div>
    </>
  );
}
