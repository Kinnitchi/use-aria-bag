import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/src/components/layout/header";
import { getModels, getModelBySlug, getProductsByModelSlug } from "@/src/db/queries";
import { AddToCartButton } from "@/src/components/shared/add-to-cart-button";
import { ProductCard } from "@/src/components/shared/product-card";

export async function generateStaticParams() {
  const models = await getModels();
  return models.map((model) => ({
    slug: model.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) {
    return {
      title: "Modelo não encontrado | Ária bags",
    };
  }

  return {
    title: `${model.name} | Ária bags`,
    description: model.fullDescription,
  };
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const products = await getProductsByModelSlug(slug);

  return (
    <main className="bg-background min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 md:pt-24">
        <div className="grid grid-cols-1 gap-0 px-4 py-8 lg:grid-cols-2">
          {/* Image */}
          <div className="bg-card relative aspect-square h-full w-full lg:aspect-auto lg:h-150">
            <Image src={model.image} alt={model.name} fill className="object-contain" priority />
          </div>

          {/* Content */}
          <div className="bg-card flex flex-col justify-center px-8 py-12 md:px-16 lg:px-20 lg:py-0">
            <p className="text-muted-foreground mb-4 text-sm tracking-[0.3em] uppercase">Coleção</p>
            <h1 className="text-foreground mb-6 font-serif text-4xl font-medium md:text-5xl lg:text-6xl">
              {model.name}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">{model.fullDescription}</p>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">{model.count} produtos disponíveis</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                Cores: Bege, Preto, Caramelo, Vinho, Verde Oliva, Marrom, Terracota
              </span>
            </div>
            <div className="mt-8 flex items-center gap-4">
              {products[0] && (
                <AddToCartButton
                  modelId={slug}
                  productId={products[0].id}
                  productName={products[0].name}
                  price={products[0].price}
                  color={products[0].color}
                  image={model.image}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="text-muted-foreground mb-4 text-sm tracking-[0.3em] uppercase">Explore</p>
            <h2 className="text-foreground font-serif text-3xl font-medium md:text-4xl">Bolsas {model.name}</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                modelId={slug}
                productId={product.id}
                name={product.name}
                price={product.price}
                color={product.color}
                image={model.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-foreground mb-6 font-serif text-2xl font-medium md:text-3xl">
            Não encontrou o que procurava?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-md">
            Explore nossa coleção completa ou entre em contato para um atendimento personalizado.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8 py-3 text-sm font-medium tracking-wide uppercase transition-colors"
            >
              Ver Todos os Modelos
            </Link>
            <button className="border-border text-foreground hover:bg-muted rounded-lg border px-8 py-3 text-sm font-medium tracking-wide uppercase transition-colors">
              Fale Conosco
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-border border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-foreground mb-4 font-serif text-2xl font-medium">Ária Bags</h3>
          <p className="text-muted-foreground text-sm">© 2026 Ária Bags. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
