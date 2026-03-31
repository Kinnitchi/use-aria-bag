"use client";

import { PageHeader } from "../_components/page-header";
import { AdminOrdersTable } from "../_components/admin-orders-table";

export default function PedidosPage() {
  return (
    <>
      <PageHeader title="Pedidos" />
      <div className="p-6">
        <AdminOrdersTable />
      </div>
    </>
  );
}
