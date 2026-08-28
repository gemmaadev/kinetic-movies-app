import logo from "@/shared/assets/logo.png";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router";
import { useLogout } from "@/features/auth/hooks/useLogout";

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

  const accountLinks = [
    { to: "/perfil", label: "Mi perfil" },
    { to: "/login", label: "Cerrar sesión", onClick: logout },
  ];

  const footerColumns = [
    { title: "DESCUBRIR", links: discoverLinks },
    { title: "CUENTA", links: accountLinks },
    { title: "LEGAL", links: legalLinks },
  ];

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

        {footerColumns.map((column) => (
          <FooterColumn
            key={column.title}
            title={column.title}
            links={column.links}
          />
        ))}

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
    </>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string; onClick?: () => void }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-bold">{title}</h4>
      <ul className="flex flex-col gap-2">
        {links.map(({ to, label, onClick }) => (
          <li key={to}>
            <Link
              to={to}
              onClick={onClick}
              className="text-secondary-text hover:text-brand-teal"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
