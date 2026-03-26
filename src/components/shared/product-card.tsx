"use client";

import Image from "next/image";
import { useCart } from "@/src/contexts/cart-context";
import { toast } from "sonner";

interface ProductCardProps {
  modelId: string;
  productId: string;
  name: string;
  price: number;
  color: string;
  image: string;
}

export function ProductCard({ modelId, productId, name, price, color, image }: ProductCardProps) {
  const { addItem } = useCart();

  function handleAdd() {
    addItem({ modelId, productId, name, price, color, image });
    toast.success(`${name} adicionado à sacola!`);
  }

  return (
    <article className="group bg-card overflow-hidden rounded-lg">
      <div className="bg-muted relative aspect-4/5 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-105"
        />
        <div className="bg-foreground/0 group-hover:bg-foreground/5 absolute inset-0 transition-colors duration-500" />
      </div>
      <div className="p-6">
        <h3 className="text-foreground mb-2 font-serif text-lg font-medium">{name}</h3>
        <p className="text-muted-foreground mb-3 text-sm">Cor: {color}</p>
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium">R$ {price.toLocaleString("pt-BR")}</span>
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
