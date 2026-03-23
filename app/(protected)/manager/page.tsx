import { models, products } from "@/lib/data";
import { ShoppingBag, Package, Layers, TrendingUp, Tag, BarChart3, ExternalLink } from "lucide-react";
import Link from "next/link";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={`border-border flex flex-col gap-3 rounded-2xl border p-6 shadow-sm ${
        accent ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium tracking-widest uppercase ${
            accent ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
        <Icon className={`size-5 ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`} />
      </div>
      <span className="font-serif text-3xl font-semibold">{value}</span>
      {sub && (
        <span className={`text-xs ${accent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{sub}</span>
      )}
    </div>
  );
}

export default function ManagerPage() {
  const allProducts = Object.values(products).flat();
  const totalSkus = allProducts.length;
  const totalStock = models.reduce((sum, m) => sum + m.count, 0);
  const minPrice = Math.min(...allProducts.map((p) => p.price));
  const maxPrice = Math.max(...allProducts.map((p) => p.price));
  const avgPrice = allProducts.reduce((sum, p) => sum + p.price, 0) / allProducts.length;
  const modelsWithProducts = models.filter((m) => products[m.id as keyof typeof products]);
  const modelsWithoutProducts = models.filter((m) => !products[m.id as keyof typeof products]);

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="border-border bg-card border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <div>
            <p className="text-muted-foreground mb-1 text-xs tracking-widest uppercase">Painel Administrativo</p>
            <h1 className="font-serif text-3xl font-semibold">Ária Bags</h1>
          </div>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            Ver loja <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        {/* KPI Cards */}
        <section>
          <h2 className="text-muted-foreground mb-5 text-xs tracking-widest uppercase">Visão Geral</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Modelos"
              value={String(models.length)}
              sub={`${modelsWithProducts.length} com SKUs cadastrados`}
              icon={Layers}
              accent
            />
            <StatCard label="SKUs Cadastrados" value={String(totalSkus)} sub="Produtos com preço e cor" icon={Tag} />
            <StatCard
              label="Unidades em Estoque"
              value={String(totalStock)}
              sub="Soma de todos os modelos"
              icon={Package}
            />
            <StatCard
              label="Ticket Médio"
              value={formatCurrency(avgPrice)}
              sub={`${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`}
              icon={TrendingUp}
            />
          </div>
        </section>

        {/* Models Table */}
        <section>
          <h2 className="text-muted-foreground mb-5 text-xs tracking-widest uppercase">Modelos & Estoque</h2>
          <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border bg-muted/40 text-muted-foreground border-b">
                  <th className="px-6 py-4 text-left font-medium">Modelo</th>
                  <th className="hidden px-6 py-4 text-left font-medium sm:table-cell">Descrição</th>
                  <th className="px-6 py-4 text-center font-medium">Estoque</th>
                  <th className="px-6 py-4 text-center font-medium">SKUs</th>
                  <th className="hidden px-6 py-4 text-center font-medium md:table-cell">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model, i) => {
                  const modelProducts = products[model.id as keyof typeof products] ?? [];
                  const hasProducts = modelProducts.length > 0;
                  return (
                    <tr
                      key={model.id}
                      className={`border-border hover:bg-muted/20 border-b transition-colors last:border-0 ${
                        i % 2 === 0 ? "" : "bg-muted/10"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-serif text-base font-medium">{model.name}</span>
                      </td>
                      <td className="text-muted-foreground hidden px-6 py-4 sm:table-cell">{model.description}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-secondary text-secondary-foreground inline-flex size-8 items-center justify-center rounded-full text-sm font-medium">
                          {model.count}
                        </span>
                      </td>
                      <td className="text-muted-foreground px-6 py-4 text-center">{modelProducts.length}</td>
                      <td className="hidden px-6 py-4 text-center md:table-cell">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            hasProducts
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}
                        >
                          {hasProducts ? "Ativo" : "Sem SKUs"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/modelos/${model.id}`}
                          className="text-accent hover:text-accent/80 text-xs font-medium tracking-wider uppercase transition-colors"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Products Breakdown */}
        <section>
          <h2 className="text-muted-foreground mb-5 text-xs tracking-widest uppercase">Produtos por Modelo</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modelsWithProducts.map((model) => {
              const modelProducts = products[model.id as keyof typeof products]!;
              const lowestPrice = Math.min(...modelProducts.map((p) => p.price));
              const highestPrice = Math.max(...modelProducts.map((p) => p.price));
              return (
                <div key={model.id} className="border-border bg-card rounded-2xl border p-6 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-medium">{model.name}</h3>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {formatCurrency(lowestPrice)} – {formatCurrency(highestPrice)}
                      </p>
                    </div>
                    <div className="bg-secondary text-secondary-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
                      <ShoppingBag className="size-3" />
                      {model.count} un.
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {modelProducts.map((product) => (
                      <li key={product.id} className="flex items-center justify-between text-sm">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="bg-accent size-2 shrink-0 rounded-full" />
                          <span className="text-foreground truncate">{product.name}</span>
                        </div>
                        <div className="ml-2 flex shrink-0 items-center gap-3">
                          <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                            {product.color}
                          </span>
                          <span className="font-medium tabular-nums">{formatCurrency(product.price)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Models without products */}
        {modelsWithoutProducts.length > 0 && (
          <section>
            <h2 className="text-muted-foreground mb-5 text-xs tracking-widest uppercase">
              Modelos sem SKUs Cadastrados
            </h2>
            <div className="border-border bg-muted/20 rounded-2xl border border-dashed p-6">
              <div className="text-muted-foreground mb-4 flex items-center gap-3">
                <BarChart3 className="size-5" />
                <p className="text-sm">
                  Estes modelos aparecem no catálogo mas não possuem produtos com preço definido.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {modelsWithoutProducts.map((model) => (
                  <div
                    key={model.id}
                    className="border-border bg-card flex items-center gap-2 rounded-xl border px-4 py-2.5"
                  >
                    <span className="font-serif font-medium">{model.name}</span>
                    <span className="text-muted-foreground text-xs">
                      · {model.count} un. · {model.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
