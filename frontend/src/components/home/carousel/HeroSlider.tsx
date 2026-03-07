import { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import heroFashion from "@/assets/hero-fashion.png";
import heroBeauty from "@/assets/hero-beauty.png";
import heroAccessories from "@/assets/hero-accessories.png";
import SliderItem from "./SliderItem";

const SLIDES = [
  {
    id: 1,
    image: heroFashion,
    subtitle: "New Arrivals 2026",
    title: "Elegant Fashion\nCollection",
    description:
      "Discover stunning dresses and premium apparel curated for every occasion.",
    cta: { label: "Shop Now", href: "/products" },
    align: "left" as const,
  },
  {
    id: 2,
    image: heroBeauty,
    subtitle: "Glow Up Season",
    title: "Premium Beauty\n& Cosmetics",
    description:
      "Luxury lipsticks, skincare essentials, and fragrances you'll love.",
    cta: { label: "Explore Beauty", href: "/categories" },
    align: "left" as const,
  },
  {
    id: 3,
    image: heroAccessories,
    subtitle: "Timeless Luxury",
    title: "Watches &\nAccessories",
    description:
      "Elevate your style with designer watches, jewelry, and sunglasses.",
    cta: { label: "View Collection", href: "/products" },
    align: "left" as const,
  },
] as const;

const AUTO_SLIDE_INTERVAL = 5000;

const CarouselDots = ({ api }: { api: CarouselApi | undefined }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    // Initial check
    onSelect();

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
      {SLIDES.map((_, index) => (
        <button
          key={index}
          onClick={() => api?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === selectedIndex
              ? "w-8 bg-secondary"
              : "w-2 bg-white/50 hover:bg-white/80"
          }`}
        />
      ))}
    </div>
  );
};

const HeroSlider = () => {
  const [api, setApi] = useState<CarouselApi>();

  const plugin = useRef(
    Autoplay({ delay: AUTO_SLIDE_INTERVAL, stopOnInteraction: true }),
  );

  return (
    <section className="relative w-full overflow-hidden bg-primary/5 group">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {SLIDES.map((slide, index) => (
            <SliderItem key={slide.id} slide={slide} index={index} />
          ))}
        </CarouselContent>

        {/* Custom styled Next/Prev overriding default shadcn positioning */}
        <CarouselPrevious className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white border-transparent transition-all hover:bg-white/40 hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer" />
        <CarouselNext className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white border-transparent transition-all hover:bg-white/40 hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer" />
      </Carousel>

      <CarouselDots api={api} />
    </section>
  );
};

export default HeroSlider;
