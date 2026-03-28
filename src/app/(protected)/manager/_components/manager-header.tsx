import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function ManagerHeader() {
  return (
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
  );
}
