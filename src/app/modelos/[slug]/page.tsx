import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/src/components/layout/header";
import { models, getModelById, getProductsByModel } from "@/src/data";
import { AddToCartButton } from "@/src/components/shared/add-to-cart-button";
import { ProductCard } from "@/src/components/shared/product-card";

export function generateStaticParams() {
  return models.map((model) => ({
    slug: model.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModelById(slug);

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

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModelById(slug);

  if (!model) {
    notFound();
  }

  const products = getProductsByModel(slug);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 px-4 py-8">
          {/* Image */}
          <div className="relative aspect-square lg:aspect-auto lg:h-150 w-full h-full bg-card">
            <Image
              src={model.image}
              alt={model.name}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 lg:py-0 bg-card">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
              Coleção
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-medium mb-6">
              {model.name}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              {model.fullDescription}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {model.count} produtos disponíveis
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Cores: Bege, Preto, Caramelo, Vinho, Verde Oliva, Marrom,
                Terracota
              </span>
            </div>
            <div className="flex items-center gap-4 mt-8">
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
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
              Explore
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-medium">
              Bolsas {model.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground font-medium mb-6">
            Não encontrou o que procurava?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Explore nossa coleção completa ou entre em contato para um
            atendimento personalizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium tracking-wide uppercase"
            >
              Ver Todos os Modelos
            </Link>
            <button className="px-8 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium tracking-wide uppercase">
              Fale Conosco
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-4">
            Ária Bags
          </h3>
          <p className="text-muted-foreground text-sm">
            © 2026 Ária Bags. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
