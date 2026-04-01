import { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import SliderItem from "./SliderItem";
import { useBanner } from "@/hooks/useBanner";
import type { Banner } from "@/types/bannerType";

const AUTO_SLIDE_INTERVAL = 5000;

/* ── Dot indicators ──────────────────────────────────────────────────────── */
const CarouselDots = ({
  api,
  count,
}: {
  api: CarouselApi | undefined;
  count: number;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (count <= 1) return null;

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
      {Array.from({ length: count }).map((_, index) => (
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

/* ── Skeleton placeholder while loading ─────────────────────────────────────── */
const HeroSkeleton = () => (
  <div className="w-full aspect-video sm:aspect-16/7 lg:aspect-21/7 bg-gray-200 animate-pulse" />
);

/* ── Empty state when no active banners ─────────────────────────────────── */
const HeroEmpty = () => (
  <div className="w-full aspect-video sm:aspect-16/7 lg:aspect-21/7 bg-gray-100 flex items-center justify-center">
    <p className="text-gray-400 text-sm">No banners available</p>
  </div>
);

/* ── Main slider ─────────────────────────────────────────────────────────── */
const HeroSlider = () => {
  const [api, setApi] = useState<CarouselApi>();
  const plugin = useRef(
    Autoplay({ delay: AUTO_SLIDE_INTERVAL, stopOnInteraction: true }),
  );

  const { banners, bannersQuery } = useBanner({ type: "banner" });

  const activeBanners: Banner[] = banners.filter(
    (b: Banner) => b.status === "active" && b.type === "banner",
  );

  if (bannersQuery.isLoading) return <HeroSkeleton />;
  if (activeBanners.length === 0) return <HeroEmpty />;

  return (
    <section className="relative w-full overflow-hidden bg-primary/5 group">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{ loop: activeBanners.length > 1 }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {activeBanners.map((banner, index) => (
            <SliderItem key={banner._id} banner={banner} index={index} />
          ))}
        </CarouselContent>

        {activeBanners.length > 1 && (
          <>
            {/* Always visible on mobile, hover-only on desktop */}
            <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white border-transparent transition-all hover:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer" />
            <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white border-transparent transition-all hover:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer" />
          </>
        )}
      </Carousel>

      <CarouselDots api={api} count={activeBanners.length} />
    </section>
  );
};

export default HeroSlider;
