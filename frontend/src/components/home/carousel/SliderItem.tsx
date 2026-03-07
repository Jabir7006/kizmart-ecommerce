import { CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SliderItem = ({ slide, index }: { slide: any; index: number }) => {
  return (
    <CarouselItem key={slide.id} className="pl-0 w-full shrink-0 relative">
      <div className="relative h-[280px] sm:h-[380px] md:h-[460px] lg:h-[540px]">
        <img
          src={slide.image}
          alt={slide.title.replace("\n", " ")}
          fetchPriority={index === 0 ? "high" : "auto"}
          loading={index === 0 ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
        {/* content */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg">
              <span className="inline-block rounded-full bg-secondary px-4 py-1 text-xs sm:text-sm font-semibold text-secondary-foreground mb-3 sm:mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {slide.subtitle}
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight whitespace-pre-line animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                {slide.title}
              </h1>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                {slide.description}
              </p>

              <div className="mt-4 sm:mt-6 flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6 sm:px-8 rounded-full shadow-lg"
                >
                  <Link to={slide.cta.href}>{slide.cta.label}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-primary hover:text-primary-foreground rounded-full hidden sm:inline-flex"
                >
                  <Link to="/categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CarouselItem>
  );
};

export default SliderItem;
