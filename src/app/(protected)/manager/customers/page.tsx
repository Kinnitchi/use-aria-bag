"use client";

import { PageHeader } from "../_components/page-header";
import { AdminCustomersTable } from "../_components/admin-customers-table";

export default function ClientesPage() {
  return (
    <>
      <PageHeader title="Clientes" />
      <div className="p-6">
        <AdminCustomersTable />
      </div>
    </>
  );
}
