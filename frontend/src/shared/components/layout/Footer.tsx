import { useState } from "react";
import logo from "@/shared/assets/logo.png";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { LogoutConfirmModal } from "@/features/auth/components/LogoutConfirmModal";

const discoverLinks = [
  { to: "/", label: "Inicio" },
  { to: "/explorar", label: "Explorar" },
  { to: "/ranking", label: "Ranking" },
  { to: "/favoritos", label: "Favoritos" },
];

const legalLinks = [
  { to: "/terminos", label: "Términos y condiciones" },
  { to: "/privacidad", label: "Política de privacidad" },
  { to: "/cookies", label: "Política de cookies" },
];

const socialLinks = [
  { href: "#", label: "Instagram", Icon: FaInstagram },
  { href: "#", label: "Facebook", Icon: FaFacebookF },
  { href: "#", label: "Twitter/X", Icon: FaXTwitter },
];

export function Footer() {
  const logout = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5 pb-8">
        <div className="flex flex-col gap-3 md:col-span-2">
          <img src={logo} alt="Kinetic logo" className="w-32 cursor-pointer" />
          <p className="text-secondary-text text-sm">
            Tu plataforma personal para explorar, <br /> valorar y disfrutar del
            mejor cine. Todo el universo <br />
            de películas al alcance de tu mano.
          </p>
        </div>

        <FooterColumn title="DESCUBRIR" links={discoverLinks} />

        <nav aria-label="Cuenta" className="flex flex-col gap-3">
          <h4 className="font-bold">CUENTA</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/perfil"
                className="text-secondary-text hover:text-brand-teal"
              >
                Mi perfil
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-left text-secondary-text hover:text-brand-teal"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </nav>

        <FooterColumn title="LEGAL" links={legalLinks} />

        <div className="flex flex-col gap-3">
          <h4 className="font-bold">SÍGUENOS</h4>
          <div className="flex gap-4">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-secondary-text hover:text-brand-teal"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className=" border-t border-bg-surface pt-6">
        <span className="text-secondary-text text-sm">
          © 2026 Kinetic. Todos los derechos reservados.
        </span>
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
      />
    </>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <nav aria-label={title} className="flex flex-col gap-3">
      <h4 className="font-bold">{title}</h4>
      <ul className="flex flex-col gap-2">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className="text-secondary-text hover:text-brand-teal">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
