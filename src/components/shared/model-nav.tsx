"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

import { models } from "@/src/data";

export function ModelNav() {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  return (
    <section className="bg-secondary py-4 border-b border-border sticky top-16 md:top-20 z-40">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-12">
          {models.map((model) => (
            <Link
              key={model.id}
              href={`/modelos/${model.id}`}
              className="group relative py-2"
              onMouseEnter={() => setHoveredModel(model.id)}
              onMouseLeave={() => setHoveredModel(null)}
            >
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors tracking-wide uppercase">
                {model.name}
              </span>
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-accent transition-transform origin-left",
                  hoveredModel === model.id ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <nav className="flex items-center gap-6 w-max">
            {models.map((model) => (
              <Link
                key={model.id}
                href={`/modelos/${model.id}`}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors tracking-wide uppercase whitespace-nowrap py-2"
              >
                {model.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

export function ModelShowcase() {
  return (
    <section id="modelos" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
            Nossos Modelos
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-medium text-balance">
            Encontre o Seu Estilo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {models.map((model) => (
            <Link
              key={model.id}
              href={`/modelos/${model.id}`}
              id={model.id}
              className="group relative overflow-hidden bg-card rounded-lg"
            >
              <div className="aspect-4/5 relative overflow-hidden">
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl md:text-2xl text-foreground font-medium mb-1">
                    {model.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {model.description}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {model.count} produtos
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
