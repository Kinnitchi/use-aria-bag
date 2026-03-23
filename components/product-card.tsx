"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

interface ProductCardProps {
  modelId: string;
  productId: number;
  name: string;
  price: number;
  color: string;
  image: string;
}

export function ProductCard({
  modelId,
  productId,
  name,
  price,
  color,
  image,
}: ProductCardProps) {
  const { addItem } = useCart();

  function handleAdd() {
    addItem({ modelId, productId, name, price, color, image });
    toast.success(`${name} adicionado à sacola!`);
  }

  return (
    <article className="group bg-card rounded-lg overflow-hidden">
      <div className="aspect-4/5 relative bg-muted overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
      </div>
      <div className="p-6">
        <h3 className="font-serif text-lg text-foreground font-medium mb-2">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">Cor: {color}</p>
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium">
            R$ {price.toLocaleString("pt-BR")}
          </span>
          <button
            onClick={handleAdd}
            className="text-sm text-accent hover:text-accent/80 transition-colors font-medium uppercase tracking-wide cursor-pointer"
          >
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
