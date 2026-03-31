"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const statusLabel: Record<OrderStatus, string> = {
  pending: "Aguardando",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusVariant: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "outline",
  shipped: "outline",
  delivered: "default",
  cancelled: "destructive",
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

interface OrderItem {
  id: string;
  quantity: number;
  priceAtTimeInCents: number;
  product: {
    name: string;
    model: { image: string; name: string };
    color: { name: string };
  };
}

interface OrderCardProps {
  id: string;
  status: OrderStatus;
  totalInCents: number;
  createdAt: Date;
  items: OrderItem[];
}

export function OrderCard({ id, status, totalInCents, createdAt, items }: OrderCardProps) {
  const shortId = id.slice(-8).toUpperCase();

  return (
    <div className="border-border bg-card rounded-xl border p-5 shadow-xs">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-foreground text-sm font-medium">Pedido #{shortId}</p>
          <p className="text-muted-foreground text-xs">{formatDate(createdAt)}</p>
        </div>
        <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
      </div>

      <Separator className="my-4" />

      {/* Itens */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
              {item.product.model.image ? (
                <Image src={item.product.model.image} alt={item.product.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="text-muted-foreground h-5 w-5" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">{item.product.name}</p>
              <p className="text-muted-foreground text-xs">
                {item.product.color.name} · Qtd: {item.quantity}
              </p>
            </div>
            <p className="text-foreground shrink-0 text-sm font-medium">
              {formatCurrency(item.priceAtTimeInCents * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Total</span>
        <span className="text-foreground text-sm font-semibold">{formatCurrency(totalInCents)}</span>
      </div>
    </div>
  );
}
