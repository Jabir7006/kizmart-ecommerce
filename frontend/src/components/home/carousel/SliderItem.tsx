import { CarouselItem } from "@/components/ui/carousel";
import { getImageUrl } from "@/lib/getImageUrl";
import type { Banner } from "@/types/bannerType";
import bannerFallback from "@/assets/banner-fallback.svg";
import { Link } from "react-router-dom";

interface SliderItemProps {
  banner: Banner;
  index: number;
}

const SliderItem = ({ banner, index }: SliderItemProps) => {
  const mobileSrc = getImageUrl(banner.image, "mobile", bannerFallback);
  const fullSrc = getImageUrl(banner.image, "full", bannerFallback);

  const content = (
    <div className="relative w-full aspect-video sm:aspect-16/7 lg:aspect-21/7">
      <img
        srcSet={`${mobileSrc} 768w, ${fullSrc} 1920w`}
        sizes="100vw"
        src={fullSrc}
        alt={banner.image?.altText || "Banner"}
        width={1920}
        height={640}
        fetchPriority={index === 0 ? "high" : "auto"}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = bannerFallback;
        }}
      />
      {/* Bottom gradient for dot/arrow contrast */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/30 to-transparent pointer-events-none" />
    </div>
  );

  return (
    <CarouselItem className="pl-0 w-full shrink-0 relative">
      {/* Wrap in link if banner has a destination */}
      {banner.link ? (
        <Link
          to={banner.link}
          className="block"
          aria-label={banner.image?.altText || "View banner"}
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </CarouselItem>
  );
};

export default SliderItem;
