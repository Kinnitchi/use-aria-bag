"use client";

import { useState } from "react";
import { PageHeader } from "../_components/page-header";
import { ProductsGrid } from "../_components/products-grid";
import { ProductFormDialog } from "../_components/product-form-dialog";
import type { Product } from "@/src/types";

export default function ProdutosPage() {
  const [productDialogState, setProductDialogState] = useState<{
    modelId: string;
    modelName: string;
    product: Product | null;
  } | null>(null);

  return (
    <>
      <PageHeader title="Gerenciar Produtos" />
      <div className="p-6">
        <ProductsGrid
          onEditProduct={(modelId, modelName, product) => setProductDialogState({ modelId, modelName, product })}
          onAddProduct={(modelId, modelName) => setProductDialogState({ modelId, modelName, product: null })}
        />
      </div>

      <ProductFormDialog
        modelId={productDialogState?.modelId ?? ""}
        modelName={productDialogState?.modelName ?? ""}
        product={productDialogState?.product ?? null}
        open={productDialogState !== null}
        onClose={() => setProductDialogState(null)}
      />
    </>
  );
}
