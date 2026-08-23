import { HeroSection } from "@/shared/components/HeroSection";
import { PrimaryLinkButton } from "@/shared/components/buttons/PrimaryLinkButton";
import background from "@/shared/assets/404-background.png";

export default function NotFoundPage() {
  return (
    <HeroSection
      backgroundImage={background}
      className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center md:items-start md:text-left px-28"
    >
      <h1 className="text-brand-blue font-bold text-6xl">Error 404</h1>
      <div className="flex flex-col gap-4">
        <blockquote className="italic text-3xl font-bold">
          “Houston, tenemos un problema.”
          <cite className="block text-xl not-italic">
            — <span className="font-medium">Apollo 13</span>
          </cite>
        </blockquote>

        <p className="text-xl">
          Lo sentimos, la página que buscas no existe
          <br />o ha sido movida.
        </p>

        <PrimaryLinkButton to="/" className="self-center md:self-start">
          Volver al inicio
        </PrimaryLinkButton>
      </div>
    </HeroSection>
  );
}
