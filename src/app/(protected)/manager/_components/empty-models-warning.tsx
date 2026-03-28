"use client";

import { BarChart3 } from "lucide-react";
import { useCatalog } from "@/src/contexts/catalog-context";

export function EmptyModelsWarning() {
  const { models, products } = useCatalog();

  const modelsWithoutProducts = models.filter((m) => !(products[m.id] ?? []).length);

  if (modelsWithoutProducts.length === 0) return null;

  return (
    <section>
      <h2 className="text-muted-foreground mb-5 text-xs tracking-widest uppercase">Modelos sem SKUs Cadastrados</h2>
      <div className="border-border bg-muted/20 rounded-2xl border border-dashed p-6">
        <div className="text-muted-foreground mb-4 flex items-center gap-3">
          <BarChart3 className="size-5" />
          <p className="text-sm">Estes modelos aparecem no catálogo mas não possuem produtos com preço definido.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {modelsWithoutProducts.map((model) => (
            <div key={model.id} className="border-border bg-card flex items-center gap-2 rounded-xl border px-4 py-2.5">
              <span className="font-serif font-medium">{model.name}</span>
              <span className="text-muted-foreground text-xs">
                · {model.count} un. · {model.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
