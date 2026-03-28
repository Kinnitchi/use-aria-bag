"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, User, Trash2, LogIn, UserPlus, LayoutDashboard, Package, LogOut } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/src/components/ui/sheet";
import { useCart } from "@/src/contexts/cart-context";
import { useAuth } from "@/src/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

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
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }
  return (
    <header className="bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background w-70">
              <nav className="mt-8 flex flex-col gap-4">
                <button
                  onClick={() => smoothScrollToCollections("modelos")}
                  className="text-foreground hover:text-accent text-left text-lg font-medium transition-colors focus-visible:outline-none"
                >
                  Coleções
                </button>
                <Link href="#" className="text-foreground hover:text-accent text-lg font-medium transition-colors">
                  Contato
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Nav Left */}
          <nav className="hidden flex-1 items-center gap-8 md:flex">
            <button
              onClick={goToCollections}
              className="text-foreground hover:text-accent cursor-pointer text-sm font-medium tracking-wide uppercase transition-colors focus-visible:outline-none"
            >
              Coleções
            </button>
          </nav>

          {/* Logo */}
          <button
            onClick={goToCollectionsCarrosel}
            className="text-foreground hover:text-accent cursor-pointer font-serif text-2xl font-semibold tracking-wider transition-colors focus-visible:outline-none md:text-3xl"
          >
            Ária bags
          </button>

          {/* Desktop Nav Right + Actions */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <nav className="hidden items-center gap-8 md:flex"></nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hidden cursor-pointer md:flex">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Conta</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-sm leading-none font-medium">{user?.name}</p>
                      <p className="text-muted-foreground mt-1 truncate text-xs">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/manager" className="flex cursor-pointer items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/conta/pedidos" className="flex cursor-pointer items-center gap-2">
                          <Package className="h-4 w-4" />
                          Meus Pedidos
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/autenticacao/login" className="flex cursor-pointer items-center gap-2">
                          <LogIn className="h-4 w-4" />
                          Entrar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/autenticacao/cadastro" className="flex cursor-pointer items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          Criar conta
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground relative cursor-pointer">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="bg-accent text-accent-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                  <span className="sr-only">Carrinho</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background flex w-80 flex-col">
                <SheetHeader>
                  <SheetTitle className="font-serif text-xl">Sua Sacola</SheetTitle>
                </SheetHeader>
                {items.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-muted-foreground text-sm">Sua sacola está vazia.</p>
                  </div>
                ) : (
                  <>
                    <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div key={item.cartId} className="flex items-start gap-3">
                          <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-foreground text-sm leading-tight font-medium">{item.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {item.color} · Qtd: {item.quantity}
                            </p>
                            <p className="text-foreground mt-1 text-sm font-medium">
                              R$ {(item.price * item.quantity).toLocaleString("pt-BR")}
                            </p>
                          </div>
                          <button
                            aria-label="Remover item"
                            onClick={() => removeItem(item.cartId)}
                            className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-border mt-4 border-t pt-4">
                      <div className="mb-4 flex justify-between">
                        <span className="text-foreground font-medium">Total</span>
                        <span className="text-foreground font-medium">R$ {totalPrice.toLocaleString("pt-BR")}</span>
                      </div>
                      <Button className="w-full" style={{ backgroundColor: "var(--color-accent)" }}>
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
