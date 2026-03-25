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
      <div className="bg-gray-50 flex items-center justify-center min-h-[300px] md:min-h-[500px] rounded-2xl w-full">
        <img
          src="/placeholder.svg"
          alt={title}
          className="w-full h-auto object-contain max-h-[400px] mix-blend-multiply"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Slider */}
      <div className="relative w-full bg-gray-50 rounded-2xl overflow-hidden group">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="flex items-center justify-center min-h-[300px] md:min-h-[500px] p-4 sm:p-8">
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
      </div>

      {/* Thumbnail Navigation */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 snap-center bg-gray-50",
                current === index
                  ? "border-orange-500 shadow-md ring-2 ring-orange-500/20"
                  : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={getImageUrl(image, "thumbnail")}
                alt={image.altText || `Thumbnail ${index + 1}`}
                className="w-full h-full object-contain p-2 mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
