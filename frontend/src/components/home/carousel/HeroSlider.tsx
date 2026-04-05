import { lazy, Suspense, useEffect, useState } from "react";
import { useBanner } from "@/hooks/useBanner";
import type { Banner } from "@/types/bannerType";
import { getResponsiveImageUrl } from "@/lib/getImageUrl";
import bannerFallback from "@/assets/banner-fallback.svg";

const HeroCarousel = lazy(() => import("./HeroCarousel"));

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

const StaticHeroBanner = ({ banner }: { banner: Banner }) => {
  const smallSrc = getResponsiveImageUrl(banner.image, 480, bannerFallback);
  const mobileSrc = getResponsiveImageUrl(banner.image, 768, bannerFallback);
  const fullSrc = getResponsiveImageUrl(banner.image, 1280, bannerFallback);

  return (
    <section className="relative w-full overflow-hidden bg-primary/5">
      <div className="relative w-full aspect-video sm:aspect-16/7 lg:aspect-21/7">
        <img
          srcSet={`${smallSrc} 480w, ${mobileSrc} 768w, ${fullSrc} 1280w`}
          sizes="100vw"
          src={mobileSrc}
          alt={banner.image?.altText || "Banner"}
          width={1920}
          height={640}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = bannerFallback;
          }}
        />
      </div>
    </section>
  );
};

/* ── Main slider ─────────────────────────────────────────────────────────── */
const HeroSlider = () => {
  const [carouselReady, setCarouselReady] = useState(false);
  const { banners, bannersQuery } = useBanner({
    type: "banner",
    status: "active",
  });

  const activeBanners: Banner[] = banners.filter(
    (b: Banner) => b.status === "active" && b.type === "banner",
  );

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const idleCallback = window.requestIdleCallback?.(
      () => setCarouselReady(true),
      { timeout: 1500 },
    );

    if (idleCallback) {
      return () => window.cancelIdleCallback?.(idleCallback);
    }

    const timeoutId = window.setTimeout(() => setCarouselReady(true), 600);
    return () => window.clearTimeout(timeoutId);
  }, [activeBanners.length]);

  if (bannersQuery.isLoading) return <HeroSkeleton />;
  if (activeBanners.length === 0) return <HeroEmpty />;
  if (activeBanners.length === 1) {
    return <StaticHeroBanner banner={activeBanners[0]} />;
  }

  return (
    <Suspense fallback={<StaticHeroBanner banner={activeBanners[0]} />}>
      {carouselReady ? (
        <HeroCarousel banners={activeBanners} />
      ) : (
        <StaticHeroBanner banner={activeBanners[0]} />
      )}
    </Suspense>
  );
};

export default HeroSlider;
