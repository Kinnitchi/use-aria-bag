import { Header } from "@/src/components/layout/header";
import { HeroCarousel } from "@/src/components/shared/hero-carousel";
import { ModelNav, ModelShowcase } from "@/src/components/shared/model-nav";
import { getModels, getSlides } from "@/src/db/queries";

export default async function Home() {
  const [models, slides] = await Promise.all([getModels(), getSlides()]);

  return (
    <main className="bg-background min-h-screen">
      <Header />
      <HeroCarousel slides={slides} />
      <ModelNav models={models} />
      <ModelShowcase models={models} />

      {/* Newsletter Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <p className="text-muted-foreground mb-4 text-sm tracking-[0.3em] uppercase">Newsletter</p>
          <h2 className="text-foreground mb-6 font-serif text-2xl font-medium md:text-3xl lg:text-4xl">
            Fique por Dentro das Novidades
          </h2>
          <p className="text-muted-foreground mb-8">
            Receba em primeira mão nossas novas coleções, promoções exclusivas e dicas de estilo.
          </p>
          <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="bg-background border-border focus:ring-accent/50 text-foreground placeholder:text-muted-foreground flex-1 rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors"
            >
              Inscrever
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-border border-t py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
            <div>
              <h3 className="text-foreground mb-4 font-serif text-2xl font-medium">Ária bags</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Bolsas de luxo artesanais, criadas com os melhores materiais e atenção aos detalhes.
              </p>
            </div>
            <div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Todas as Bolsas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Novidades
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Mais Vendidos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Promoções
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 text-sm font-medium tracking-wide uppercase">Sobre</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Nossa História
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Artesanato
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Sustentabilidade
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Trabalhe Conosco
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 text-sm font-medium tracking-wide uppercase">Atendimento</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Envio e Entrega
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    Trocas e Devoluções
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-border flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
            <p className="text-muted-foreground text-sm">© 2026 Ária bags. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/useariabags/"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
