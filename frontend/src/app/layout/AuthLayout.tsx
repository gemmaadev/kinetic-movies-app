import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div>
      <header>
        <span>Logo Kinetic</span>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
