import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-1.5 shrink-0 min-w-0">
      {/* Inline SVG — zero KB, crisp at any size */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="var(--color-primary)"
          strokeWidth="5"
        />
        {/* Vertical stem of K */}
        <rect x="30" y="28" width="9" height="44" fill="var(--color-primary)" />
        {/* Diagonal arms of K */}
        <path
          d="M39 50 L67 28 L67 34 L47 50 L67 66 L67 72 L39 50 Z"
          fill="var(--color-primary)"
        />
      </svg>

      {/* Hidden on phones */}
      <span className="hidden xs:inline text-xl font-bold text-foreground tracking-tight">
        Kizmart
      </span>
    </Link>
  );
};

export default Logo;
