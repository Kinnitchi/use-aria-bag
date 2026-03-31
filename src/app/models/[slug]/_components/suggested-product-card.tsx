"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/src/contexts/cart-context";
import { toast } from "sonner";
import type { SuggestedProduct } from "@/src/types";

interface SuggestedProductCardProps {
  product: SuggestedProduct;
}

export function SuggestedProductCard({ product }: SuggestedProductCardProps) {
  const { addItem } = useCart();

  function handleAdd() {
    addItem({
      modelId: product.modelSlug,
      productId: product.id,
      name: product.name,
      price: product.price,
      color: product.color,
      image: product.modelImage,
    });
    toast.success(`${product.name} adicionado à sacola!`);
  }

  return (
    <article className="group bg-card overflow-hidden rounded-lg">
      <Link href={`/models/${product.modelSlug}`} className="block">
        <div className="bg-muted relative aspect-4/5 overflow-hidden">
          <Image
            src={product.modelImage}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-105"
          />
          <div className="bg-foreground/0 group-hover:bg-foreground/5 absolute inset-0 transition-colors duration-500" />
        </div>
      </Link>
      <div className="p-6">
        <p className="text-muted-foreground mb-1 text-xs tracking-[0.2em] uppercase">{product.modelName}</p>
        <h3 className="text-foreground mb-2 font-serif text-lg font-medium">{product.name}</h3>
        <div className="mb-3 flex items-center gap-2">
          <span
            className="border-border inline-block h-3 w-3 rounded-full border"
            style={{ backgroundColor: product.colorHex }}
          />
          <p className="text-muted-foreground text-sm">{product.color}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium">
            R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
          <button
            onClick={handleAdd}
            className="text-accent hover:text-accent/80 cursor-pointer text-sm font-medium tracking-wide uppercase transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
