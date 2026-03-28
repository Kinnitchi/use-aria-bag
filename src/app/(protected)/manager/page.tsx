"use client";

import { useState } from "react";
import { ManagerHeader } from "./_components/manager-header";
import { StatsOverview } from "./_components/stats-overview";
import { ModelsTable } from "./_components/models-table";
import { ProductsGrid } from "./_components/products-grid";
import { EmptyModelsWarning } from "./_components/empty-models-warning";
import { EditModelDialog } from "./_components/edit-model-dialog";
import { ProductFormDialog } from "./_components/product-form-dialog";
import type { Model, Product } from "@/src/types";

export default function ManagerPage() {
  const [editModelTarget, setEditModelTarget] = useState<Model | null>(null);
  const [productDialogState, setProductDialogState] = useState<{
    modelId: string;
    modelName: string;
    product: Product | null;
  } | null>(null);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <ManagerHeader />

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        <StatsOverview />

        <ModelsTable onEditModel={setEditModelTarget} />

        <ProductsGrid
          onEditProduct={(modelId, modelName, product) => setProductDialogState({ modelId, modelName, product })}
          onAddProduct={(modelId, modelName) => setProductDialogState({ modelId, modelName, product: null })}
        />

        <EmptyModelsWarning />
      </div>

      <EditModelDialog
        model={editModelTarget}
        open={editModelTarget !== null}
        onClose={() => setEditModelTarget(null)}
      />

      <ProductFormDialog
        modelId={productDialogState?.modelId ?? ""}
        modelName={productDialogState?.modelName ?? ""}
        product={productDialogState?.product ?? null}
        open={productDialogState !== null}
        onClose={() => setProductDialogState(null)}
      />
    </main>
  );
}
