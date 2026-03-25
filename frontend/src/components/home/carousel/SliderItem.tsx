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
    <div className="relative h-[280px] sm:h-[380px] md:h-[460px] lg:h-[540px]">
      <img
        srcSet={`${mobileSrc} 768w, ${fullSrc} 1920w`}
        sizes="100vw"
        src={fullSrc}
        alt={banner.image?.altText || "Banner"}
        width={1920}
        height={540}
        fetchPriority={index === 0 ? "high" : "auto"}
        loading={index === 0 ? "eager" : "lazy"}
        className="absolute inset-0 w-full h-full object-cover object-top"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = bannerFallback;
        }}
      />
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
