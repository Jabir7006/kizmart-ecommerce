import { lazy, Suspense } from "react";
import HeroSlider from "@/components/home/carousel/HeroSlider";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewsletterBanner from "@/components/home/NewsletterBanner";
import DeferredSection from "@/components/home/DeferredSection";
import { useProductStore } from "@/store/useProductStore";

const BrandGrid = lazy(() => import("@/components/home/BrandGrid"));
const FeaturedProducts = lazy(
  () => import("@/components/home/FeaturedProducts"),
);
const PromoBanners = lazy(() => import("@/components/home/PromoBanners"));
const NewArrivalsSection = lazy(
  () => import("@/components/home/NewArrivalsSection"),
);
const QuickViewDialog = lazy(() => import("@/components/product/QuickViewDialog"));

const sectionSkeleton = (height: number) => (
  <div
    className="max-w-7xl mx-auto px-4 py-8 sm:py-10"
    aria-hidden="true"
  >
    <div className="h-8 w-48 rounded bg-muted animate-pulse" />
    <div
      className="mt-4 rounded-2xl bg-muted animate-pulse"
      style={{ minHeight: height }}
    />
  </div>
);

const Home = () => {
  const selectedProduct = useProductStore((state) => state.selectedProduct);

  return (
    <>
      {/* Hero Banner Carousel */}
      <HeroSlider />

      {/* Trust / Service Highlights */}
      <ServiceFeatures />

      {/* Featured Categories */}
      <CategoryGrid />

      {/* Featured Products */}
      <DeferredSection minHeight={640}>
        <Suspense fallback={sectionSkeleton(640)}>
          <FeaturedProducts />
        </Suspense>
      </DeferredSection>

      {/* Promo Banners — exclusive collections */}
      <DeferredSection minHeight={240}>
        <Suspense fallback={sectionSkeleton(240)}>
          <PromoBanners
            type="promo"
            title="Exclusive Collections"
            subtitle="Curated picks from top collections"
          />
        </Suspense>
      </DeferredSection>

      {/* New Arrivals */}
      <DeferredSection minHeight={520}>
        <Suspense fallback={sectionSkeleton(520)}>
          <NewArrivalsSection />
        </Suspense>
      </DeferredSection>

      {/* Shop by Brand */}
      <DeferredSection minHeight={280}>
        <Suspense fallback={sectionSkeleton(280)}>
          <BrandGrid />
        </Suspense>
      </DeferredSection>

      {/* Offer Banners — unlimited offers */}
      <DeferredSection minHeight={280}>
        <Suspense fallback={sectionSkeleton(280)}>
          <PromoBanners
            type="offer"
            title="Unlimited Offers"
            subtitle="Don't miss out on these limited-time deals"
          />
        </Suspense>
      </DeferredSection>

      {/* Newsletter CTA */}
      <NewsletterBanner />

      {selectedProduct ? (
        <Suspense fallback={null}>
          <QuickViewDialog />
        </Suspense>
      ) : null}
    </>
  );
};

export default Home;
