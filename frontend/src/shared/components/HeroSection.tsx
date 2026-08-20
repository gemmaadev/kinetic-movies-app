import type { ReactNode } from "react";

interface HeroSectionProps {
  backgroundImage?: string;
  overlay?: boolean;
  className?: string;
  children: ReactNode;
}

export function HeroSection({
  backgroundImage,
  overlay = true,
  className = "",
  children,
}: HeroSectionProps) {
  return (
    <section className={`relative ${className}`}>
      {backgroundImage && (
        <div
          className="absolute inset-0 overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-bg-night/70" />
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
