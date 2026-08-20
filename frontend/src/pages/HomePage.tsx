import { HeroSection } from "@/shared/components/HeroSection";
import { PrimaryLinkButton } from "@/shared/components/buttons/PrimaryLinkButton";
import heroBackground from "@/shared/assets/hero-background.png";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <HeroSection
        backgroundImage={heroBackground}
        className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center md:items-start md:px-16 md:text-left"
      >
        <div className="flex flex-col items-center gap-7 md:items-start">
          <h1 className="text-primary-text text-5xl font-bold md:text-7xl">
            El cine que te <br />
            <span className="text-brand-blue">mueve</span>
          </h1>
          <p className="text-lg md:text-xl">
            Descubre películas increíbles, <br />
            guarda tus favoritas y crea <br />
            tu propio universo cinematográfico.
          </p>
          <PrimaryLinkButton to="/explorar">
            Explorar películas
          </PrimaryLinkButton>
        </div>
      </HeroSection>
    </div>
  );
}
