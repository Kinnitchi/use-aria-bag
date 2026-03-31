"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  User,
  Trash2,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Package,
  LogOut,
  Layers,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/src/components/ui/sheet";
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
      smoothScrollToCollections("models");
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
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
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
            <SheetContent side="left" className="bg-background flex w-72 flex-col p-0">
              {/* Header */}
              <SheetHeader className="border-border border-b px-6 py-5">
                <SheetTitle className="font-serif text-xl tracking-wider">Ária bags</SheetTitle>
                <SheetDescription className="sr-only">Menu de navegação</SheetDescription>
              </SheetHeader>

              {/* Navigation */}
              <nav className="py- flex flex-col gap-1 px-3">
                <p className="text-muted-foreground mb-1 px-3 text-xs font-semibold tracking-widest uppercase">
                  Navegação
                </p>
                <button
                  onClick={() => smoothScrollToCollections("modelos")}
                  className="text-foreground hover:bg-muted hover:text-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none"
                >
                  <Layers className="text-muted-foreground h-4 w-4 shrink-0" />
                  Coleções
                </button>
                <Link
                  href="#"
                  className="text-foreground hover:bg-muted hover:text-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                >
                  <Package className="text-muted-foreground h-4 w-4 shrink-0" />
                  Contato
                </Link>
              </nav>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Account Section */}
              <div className="border-border border-t p-3">
                {isLoggedIn ? (
                  <>
                    {/* User Info */}
                    <div className="bg-muted mb-2 flex items-center gap-3 rounded-md px-3 py-3">
                      <div className="bg-ring text-background flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm leading-tight font-medium">{user?.name}</p>
                        <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                      </div>
                    </div>

                    {/* Account Links */}
                    <div className="flex flex-col gap-1">
                      {isAdmin && (
                        <Link
                          href="/manager"
                          className="text-foreground hover:bg-muted hover:text-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                        >
                          <LayoutDashboard className="text-muted-foreground h-4 w-4 shrink-0" />
                          Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="text-foreground hover:bg-muted hover:text-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                      >
                        <User className="text-muted-foreground h-4 w-4 shrink-0" />
                        Meu Perfil
                      </Link>

                      <Link
                        href="/account/orders"
                        className="text-foreground hover:bg-muted hover:text-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                      >
                        <ShoppingBag className="text-muted-foreground h-4 w-4 shrink-0" />
                        Meus Pedidos
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-destructive hover:bg-destructive/10 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none"
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Sair
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/authentication/login"
                      className="bg-ring text-background hover:bg-ring/90 flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                    >
                      <LogIn className="h-4 w-4 shrink-0" />
                      Entrar
                    </Link>
                    <Link
                      href="/authentication/register"
                      className="border-border text-foreground hover:bg-muted flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors"
                    >
                      <UserPlus className="h-4 w-4 shrink-0" />
                      Criar conta
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Nav Left */}
          <nav className="hidden flex-1 items-center gap-8 md:flex">
            <button
              onClick={goToCollections}
              className="text-foreground hover:text-ring cursor-pointer text-sm font-medium tracking-wide uppercase transition-colors focus-visible:outline-none"
            >
              Coleções
            </button>
          </nav>

          {/* Logo */}
          <button
            onClick={goToCollectionsCarrosel}
            className="text-foreground hover:text-ring cursor-pointer font-serif text-2xl font-semibold tracking-wider transition-colors focus-visible:outline-none md:text-3xl"
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
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex cursor-pointer items-center gap-2">
                          <User className="focus:text-accent-foreground h-4 w-4" />
                          Meu Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/orders" className="flex cursor-pointer items-center gap-2">
                          <Package className="focus:text-accent-foreground h-4 w-4" />
                          Meus Pedidos
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/manager" className="flex cursor-pointer items-center gap-2">
                            <LayoutDashboard className="focus:text-accent-foreground h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-accent-foreground flex cursor-pointer items-center gap-2"
                    >
                      <LogOut className="focus:text-accent-foreground h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/authentication/login" className="flex cursor-pointer items-center gap-2">
                          <LogIn className="focus:text-accent-foreground h-4 w-4" />
                          Entrar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/authentication/register" className="flex cursor-pointer items-center gap-2">
                          <UserPlus className="focus:text-accent-foreground h-4 w-4" />
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
                    <span className="bg-ring text-accent-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                  <span className="sr-only">Carrinho</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background flex w-80 flex-col p-0">
                <SheetHeader className="border-border border-b px-5 py-4">
                  <SheetTitle className="font-serif text-xl">Sua Sacola</SheetTitle>
                  {totalItems > 0 && (
                    <p className="text-muted-foreground text-xs">
                      {totalItems} {totalItems === 1 ? "item" : "itens"}
                    </p>
                  )}
                </SheetHeader>

                {items.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3">
                    <ShoppingBag className="text-muted-foreground h-10 w-10" strokeWidth={1.2} />
                    <p className="text-muted-foreground text-sm">Sua sacola está vazia.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 space-y-1 overflow-y-auto px-4 py-3">
                      {items.map((item) => (
                        <div key={item.cartId} className="flex items-center gap-3 py-3">
                          {/* Thumbnail */}
                          <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-foreground truncate text-sm leading-tight font-medium">{item.name}</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">{item.color}</p>
                            <p className="text-foreground mt-1 text-sm font-semibold">
                              R$ {(item.price * item.quantity).toLocaleString("pt-BR")}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex shrink-0 flex-col items-center gap-1.5">
                            <button
                              aria-label="Remover item"
                              onClick={() => removeItem(item.cartId)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <div className="border-border flex items-center gap-1 rounded-md border">
                              <button
                                aria-label="Diminuir quantidade"
                                onClick={() => updateQuantity(item.cartId, -1)}
                                className="text-foreground hover:bg-muted flex h-6 w-6 items-center justify-center rounded-l-md transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-foreground w-5 text-center text-xs font-medium tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                aria-label="Aumentar quantidade"
                                onClick={() => updateQuantity(item.cartId, 1)}
                                className="text-foreground hover:bg-muted flex h-6 w-6 items-center justify-center rounded-r-md transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="border-border border-t px-4 py-4">
                      <div className="mb-1 flex justify-between">
                        <span className="text-muted-foreground text-sm">Subtotal</span>
                        <span className="text-foreground text-sm font-semibold">
                          R$ {totalPrice.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4 text-xs">Frete calculado no checkout</p>
                      <Button className="w-full cursor-pointer" style={{ backgroundColor: "var(--color-ring)" }}>
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
