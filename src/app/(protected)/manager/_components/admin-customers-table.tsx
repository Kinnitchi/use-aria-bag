"use client";

import { useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { getAdminCustomersAction } from "@/src/actions/admin/actions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function AdminCustomersTable() {
  const { execute, result, isPending } = useAction(getAdminCustomersAction);

  useEffect(() => {
    execute({});
  }, [execute]);

  const customers = result.data?.customers ?? [];

  if (isPending) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-muted-foreground border-border rounded-2xl border border-dashed py-16 text-center text-sm">
        Nenhum cliente encontrado.
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Cliente</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead className="text-right">Cadastro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 rounded-full">
                    <AvatarImage src={customer.image ?? ""} alt={customer.name} />
                    <AvatarFallback className="rounded-full text-xs">{getInitials(customer.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{customer.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{customer.email}</TableCell>
              <TableCell>
                <Badge variant={customer.role === "admin" ? "default" : "secondary"}>
                  {customer.role === "admin" ? "Admin" : "Cliente"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-sm">
                {formatDate(customer.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
