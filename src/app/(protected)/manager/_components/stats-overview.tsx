"use client";

import { Layers, Tag, Package, TrendingUp } from "lucide-react";
import { useCatalog } from "@/src/contexts/catalog-context";
import { StatCard } from "./stat-card";
import { formatCurrency } from "../_helpers/format-currency";

export function StatsOverview() {
  const { models, products } = useCatalog();

  const allProducts = Object.values(products).flat();
  const totalSkus = allProducts.length;
  const totalStock = models.reduce((sum, m) => sum + m.count, 0);
  const minPrice = allProducts.length > 0 ? Math.min(...allProducts.map((p) => p.price)) : 0;
  const maxPrice = allProducts.length > 0 ? Math.max(...allProducts.map((p) => p.price)) : 0;
  const avgPrice = allProducts.length > 0 ? allProducts.reduce((sum, p) => sum + p.price, 0) / allProducts.length : 0;
  const modelsWithProducts = models.filter((m) => (products[m.id] ?? []).length > 0);

  return (
    <section>
      <h2 className="text-muted-foreground mb-5 text-xs tracking-widest uppercase">Visão Geral</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Modelos"
          value={String(models.length)}
          sub={`${modelsWithProducts.length} com SKUs cadastrados`}
          icon={Layers}
          accent
        />
        <StatCard label="SKUs Cadastrados" value={String(totalSkus)} sub="Produtos com preço e cor" icon={Tag} />
        <StatCard
          label="Unidades em Estoque"
          value={String(totalStock)}
          sub="Soma de todos os modelos"
          icon={Package}
        />
        <StatCard
          label="Ticket Médio"
          value={formatCurrency(avgPrice)}
          sub={avgPrice > 0 ? `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}` : "—"}
          icon={TrendingUp}
        />
      </div>
    </section>
  );
}
