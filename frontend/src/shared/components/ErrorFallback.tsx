import logo from "@/shared/assets/logo.png";

export default function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-kinetic-bg text-white">
      <img src={logo} alt="Kinetic" className="h-13" />
      <h1 className="text-4xl font-bold">Algo ha ido mal</h1>
      <p className="text-slate-400">Ha ocurrido un error inesperado.</p>
      <a href="/" className="text-brand-teal underline hover:text-brand-blue">
        Volver al inicio
      </a>
    </div>
  );
}
