import { Link, NavLink } from "react-router";
import logo from "@/shared/assets/logo.png";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/explorar", label: "Explorar" },
  { to: "/ranking", label: "Ranking" },
  { to: "/favoritos", label: "Favoritas" },
  { to: "/perfil", label: "Perfil" },
];

export default function NavBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <Link to="/">
        <img src={logo} alt="Kinetic logo" className="h-11 cursor-pointer" />
      </Link>

      <nav className="hidden md:flex gap-10">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? "font-bold text-brand-blue" : "hover:text-brand-teal"
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-6">
          {isSearchOpen ? (
            <div className="flex items-center gap-2">
              <input
                type="search"
                placeholder="Buscar películas, actores..."
                autoFocus
                className="w-56 rounded-md bg-bg-surface px-2 py-1.5 text-primary-text"
              />
              <button
                aria-label="Cerrar búsqueda"
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button aria-label="Buscar" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
            </button>
          )}

          {/* Placeholder, connects when useAuth() exists */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-slate-700" />
            <span>Usuario</span>
          </div>
        </div>

        {/* Hamburger button: visible only on mobile */}
        <button
          className="md:hidden"
          aria-label="Abrir menú"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-bg-night md:hidden">
          <div className="flex justify-end p-4">
            <button
              aria-label="Cerrar menú"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col items-center gap-8 text-2xl">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "font-bold text-brand-blue" : ""
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
