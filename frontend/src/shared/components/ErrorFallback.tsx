import logo from "@/shared/assets/logo.png";
import content from "@/shared/config/content.json";

export function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-kinetic-bg text-white">
      <img src={logo} alt="Kinetic" width={172} height={52} className="h-13" />
      <h1 className="text-4xl font-bold">{content.errors.genericErrorTitle}</h1>
      <p className="text-slate-400">{content.errors.genericErrorDescription}</p>
      <a href="/" className="text-brand-blue underline hover:text-brand-teal">
        {content.errors.backHome}
      </a>
    </div>
  );
}
