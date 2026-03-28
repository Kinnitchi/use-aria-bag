"use client";

import { Button } from "@/src/components/ui/button";
import { useCart } from "@/src/contexts/cart-context";
import { toast } from "sonner";

interface AddToCartButtonProps {
  modelId: string;
  productId: string;
  productName: string;
  price: number;
  color: string;
  image: string;
}

export function AddToCartButton({ modelId, productId, productName, price, color, image }: AddToCartButtonProps) {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem({ modelId, productId, name: productName, price, color, image });
    toast.success(`${productName} adicionado à sacola!`);
  }

  return (
    <Button
      onClick={handleAddToCart}
      className="text-background hover:bg-ring/90 cursor-pointer rounded-sm px-8 py-6 text-sm tracking-wider uppercase"
    >
      Adicionar a sacola
    </Button>
  );
}
