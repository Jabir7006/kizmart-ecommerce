import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
}

const SectionHeader = ({
  title,
  subtitle,
  linkText,
  linkHref,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {linkText && linkHref && (
        <Link
          to={linkHref}
          className="group/link flex items-center gap-1 text-sm font-medium text-primary whitespace-nowrap transition-colors hover:text-primary/80"
        >
          {linkText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
