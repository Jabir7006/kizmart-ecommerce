import { cn } from "@/lib/utils";
import React, { useState } from "react";
import type { Image } from "@/types/productType";
import { getImageUrl } from "@/lib/getImageUrl";

interface ZoomableImageProps {
  image: Image;
  alt: string;
}

const ZoomableImage = ({ image, alt }: ZoomableImageProps) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const mobileSrc = getImageUrl(image, "mobile");
  const fullSrc = getImageUrl(image, "full");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-in rounded-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        srcSet={`${mobileSrc} 800w, ${fullSrc} 1200w`}
        sizes="(max-width: 640px) 100vw, 50vw"
        src={fullSrc}
        alt={alt}
        width={800}
        height={800}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isHovering ? "scale(2)" : "scale(1)",
        }}
        className={cn(
          "w-full h-full object-contain mix-blend-multiply",
          !isHovering && "transition-transform duration-500",
        )}
      />
    </div>
  );
};

export default ZoomableImage;
