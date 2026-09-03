import { Link, NavLink } from "react-router";
import logo from "@/shared/assets/logo.webp";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

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
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between">
      <Link to="/">
        <img
          src={logo}
          alt="Kinetic logo"
          width={128}
          height={39}
          className="h-11 cursor-pointer"
        />
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

          <Link
            to="/perfil"
            className="flex items-center gap-2 hover:opacity-80"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? "Usuario"}
                referrerPolicy="no-referrer"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-bold">
                {user?.displayName?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <span>{user?.displayName ?? "Usuario"}</span>
          </Link>
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
