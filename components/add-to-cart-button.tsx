"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

interface AddToCartButtonProps {
  modelId: string;
  productId: number;
  productName: string;
  price: number;
  color: string;
  image: string;
}

export function AddToCartButton({
  modelId,
  productId,
  productName,
  price,
  color,
  image,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem({ modelId, productId, name: productName, price, color, image });
    toast.success(`${productName} adicionado à sacola!`);
  }

  return (
    <Button
      onClick={handleAddToCart}
      className="cursor-pointer text-background hover:bg-accent/90 rounded-sm px-8 py-6 text-sm tracking-wider uppercase"
    >
      Adicionar a sacola
    </Button>
  );
}
