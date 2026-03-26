import { Header } from "@/src/components/layout/header";
import { HeroCarousel } from "@/src/components/shared/hero-carousel";
import { ModelNav, ModelShowcase } from "@/src/components/shared/model-nav";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroCarousel />
      <ModelNav />
      <ModelShowcase />

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
            Newsletter
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground font-medium mb-6">
            Fique por Dentro das Novidades
          </h2>
          <p className="text-muted-foreground mb-8">
            Receba em primeira mão nossas novas coleções, promoções exclusivas e
            dicas de estilo.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium tracking-wide uppercase"
            >
              Inscrever
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">
                Ária bags
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Bolsas de luxo artesanais, criadas com os melhores materiais e
                atenção aos detalhes.
              </p>
            </div>
            <div>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Todas as Bolsas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Novidades
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Mais Vendidos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Promoções
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">
                Sobre
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Nossa História
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Artesanato
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Sustentabilidade
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Trabalhe Conosco
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground uppercase tracking-wide mb-4">
                Atendimento
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Envio e Entrega
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Trocas e Devoluções
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 Ária bags. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/useariabags/"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
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
