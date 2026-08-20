import { Footer } from "@/shared/components/layout/Footer";
import NavBar from "@/shared/components/layout/NavBar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-kinetic-bg border-b border-b-gray-800 px-4 py-6 text-primary-text">
        <NavBar />
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className=" bg-kinetic-bg border-t border-t-gray-800 px-4 py-11 text-primary-text">
        <Footer />
      </footer>
    </div>
  );
}
