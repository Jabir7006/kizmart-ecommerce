import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import SliderItem from "./SliderItem";
import type { Banner } from "@/types/bannerType";

const AUTO_SLIDE_INTERVAL = 5000;

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

const HeroCarousel = ({ banners }: { banners: Banner[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const plugin = useRef(
    Autoplay({ delay: AUTO_SLIDE_INTERVAL, stopOnInteraction: true }),
  );

  return (
    <section className="relative w-full overflow-hidden bg-primary/5 group">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{ loop: banners.length > 1 }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {banners.map((banner, index) => (
            <SliderItem key={banner._id} banner={banner} index={index} />
          ))}
        </CarouselContent>

        {banners.length > 1 ? (
          <>
            <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white border-transparent transition-all hover:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer" />
            <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white border-transparent transition-all hover:bg-black/50 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer" />
          </>
        ) : null}
      </Carousel>

      <CarouselDots api={api} count={banners.length} />
    </section>
  );
};

export default HeroCarousel;
