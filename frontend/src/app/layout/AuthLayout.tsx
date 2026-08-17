import { Outlet } from "react-router";
import logo from "@/shared/assets/logo.png";


export default function AuthLayout() {
  return (
    <div>
      <header>
         <img src={logo} alt="Kinetic" className="h-13"/>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

 