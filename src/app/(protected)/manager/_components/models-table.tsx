"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCatalog } from "@/src/contexts/catalog-context";
import type { Model } from "@/src/types";

interface ModelsTableProps {
  onEditModel: (model: Model) => void;
}

export function ModelsTable({ onEditModel }: ModelsTableProps) {
  const { models, products } = useCatalog();

  return (
    <section>
      <h2 className="text-muted-foreground mb-5 text-xs tracking-widest uppercase">Gerenciar Modelos</h2>
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-muted/40 text-muted-foreground border-b">
              <th className="px-6 py-4 text-left font-medium">Modelo</th>
              <th className="hidden px-6 py-4 text-left font-medium sm:table-cell">Descrição</th>
              <th className="px-6 py-4 text-center font-medium">Estoque</th>
              <th className="px-6 py-4 text-center font-medium">SKUs</th>
              <th className="hidden px-6 py-4 text-center font-medium md:table-cell">Status</th>
              <th className="px-6 py-4 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, i) => {
              const modelProducts = products[model.id] ?? [];
              const hasProducts = modelProducts.length > 0;
              return (
                <tr
                  key={model.id}
                  className={`border-border hover:bg-muted/20 border-b transition-colors last:border-0 ${
                    i % 2 === 0 ? "" : "bg-muted/10"
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className="font-serif text-base font-medium">{model.name}</span>
                  </td>
                  <td className="text-muted-foreground hidden px-6 py-4 sm:table-cell">{model.description}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-secondary text-secondary-foreground inline-flex size-8 items-center justify-center rounded-full text-sm font-medium">
                      {model.count}
                    </span>
                  </td>
                  <td className="text-muted-foreground px-6 py-4 text-center">{modelProducts.length}</td>
                  <td className="hidden px-6 py-4 text-center md:table-cell">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        hasProducts
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {hasProducts ? "Ativo" : "Sem SKUs"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onEditModel(model)}>
                      <Pencil className="size-3.5" />
                      Editar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
