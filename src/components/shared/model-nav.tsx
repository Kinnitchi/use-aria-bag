"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import type { Model } from "@/src/types";

interface ModelNavProps {
  models: Model[];
}

export function ModelNav({ models }: ModelNavProps) {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  return (
    <section className="bg-secondary border-border sticky top-16 z-40 border-b py-4 md:top-20">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-center gap-12 md:flex">
          {models.map((model) => (
            <Link
              key={model.id}
              href={`/models/${model.id}`}
              className="group relative py-2"
              onMouseEnter={() => setHoveredModel(model.id)}
              onMouseLeave={() => setHoveredModel(null)}
            >
              <span className="text-foreground/80 group-hover:text-foreground text-sm font-medium tracking-wide uppercase transition-colors">
                {model.name}
              </span>
              <span
                className={cn(
                  "bg-accent absolute bottom-0 left-0 h-0.5 w-full origin-left transition-transform",
                  hoveredModel === model.id ? "scale-x-100" : "scale-x-0"
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Mobile Horizontal Scroll */}
        <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 md:hidden">
          <nav className="flex w-max items-center gap-6">
            {models.map((model) => (
              <Link
                key={model.id}
                href={`/models/${model.id}`}
                className="text-foreground/80 hover:text-foreground py-2 text-sm font-medium tracking-wide whitespace-nowrap uppercase transition-colors"
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

export function ModelShowcase({ models }: ModelNavProps) {
  return (
    <section id="modelos" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center md:mb-16">
          <p className="text-muted-foreground mb-4 text-sm tracking-[0.3em] uppercase">Nossos Modelos</p>
          <h2 className="text-foreground font-serif text-3xl font-medium text-balance md:text-4xl lg:text-5xl">
            Encontre o Seu Estilo
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {models.map((model) => (
            <Link
              key={model.id}
              href={`/models/${model.id}`}
              id={model.id}
              className="group bg-card relative overflow-hidden rounded-lg"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="bg-foreground/0 group-hover:bg-foreground/10 absolute inset-0 transition-colors duration-500" />
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-foreground mb-1 font-serif text-xl font-medium md:text-2xl">{model.name}</h3>
                  <p className="text-muted-foreground text-sm">{model.description}</p>
                </div>
                <span className="text-muted-foreground text-sm">{model.count} produtos</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
