"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";

function useCollectionsNav() {
  const pathname = usePathname();
  const router = useRouter();

  return () => {
    if (pathname === "/") {
      smoothScrollToCollections("modelos");
    } else {
      router.push("/#modelos");
    }
  };
}

function smoothScrollToCollections(elementId: string) {
  const el = document.getElementById(elementId);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function useCollectionsNavCarrosel() {
  const pathname = usePathname();
  const router = useRouter();

  return () => {
    if (pathname === "/") {
      smoothScrollToCollections("carrosel");
    } else {
      router.push("/#carrosel");
    }
  };
}

export function Header() {
  const goToCollections = useCollectionsNav();
  const goToCollectionsCarrosel = useCollectionsNavCarrosel();
  const { items, removeItem, totalItems, totalPrice } = useCart();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-70 bg-background">
              <nav className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => smoothScrollToCollections("modelos")}
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors text-left"
                >
                  Coleções
                </button>
                <Link
                  href="#"
                  className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                >
                  Contato
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Nav Left */}
          <nav className="hidden md:flex flex-1 items-center gap-8">
            <button
              onClick={goToCollections}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors tracking-wide uppercase cursor-pointer"
            >
              Coleções
            </button>
          </nav>

          {/* Logo */}
          <nav
            onClick={goToCollectionsCarrosel}
            className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-foreground cursor-pointer"
          >
            <button className="cursor-pointer hover:text-accent">
              Ária bags
            </button>
            <h1></h1>
          </nav>

          {/* Desktop Nav Right + Actions */}
          <div className="flex flex-1 items-center justify-end gap-4 ">
            <nav className="hidden md:flex items-center gap-8 "></nav>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hidden md:flex cursor-pointer"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Conta</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground relative cursor-pointer"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-medium">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                  <span className="sr-only">Carrinho</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-background flex flex-col"
              >
                <SheetHeader>
                  <SheetTitle className="font-serif text-xl">
                    Sua Sacola
                  </SheetTitle>
                </SheetHeader>
                {items.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      Sua sacola está vazia.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
                      {items.map((item) => (
                        <div
                          key={item.cartId}
                          className="flex gap-3 items-start"
                        >
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground leading-tight">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.color} · Qtd: {item.quantity}
                            </p>
                            <p className="text-sm font-medium text-foreground mt-1">
                              R${" "}
                              {(item.price * item.quantity).toLocaleString(
                                "pt-BR",
                              )}
                            </p>
                          </div>
                          <button
                            aria-label="Remover item"
                            onClick={() => removeItem(item.cartId)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium text-foreground">
                          Total
                        </span>
                        <span className="font-medium text-foreground">
                          R$ {totalPrice.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <Button
                        className="w-full"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      >
                        Finalizar Compra
                      </Button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
