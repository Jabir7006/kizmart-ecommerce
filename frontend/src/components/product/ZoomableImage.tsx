import { cn } from "@/lib/utils";
import React, { useState } from "react";

const ZoomableImage = ({ src, alt }: { src: string; alt: string }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="w-full flex items-center justify-center overflow-hidden cursor-zoom-in rounded-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isHovering ? "scale(2)" : "scale(1)",
        }}
        className={cn(
          "w-full h-auto object-contain max-h-[250px] sm:max-h-[350px] md:max-h-[450px] mix-blend-multiply",
          !isHovering && "transition-transform duration-500",
        )}
      />
    </div>
  );
};

export default ZoomableImage;
