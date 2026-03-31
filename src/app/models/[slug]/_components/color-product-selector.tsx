"use client";

import { useState } from "react";
import { AddToCartButton } from "@/src/components/shared/add-to-cart-button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";
import type { Product } from "@/src/types";

interface ColorProductSelectorProps {
  products: Product[];
  modelId: string;
  modelImage: string;
}

export function ColorProductSelector({ products, modelId, modelImage }: ColorProductSelectorProps) {
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const selected = products.find((p) => p.id === selectedId) ?? products[0];

  if (!selected || products.length === 0) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col gap-6">
        {/* Color label + swatches */}
        <div>
          <p className="text-muted-foreground mb-3 text-sm uppercase tracking-[0.25em]">
            Cor: <span className="text-foreground font-medium">{selected.color}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {products.map((product) => (
              <Tooltip key={product.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSelectedId(product.id)}
                    aria-label={product.color}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-all duration-200 cursor-pointer",
                      selectedId === product.id
                        ? "border-foreground scale-110 shadow-lg ring-2 ring-foreground/20"
                        : "border-border hover:scale-105 hover:border-muted-foreground",
                    )}
                    style={{ backgroundColor: product.colorHex ?? "#888888" }}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{product.color}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Price */}
        <p className="text-foreground text-2xl font-medium">
          R$ {selected.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>

        {/* Add to cart */}
        <AddToCartButton
          modelId={modelId}
          productId={selected.id}
          productName={selected.name}
          price={selected.price}
          color={selected.color}
          image={modelImage}
        />
      </div>
    </TooltipProvider>
  );
}
