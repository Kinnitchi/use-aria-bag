"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import type { Slide } from "@/src/types";

interface HeroCarouselProps {
  slides: Slide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section
      className="relative h-[85vh] overflow-hidden md:h-screen"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={index === 0} />
          {/* Overlay */}
          <div className="bg-foreground/10 absolute inset-0" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "px-4 text-center transition-all delay-300 duration-700",
                index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
            >
              <p className="text-background/90 mb-4 text-sm tracking-[0.3em] uppercase md:text-base">
                {slide.subtitle}
              </p>
              <h2 className="text-background mb-6 font-serif text-4xl font-medium text-balance md:text-6xl lg:text-7xl">
                {slide.title}
              </h2>
              <p className="text-background/80 mx-auto mb-8 max-w-md text-base md:text-lg">{slide.description}</p>
              <Button
                size="lg"
                asChild
                className="bg-background text-foreground hover:bg-background/90 rounded-sm px-8 py-6 text-sm tracking-wider uppercase"
              >
                <a href={`/modelos/${slide.id}`}>Explorar Coleção</a>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="text-background hover:bg-background/20 absolute top-1/2 left-4 h-12 w-12 -translate-y-1/2 rounded-full md:left-8"
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Slide anterior</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="text-background hover:bg-background/20 absolute top-1/2 right-4 h-12 w-12 -translate-y-1/2 rounded-full md:right-8"
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Próximo slide</span>
      </Button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "transition-all duration-300",
              index === currentSlide
                ? "bg-background h-1 w-8"
                : "bg-background/50 hover:bg-background/80 h-2 w-2 rounded-full"
            )}
          >
            <span className="sr-only">Ir para slide {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
