import { createBrowserRouter } from "react-router";
import AuthLayout from "@/app/layout/AuthLayout";
import Layout from "@/app/layout/Layout";
import { ErrorFallback } from "@/shared/components/ErrorFallback";

import HomePage from "@/pages/HomePage";
import ExplorePage from "@/pages/ExplorePage";
import MovieDetailPage from "@/pages/MovieDetailPage";
import ActorDetailPage from "@/pages/ActorDetailPage";
import DirectorDetailPage from "@/pages/DirectorDetailPage";
import RankingPage from "@/pages/RankingPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ProfilePage from "@/pages/ProfilePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

export const router = createBrowserRouter([
  {
    errorElement: <ErrorFallback />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", Component: LoginPage },
          { path: "/registro", Component: RegisterPage },
          { path: "/recuperar-contrasena", Component: ForgotPasswordPage },
        ],
      },
      {
        element: <Layout />,
        children: [
          { index: true, Component: HomePage },
          { path: "/explorar", Component: ExplorePage },
          { path: "/pelicula/:id", Component: MovieDetailPage },
          { path: "/actor/:id", Component: ActorDetailPage },
          { path: "/director/:id", Component: DirectorDetailPage },
          { path: "/ranking", Component: RankingPage },
          { path: "/favoritos", Component: FavoritesPage },
          { path: "/perfil", Component: ProfilePage },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);
