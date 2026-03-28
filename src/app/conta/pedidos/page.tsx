import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { auth } from "@/src/lib/auth";
import { getOrdersByEmail } from "@/src/db/queries";
import { Header } from "@/src/components/layout/header";
import { OrderCard } from "./_components/order-card";

export const metadata = {
  title: "Meus Pedidos | Ária bags",
};

export default async function PedidosPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/autenticacao/login");
  }

  const orders = await getOrdersByEmail(session.user.email);

  return (
    <main className="bg-background min-h-screen">
      <Header />

      <div className="container mx-auto max-w-2xl px-4 pt-28 pb-16 md:pt-32">
        {/* Navegação */}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à loja
        </Link>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-foreground font-serif text-2xl font-medium md:text-3xl">Meus Pedidos</h1>
          {orders.length > 0 && (
            <p className="text-muted-foreground mt-1 text-sm">
              {orders.length} {orders.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
            </p>
          )}
        </div>

        {/* Lista ou estado vazio */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
              <ShoppingBag className="text-muted-foreground h-8 w-8" />
            </div>
            <div>
              <p className="text-foreground font-medium">Nenhum pedido encontrado</p>
              <p className="text-muted-foreground mt-1 text-sm">Quando você fizer um pedido, ele aparecerá aqui.</p>
            </div>
            <Link
              href="/"
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
            >
              Explorar coleção
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                status={order.status}
                totalInCents={order.totalInCents}
                createdAt={order.createdAt}
                items={order.items.map((item) => ({
                  id: item.id,
                  quantity: item.quantity,
                  priceAtTimeInCents: item.priceAtTimeInCents,
                  product: {
                    name: item.product.name,
                    model: {
                      image: item.product.model.image,
                      name: item.product.model.name,
                    },
                    color: { name: item.product.color.name },
                  },
                }))}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
