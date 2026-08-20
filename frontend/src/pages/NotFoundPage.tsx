import { PrimaryLinkButton } from "@/shared/components/buttons/PrimaryLinkButton";
import background from "@/shared/assets/404-background.png";

export default function NotFoundPage() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="fixed inset-0 -z-10 bg-bg-night/80" />

      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center md:items-start md:text-left px-10">
        <h1 className="text-brand-blue font-bold text-6xl">Error 404</h1>
        <div className="flex flex-col gap-4">
          <h4 className="text-3xl font-bold">Houston, tenemos un problema</h4>
          <p className="text-xl">
            Lo sentimos, la página que buscas no existe
            <br />o ha sido movida.
          </p>
          <PrimaryLinkButton to="/" className="self-center md:self-start">
            Volver al inicio
          </PrimaryLinkButton>
        </div>
      </div>
    </>
  );
}
