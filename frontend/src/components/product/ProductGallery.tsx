import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { Image } from "@/types/productType";
import ZoomableImage from "./ZoomableImage";
import { getImageUrl } from "@/lib/getImageUrl";

interface ProductGalleryProps {
  thumbnail: Image;
  gallery?: Image[];
  title: string;
}

const ProductGallery = ({ thumbnail, gallery, title }: ProductGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Combine thumbnail and gallery into a single array
  const allImages = [thumbnail, ...(gallery || [])].filter(Boolean);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  if (allImages.length === 0) {
    return (
      <div className="bg-gray-50 flex items-center justify-center min-h-[220px] sm:min-h-[300px] md:min-h-[500px] sm:rounded-2xl w-full">
        <img
          src="/placeholder.svg"
          alt={title}
          className="w-full h-auto object-contain max-h-[400px] mix-blend-multiply"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-4 w-full">
      {/* Main Image Slider */}
      <div className="relative w-full bg-gray-50 sm:rounded-2xl overflow-hidden group">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="flex items-center justify-center min-h-[220px] sm:min-h-[300px] md:min-h-[500px] p-2 sm:p-4 md:p-8">
                  <ZoomableImage
                    image={image}
                    alt={image.altText || `${title} - Image ${index + 1}`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages.length > 1 && (
            <>
              <div className="hidden group-hover:block transition-opacity duration-300">
                <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-gray-800 border-none shadow-md h-10 w-10" />
                <CarouselNext className="right-4 bg-white/80 hover:bg-white text-gray-800 border-none shadow-md h-10 w-10" />
              </div>
            </>
          )}
        </Carousel>

        {/* Image count badge */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-sm">
            {current + 1}/{allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation — visible on all screen sizes */}
      {allImages.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 scrollbar-hide snap-x px-2 sm:px-0">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "relative shrink-0 w-14 h-14 sm:w-24 sm:h-24 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-200 snap-center bg-gray-50",
                current === index
                  ? "border-orange-500 shadow-md ring-1 sm:ring-2 ring-orange-500/20"
                  : "border-transparent hover:border-gray-300 opacity-60 hover:opacity-100",
              )}
            >
              <img
                src={getImageUrl(image, "thumbnail")}
                alt={image.altText || `Thumbnail ${index + 1}`}
                className="w-full h-full object-contain p-1 sm:p-2 mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
