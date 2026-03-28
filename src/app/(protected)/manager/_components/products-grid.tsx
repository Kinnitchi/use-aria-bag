"use client";

import { Pencil, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCatalog } from "@/src/contexts/catalog-context";
import type { Product } from "@/src/types";
import { formatCurrency } from "../_helpers/format-currency";

interface ProductsGridProps {
  onEditProduct: (modelId: string, modelName: string, product: Product) => void;
  onAddProduct: (modelId: string, modelName: string) => void;
}

export function ProductsGrid({ onEditProduct, onAddProduct }: ProductsGridProps) {
  const { models, products } = useCatalog();

  return (
    <section>
      <h2 className="text-muted-foreground mb-5 text-xs tracking-widest uppercase">Gerenciar Produtos</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {models.map((model) => {
          const modelProducts = products[model.id] ?? [];
          const lowestPrice = modelProducts.length > 0 ? Math.min(...modelProducts.map((p) => p.price)) : null;
          const highestPrice = modelProducts.length > 0 ? Math.max(...modelProducts.map((p) => p.price)) : null;

          return (
            <div key={model.id} className="border-border bg-card flex flex-col rounded-2xl border shadow-sm">
              {/* Card header */}
              <div className="flex items-start justify-between border-b px-6 py-4">
                <div>
                  <h3 className="font-serif text-lg font-medium">{model.name}</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {lowestPrice !== null && highestPrice !== null
                      ? `${formatCurrency(lowestPrice)} – ${formatCurrency(highestPrice)}`
                      : "Sem produtos"}
                  </p>
                </div>
                <div className="bg-secondary text-secondary-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
                  <ShoppingBag className="size-3" />
                  {model.count} un.
                </div>
              </div>

              {/* Products list */}
              <ul className="flex-1 divide-y px-6 py-2">
                {modelProducts.length === 0 && (
                  <li className="text-muted-foreground py-4 text-center text-sm">Nenhum produto cadastrado</li>
                )}
                {modelProducts.map((product) => (
                  <li key={product.id} className="flex items-center justify-between gap-2 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="bg-ring size-2 shrink-0 rounded-full" />
                      <span className="text-foreground truncate text-sm">{product.name}</span>
                    </div>
                    <div className="ml-2 flex shrink-0 items-center gap-2">
                      <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                        {product.color}
                      </span>
                      <span className="text-sm font-medium tabular-nums">{formatCurrency(product.price)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => onEditProduct(model.id, model.name, product)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Add product button */}
              <div className="border-t px-6 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={() => onAddProduct(model.id, model.name)}
                >
                  <Plus className="size-4" />
                  Adicionar produto
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
