import { Link } from "react-router-dom";
import { useCategory } from "@/hooks/useCategory";
import { getImageUrl } from "@/lib/getImageUrl";
import SectionHeader from "./SectionHeader";
import type { Category } from "@/types/categoryType";

/* ── Skeleton shown while categories load ─────────────────────────────────── */
const CategorySkeleton = () => (
  <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-2.5 shrink-0 w-24 sm:w-28 md:w-32 lg:w-36 snap-start">
        <div className="aspect-square w-full rounded-xl bg-muted animate-pulse" />
        <div className="h-3 w-16 rounded bg-muted animate-pulse" />
      </div>
    ))}
  </div>
);

/* ── Gradient placeholder when a category has no thumbnail ────────────────── */
const PLACEHOLDER_GRADIENTS = [
  "from-teal-100 to-teal-200",
  "from-amber-100 to-amber-200",
  "from-rose-100 to-rose-200",
  "from-violet-100 to-violet-200",
  "from-sky-100 to-sky-200",
  "from-emerald-100 to-emerald-200",
] as const;

const CategoryCard = ({
  category,
  index,
}: {
  category: Category;
  index: number;
}) => {
  const hasThumbnail = !!category.thumbnail?.secureUrl;
  const imgSrc = getImageUrl(category.thumbnail, "thumbnail");
  const gradient =
    PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

  return (
    <Link
      to={`/store?category=${category.slug}`}
      className="group flex flex-col items-center gap-2.5 shrink-0 w-24 sm:w-28 md:w-32 lg:w-36 snap-start"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-md">
        {hasThumbnail ? (
          <img
            src={imgSrc}
            alt={category.thumbnail?.altText || category.title}
            width={200}
            height={200}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradient}`}
          >
            <span className="text-2xl sm:text-3xl font-bold text-foreground/25">
              {category.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5 rounded-xl" />
      </div>

      <span className="text-xs sm:text-sm font-medium text-foreground/80 text-center line-clamp-1 transition-colors group-hover:text-primary">
        {category.title}
      </span>
    </Link>
  );
};

/* ── Main grid ────────────────────────────────────────────────────────────── */
const CategoryGrid = () => {
  const { categories, categoriesQuery } = useCategory();

  if (categoriesQuery.isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <SectionHeader title="Shop by Category" />
        <CategorySkeleton />
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <SectionHeader
        title="Shop by Category"
        subtitle="Find what you need across our collections"
        linkText="View All"
        linkHref="/store"
      />

      <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((category: Category, index: number) => (
          <CategoryCard key={category._id} category={category} index={index} />
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
