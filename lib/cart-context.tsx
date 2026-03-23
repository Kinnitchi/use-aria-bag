"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  cartId: string;
  productId: number;
  modelId: string;
  name: string;
  price: number;
  color: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartId" | "quantity">) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(item: Omit<CartItem, "cartId" | "quantity">) {
    const cartId = `${item.modelId}-${item.productId}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) =>
          i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, cartId, quantity: 1 }];
    });
  }

  function removeItem(cartId: string) {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
