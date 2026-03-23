"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { slides } from "@/lib/data";

export function HeroCarousel() {
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
      className="relative h-[85vh] md:h-screen overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-foreground/10" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "text-center px-4 transition-all duration-700 delay-300",
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8",
              )}
            >
              <p className="text-background/90 text-sm md:text-base tracking-[0.3em] uppercase mb-4">
                {slide.subtitle}
              </p>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-background font-medium mb-6 text-balance">
                {slide.title}
              </h2>
              <p className="text-background/80 text-base md:text-lg mb-8 max-w-md mx-auto">
                {slide.description}
              </p>
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
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-background hover:bg-background/20 h-12 w-12 rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Slide anterior</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-background hover:bg-background/20 h-12 w-12 rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Próximo slide</span>
      </Button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "transition-all duration-300",
              index === currentSlide
                ? "w-8 h-1 bg-background"
                : "w-2 h-2 bg-background/50 rounded-full hover:bg-background/80",
            )}
          >
            <span className="sr-only">Ir para slide {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
