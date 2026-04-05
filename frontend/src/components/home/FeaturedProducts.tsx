import { Link } from "react-router-dom";
import { useFeaturedProducts } from "@/hooks/useProduct";
import SectionHeader from "./SectionHeader";
import { getResponsiveImageUrl } from "@/lib/getImageUrl";
import { getProductPricing } from "@/lib/productPricing";
import placeholderSvg from "@/assets/product-placeholder.svg";
import type { Product } from "@/types/productType";

const FeaturedCard = ({
  product,
  isLarge = false,
}: {
  product: Product;
  isLarge?: boolean;
}) => {
  const smallSrc = getResponsiveImageUrl(product.thumbnail, 240, placeholderSvg);
  const mediumSrc = getResponsiveImageUrl(
    product.thumbnail,
    isLarge ? 800 : 400,
    placeholderSvg,
  );
  const largeSrc = getResponsiveImageUrl(
    product.thumbnail,
    isLarge ? 1200 : 600,
    placeholderSvg,
  );
  const { badge, discountPercentage, displayPrice, originalPrice } =
    getProductPricing({
      price: product.price,
      salePrice: product.salePrice,
    });

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group relative overflow-hidden rounded-2xl bg-muted outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
      }`}
    >
      <img
        srcSet={`${smallSrc} 240w, ${mediumSrc} ${isLarge ? 800 : 400}w, ${largeSrc} ${isLarge ? 1200 : 600}w`}
        sizes={
          isLarge
            ? "(max-width: 640px) 92vw, (max-width: 1024px) 60vw, 40vw"
            : "(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 20vw"
        }
        src={mediumSrc}
        alt={product.thumbnail?.altText || product.title}
        width={isLarge ? 800 : 400}
        height={isLarge ? 800 : 400}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black" />

      {/* Content wrapper */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6 flex flex-col justify-end">
        <div className="mb-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white ${
              badge === "Sale" ? "bg-rose-600/90" : "bg-purple-900/85"
            }`}
          >
            {badge}
          </span>
        </div>
        {product.brand?.title && (
          <span className="mb-1 sm:mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/80 drop-shadow-md">
            {product.brand.title}
          </span>
        )}
        <h3
          className={`font-semibold text-white line-clamp-2 leading-tight drop-shadow-md ${
            isLarge
              ? "text-lg sm:text-2xl lg:text-3xl mb-1 sm:mb-2"
              : "text-sm sm:text-base mb-1"
          }`}
        >
          {product.title}
        </h3>
        <div>
          <p
            className={`text-white font-bold drop-shadow-md ${isLarge ? "text-lg sm:text-xl" : "text-sm sm:text-base"}`}
          >
            ৳{displayPrice.toLocaleString()}
          </p>
          {discountPercentage !== null && originalPrice !== null && (
            <p className="mt-1 text-xs text-white/80 drop-shadow-md">
              <span className="line-through">
                ৳{originalPrice.toLocaleString()}
              </span>
              <span className="ml-2 font-semibold text-emerald-300">
                {discountPercentage}% OFF
              </span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

const FeaturedProductsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[160px] xs:auto-rows-[200px] sm:auto-rows-[250px] lg:auto-rows-[300px]">
      <div className="col-span-2 row-span-2 rounded-2xl bg-muted animate-pulse" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="col-span-1 row-span-1 rounded-2xl bg-muted animate-pulse"
        />
      ))}
    </div>
  );
};

const FeaturedProducts = () => {
  const { data: result, isLoading, isError } = useFeaturedProducts();
  const products = result?.data || [];

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <SectionHeader title="Featured Collections" />
        <FeaturedProductsSkeleton />
      </section>
    );
  }

  if (isError || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <SectionHeader
        title="Featured Collections"
        subtitle="Hand-picked products just for you"
        linkText="Shop All"
        linkHref="/store"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[160px] xs:auto-rows-[200px] sm:auto-rows-[250px] lg:auto-rows-[300px]">
        {products[0] && <FeaturedCard product={products[0]} isLarge={true} />}
        {products.slice(1, 5).map((product) => (
          <FeaturedCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
