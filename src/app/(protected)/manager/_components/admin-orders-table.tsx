"use client";

import { useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getAdminOrdersAction } from "@/src/actions/admin/actions";

const statusLabel = {
  pending: "Aguardando",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
} as const;

const statusVariant = {
  pending: "secondary",
  confirmed: "outline",
  shipped: "outline",
  delivered: "default",
  cancelled: "destructive",
} as const;

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function AdminOrdersTable() {
  const { execute, result, isPending } = useAction(getAdminOrdersAction);

  useEffect(() => {
    execute({});
  }, [execute]);

  const orders = result.data?.orders ?? [];

  if (isPending) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-muted-foreground border-border rounded-2xl border border-dashed py-16 text-center text-sm">
        Nenhum pedido encontrado.
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}…</TableCell>
              <TableCell>{order.guestEmail ?? order.guestName ?? "—"}</TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell className="font-medium tabular-nums">{formatCurrency(order.totalInCents)}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[order.status]}>{statusLabel[order.status]}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-sm">{formatDate(order.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
