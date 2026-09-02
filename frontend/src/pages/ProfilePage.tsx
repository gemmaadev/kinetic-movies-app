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
  Clapperboard,
  Star,
  TrendingUp,
} from "lucide-react";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { LogoutConfirmModal } from "@/features/auth/components/LogoutConfirmModal";
import { useFavoritesList } from "@/features/favorites/hooks/useFavoritesList";
import { useMyRanking } from "@/features/stats/hooks/useMyRanking";
import type { FavoriteMovie } from "@/features/favorites/types/favorite.types";
import type { MyRankedMovie } from "@/features/stats/types/ranking.types";

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
  const { favorites } = useFavoritesList();
  const { myRanking } = useMyRanking();

  const stats = [
    {
      icon: Clapperboard,
      value: String(calculateWatchedCount(favorites, myRanking)),
      label: "Películas vistas",
    },
    { icon: Heart, value: String(favorites.length), label: "Favoritas" },
    { icon: Star, value: String(myRanking.length), label: "Puntuadas" },
    {
      icon: TrendingUp,
      value: calculateAverageRating(myRanking),
      label: "Puntuación media",
    },
  ];

  if (isLoading) return <p className="p-6">Cargando...</p>;
  if (error)
    return (
      <p className="p-6 text-error">
        Ha ocurrido un error. Inténtalo de nuevo más tarde.
      </p>
    );

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

        <nav
          aria-label="Menú del perfil"
          className={`${isSidebarOpen ? "block" : "hidden"} md:block`}
        >
          <ul className="flex flex-col gap-2 px-4 pb-4 md:gap-5 md:p-4">
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
        </nav>
      </aside>

      <main className="flex flex-col gap-10 p-10">
        <section className="flex flex-col gap-10">
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
              <h2 className="text-2xl font-black">{profile?.name}</h2>
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
        </section>

        <section
          aria-label="Estadísticas"
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-lg border border-bg-surface p-6 text-center"
              >
                <Icon size={24} className="text-brand-teal" />
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-secondary-text">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Actividad reciente</h2>
          <p className="text-secondary-text">
            Aquí verás tu actividad reciente próximamente.
          </p>
        </section>
      </main>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
      />
    </div>
  );
}

function calculateAverageRating(ranking: MyRankedMovie[]): string {
  if (ranking.length === 0) return "—";
  const sum = ranking.reduce(
    (total, movie) => total + (movie.userRating ?? 0),
    0,
  );
  return (sum / ranking.length).toFixed(1);
}

// NOTE: "Películas vistas" is an approximation (favorites ∪ rated),
// not a real "watched" concept in the DB. Implementing it properly
// would require a watched: Boolean field on UserMovie, with its own
// endpoint/button — left as a possible future feature.
function calculateWatchedCount(
  favorites: FavoriteMovie[],
  ranking: MyRankedMovie[],
): number {
  return new Set([...favorites.map((m) => m.id), ...ranking.map((m) => m.id)])
    .size;
}
