import { Outlet, ScrollRestoration } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen">
      <ScrollRestoration />
      <Outlet />
    </div>
  );
}
