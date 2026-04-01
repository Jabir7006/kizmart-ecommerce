import { Link } from "react-router-dom";
import { useBrand } from "@/hooks/useBrand";
import { getImageUrl } from "@/lib/getImageUrl";
import SectionHeader from "./SectionHeader";
import type { Brand } from "@/types/brandType";

const BrandSkeleton = () => (
  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="aspect-square w-full rounded-xl bg-muted animate-pulse border border-border/50"
      />
    ))}
  </div>
);

const BrandCard = ({ brand }: { brand: Brand }) => {
  const hasLogo = !!brand.logo?.secureUrl;
  const logoSrc = getImageUrl(brand.logo, "mobile");

  return (
    <Link
      to={`/store?brand=${brand.slug}`}
      className="group flex aspect-square flex-col items-center justify-center rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-md hover:border-primary/20"
      title={brand.title}
    >
      {hasLogo ? (
        <img
          src={logoSrc}
          alt={brand.logo?.altText || brand.title}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <span className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest wrap-break-word flex items-center justify-center h-full group-hover:text-primary transition-colors">
          {brand.title}
        </span>
      )}
    </Link>
  );
};

const BrandGrid = () => {
  const { brands, brandsQuery } = useBrand();

  if (brandsQuery.isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <SectionHeader title="Shop by Brand" />
        <BrandSkeleton />
      </section>
    );
  }

  if (!brands || brands.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <SectionHeader
        title="Shop by Brand"
        subtitle="Only the best brands for you"
        linkText="View All"
        linkHref="/store"
      />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:gap-4">
        {brands.map((brand: Brand) => (
          <BrandCard key={brand._id} brand={brand} />
        ))}
      </div>
    </section>
  );
};

export default BrandGrid;
