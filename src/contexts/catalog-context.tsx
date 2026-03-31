"use client";

import { createContext, useContext, useState } from "react";
import type { Model, Product } from "@/src/types";

interface CatalogContextType {
  models: Model[];
  products: Record<string, Product[]>;
  addModel: (model: Model) => void;
  updateModel: (modelId: string, updates: Partial<Omit<Model, "id">>) => void;
  updateProduct: (modelId: string, productId: string, updates: Partial<Omit<Product, "id">>) => void;
  addProduct: (modelId: string, product: Product) => void;
  deleteProduct: (modelId: string, productId: string) => void;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({
  children,
  initialModels,
  initialProducts,
}: {
  children: React.ReactNode;
  initialModels: Model[];
  initialProducts: Record<string, Product[]>;
}) {
  const [models, setModels] = useState<Model[]>(initialModels);
  const [products, setProducts] = useState<Record<string, Product[]>>(initialProducts);

  function addModel(model: Model) {
    setModels((prev) => [...prev, model]);
  }

  function updateModel(modelId: string, updates: Partial<Omit<Model, "id">>) {
    setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, ...updates } : m)));
  }

  function updateProduct(modelId: string, productId: string, updates: Partial<Omit<Product, "id">>) {
    setProducts((prev) => ({
      ...prev,
      [modelId]: (prev[modelId] ?? []).map((p) => (p.id === productId ? { ...p, ...updates } : p)),
    }));
  }

  function addProduct(modelId: string, product: Product) {
    setProducts((prev) => {
      const existing = prev[modelId] ?? [];
      return { ...prev, [modelId]: [...existing, product] };
    });
  }

  function deleteProduct(modelId: string, productId: string) {
    setProducts((prev) => ({
      ...prev,
      [modelId]: (prev[modelId] ?? []).filter((p) => p.id !== productId),
    }));
  }

  return (
    <CatalogContext.Provider
      value={{ models, products, addModel, updateModel, updateProduct, addProduct, deleteProduct }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
