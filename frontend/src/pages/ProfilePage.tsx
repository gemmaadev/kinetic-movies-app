import { useState } from "react";
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

const sidebarLinks = [
  { icon: Home, label: "Resumen", active: true },
  { icon: Heart, label: "Favoritas", active: false },
  { icon: List, label: "Listas", active: false },
  { icon: Clock, label: "Actividad", active: false },
  { icon: Settings, label: "Ajustes", active: false },
  { icon: LogOut, label: "Cerrar sesión", active: false },
];

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            return (
              <li
                key={link.label}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                  link.active
                    ? "bg-brand-blue font-bold"
                    : "hover:bg-bg-surface"
                }`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className="p-6"></main>
    </div>
  );
}
