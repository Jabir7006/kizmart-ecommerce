import { useEffect, useRef, useState, type ReactNode } from "react";

interface DeferredSectionProps {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
  className?: string;
}

const DEFAULT_ROOT_MARGIN = "600px 0px";

const DeferredSection = ({
  children,
  minHeight,
  rootMargin = DEFAULT_ROOT_MARGIN,
  className,
}: DeferredSectionProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={minHeight ? { minHeight } : undefined}
    >
      {shouldRender ? children : null}
    </div>
  );
};

export default DeferredSection;
