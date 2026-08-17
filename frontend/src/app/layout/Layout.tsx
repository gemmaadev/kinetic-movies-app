import { NavLink, Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-slate-900 px-4 py-3">
        <span>Kinetic</span>

        <nav className="flex gap-5">
          <NavLink
            to={"/"}
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Inicio
          </NavLink>
          <NavLink
            to={"/explorar"}
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Explorar
          </NavLink>
          <NavLink
            to={"/ranking"}
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Ranking
          </NavLink>
          <NavLink
            to={"/favoritos"}
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Favoritas
          </NavLink>
          <NavLink
            to={"/perfil"}
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Perfil
          </NavLink>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-slate-900 px-4 py-6">
        © 2026 Kinetic. Todos los derechos reservados.
      </footer>
    </div>
  );
}
