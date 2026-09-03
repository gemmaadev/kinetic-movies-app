import { HeroSection } from "@/shared/components/HeroSection";
import { PrimaryLinkButton } from "@/shared/components/buttons/PrimaryLinkButton";
import background from "@/shared/assets/404-background.webp";
export default function NotFoundPage() {
  return (
    <HeroSection
      backgroundImage={background}
      className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center md:items-start md:px-28 md:text-left"
    >
      <h1 className="text-brand-blue text-3xl font-bold md:text-6xl">
        Error 404
      </h1>
      <div className="flex flex-col gap-4">
        <blockquote className="text-2xl font-bold italic md:text-4xl">
          “Houston, tenemos un problema.”
          <cite className="block text-sm not-italic md:text-xl">
            — <span className="font-medium">Apollo 13</span>
          </cite>
        </blockquote>

        <p className="hidden text-xl md:block">
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
