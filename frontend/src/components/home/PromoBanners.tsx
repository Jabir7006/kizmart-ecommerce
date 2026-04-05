import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePromoBanners } from "@/hooks/useBanner";
import { getResponsiveImageUrl } from "@/lib/getImageUrl";
import bannerFallback from "@/assets/banner-fallback.svg";
import SectionHeader from "./SectionHeader";
import type { Banner } from "@/types/bannerType";

// ─── Single promo card ────────────────────────────────────────────────────────
const PromoCard = ({
  banner,
  index,
  aspectClass,
}: {
  banner: Banner;
  index: number;
  aspectClass: string;
}) => {
  const smallSrc = getResponsiveImageUrl(banner.image, 320, bannerFallback);
  const mobileSrc = getResponsiveImageUrl(banner.image, 480, bannerFallback);
  const fullSrc = getResponsiveImageUrl(banner.image, 960, bannerFallback);

  const img = (
    <div
      className={`relative overflow-hidden rounded-xl bg-muted ${aspectClass}`}
    >
      <img
        srcSet={`${smallSrc} 320w, ${mobileSrc} 480w, ${fullSrc} 960w`}
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        src={mobileSrc}
        alt={banner.image?.altText || "Promo banner"}
        width={480}
        height={360}
        loading={index < 2 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "auto"}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = bannerFallback;
        }}
      />
    </div>
  );

  return banner.link ? (
    <Link
      to={banner.link}
      className="group shrink-0 w-[80vw] sm:w-[45vw] lg:w-[calc(33.333%-12px)] snap-start block"
      aria-label={banner.image?.altText || "View offer"}
    >
      {img}
    </Link>
  ) : (
    <div className="shrink-0 w-[80vw] sm:w-[45vw] lg:w-[calc(33.333%-12px)] snap-start">
      {img}
    </div>
  );
};

// ─── Skeleton shown while loading ─────────────────────────────────────────────
const PromoSkeleton = ({ aspectClass }: { aspectClass: string }) => (
  <div className="flex gap-4 overflow-hidden">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`shrink-0 w-[80vw] sm:w-[45vw] lg:w-[calc(33.333%-12px)] ${aspectClass} rounded-xl bg-muted animate-pulse`}
      />
    ))}
  </div>
);

// ─── Main section ─────────────────────────────────────────────────────────────
interface PromoBannersProps {
  type?: "promo" | "offer";
  title: string;
  subtitle?: string;
  aspectClass?: string;
}

const PromoBanners = ({
  type = "promo",
  title,
  subtitle,
  aspectClass,
}: PromoBannersProps) => {
  const { data: banners, isLoading } = usePromoBanners(type);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Default: wide landscape for promo, taller 4:3 for offer
  const resolvedAspect =
    aspectClass ?? (type === "promo" ? "aspect-video" : "aspect-4/3");

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a, div:not(.flex)")?.clientWidth ?? 320;
    el.scrollBy({
      left: dir === "left" ? -cardWidth - 16 : cardWidth + 16,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <SectionHeader title={title} subtitle={subtitle} />
        <PromoSkeleton aspectClass={resolvedAspect} />
      </section>
    );
  }

  if (!banners || banners.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        linkText="View All"
        linkHref="/store"
      />

      <div className="relative group/rail">
        {/* Scroll rail */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {banners.map((banner, i) => (
            <PromoCard
              key={banner._id}
              banner={banner}
              index={i}
              aspectClass={resolvedAspect}
            />
          ))}
        </div>

        {/* Prev / Next nav — responsive: mobile shows at >1, tablet >2, desktop >3 */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className={`
                absolute -left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-10
                flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center
                rounded-full bg-card border border-border shadow-md text-foreground
                transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer
                sm:opacity-0 sm:group-hover/rail:opacity-100
                ${banners.length <= 2 ? "sm:hidden" : ""}
                ${banners.length <= 3 ? "lg:hidden" : ""}
              `}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className={`
                absolute -right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-10
                flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center
                rounded-full bg-card border border-border shadow-md text-foreground
                transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer
                sm:opacity-0 sm:group-hover/rail:opacity-100
                ${banners.length <= 2 ? "sm:hidden" : ""}
                ${banners.length <= 3 ? "lg:hidden" : ""}
              `}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default PromoBanners;
