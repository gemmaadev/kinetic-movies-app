import { useState } from "react";
import { Link } from "react-router";
import {
  Home,
  Heart,
  List,
  Clock,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { LogoutConfirmModal } from "@/features/auth/components/LogoutConfirmModal";

const sidebarLinks = [
  { icon: Home, label: "Resumen", active: true, to: "/perfil" },
  { icon: Heart, label: "Favoritas", active: false, to: "/favoritos" },
  { icon: List, label: "Listas", active: false, to: null },
  { icon: Clock, label: "Actividad", active: false, to: null },
  { icon: Settings, label: "Ajustes", active: false, to: null },
];

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { profile, isLoading, error } = useProfile();
  const logout = useLogout();

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-error">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
      <aside className="border-b border-bg-surface md:min-h-screen md:border-b-0 md:border-r">
        <button
          className="flex w-full items-center justify-between p-4 md:hidden"
          onClick={() => setIsSidebarOpen((open) => !open)}
        >
          <span className="font-bold">Menú del perfil</span>
          {isSidebarOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        <ul
          className={`${
            isSidebarOpen ? "flex" : "hidden"
          } flex-col gap-2 px-4 pb-4 md:flex md:gap-5 md:p-4`}
        >
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const itemClassName = `flex items-center gap-3 rounded-lg px-4 py-3 ${
              link.active ? "bg-brand-blue font-bold" : "hover:bg-bg-surface"
            }`;

            if (link.to) {
              return (
                <li key={link.label}>
                  <Link to={link.to} className={itemClassName}>
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            }

            return (
              <li
                key={link.label}
                className={`${itemClassName} cursor-not-allowed opacity-50`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </li>
            );
          })}

          <li>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-bg-surface"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </li>
        </ul>
      </aside>

      <main className="p-10 flex flex-col gap-5">
        <h1 className="text-4xl font-bold">Resumen</h1>
        <div className="flex max-w-2xl flex-row gap-3">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue text-2xl font-bold">
              {profile?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <h2 className="font-black text-2xl">{profile?.name}</h2>
            <span>{profile?.email}</span>
            <span className="w-fit rounded-full border border-brand-blue px-3 py-1 text-sm text-brand-blue">
              Miembro desde{" "}
              {profile?.createdAt &&
                new Date(profile.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                })}
            </span>
          </div>
        </div>
      </main>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
      />
    </div>
  );
}
