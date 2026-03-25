// KizmartLogo.jsx
import React from "react";

const KizmartLogo = ({ className = "w-10 h-10 md:w-12 md:h-12" }) => {
  return (
    <a href="/" className="inline-flex items-center space-x-2 flex-shrink-0">
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle accent */}
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="currentColor"
          strokeWidth="4"
          className="text-accent"
        />

        {/* Vertical stem of K */}
        <rect x="30" y="30" width="8" height="40" className="text-primary" />
        {/* Diagonal arms */}
        <path
          d="M38 50 L65 30 L65 35 L45 50 L65 65 L65 70 L38 50 Z"
          fill="currentColor"
          className="text-primary"
        />
      </svg>

      <span className="text-2xl md:text-3xl font-bold text-primary-foreground truncate max-w-full">
        Kizmart
      </span>
    </a>
  );
};

export default KizmartLogo;
