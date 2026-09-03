import type { ReactNode } from "react";
import backgroundImage from "@/shared/assets/background-login-register.webp";

interface AuthPageLayoutProps {
  children: ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div
        className="hidden bg-cover bg-center md:block"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="flex items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
