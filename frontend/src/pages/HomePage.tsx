import { HeroSection } from "@/shared/components/HeroSection";
import { PrimaryLinkButton } from "@/shared/components/buttons/PrimaryLinkButton";
import heroBackground from "@/shared/assets/hero-background.png";
import { Heart, Search, Star, User } from "lucide-react";
import { PageContainer } from "@/shared/components/PageContainer";
import { MovieCarousel } from "@/features/explore/components/MovieCarousel";
import { useTrending } from "@/features/explore/hooks/useTrending";
import { useNowPlaying } from "@/features/explore/hooks/useNowPlaying";

const features = [
  {
    Icon: Search,
    title: "Explora",
    description: "Miles de películas y series",
  },
  {
    Icon: Heart,
    title: "Guarda",
    description: "Tus favoritas siempre contigo",
  },
  {
    Icon: Star,
    title: "Puntúa",
    description: "Valora del 1 al 10 y crea tu ranking",
  },
  {
    Icon: User,
    title: "Tu espacio",
    description: "Todo tu mundo cinematográfico",
  },
];

export default function HomePage() {
  const trending = useTrending();
  const nowPlaying = useNowPlaying();

  return (
    <div className="flex flex-col gap-12">
      <HeroSection
        backgroundImage={heroBackground}
        className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center md:items-start md:px-16 md:text-left"
      >
        <div className="flex flex-col items-center gap-7 md:items-start">
          <h1 className="text-primary-text text-5xl font-bold md:text-7xl">
            El cine que te <br />
            <span className="text-brand-blue">mueve</span>
          </h1>
          <p className="text-lg md:text-xl">
            Descubre películas increíbles, <br />
            guarda tus favoritas y crea <br />
            tu propio universo cinematográfico.
          </p>
          <PrimaryLinkButton to="/explorar">
            Explorar películas
          </PrimaryLinkButton>
        </div>
      </HeroSection>

      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-0 md:divide-x md:divide-secondary-text/15">
          {features.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-2 px-4 pb-10 text-center md:pt-10 md:pb-20"
            >
              <Icon size={30} className="text-primary-text" />
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="text-secondary-text text-sm">{description}</p>
            </div>
          ))}
        </div>
      </PageContainer>

      <div className="bg-bg-deep flex flex-col gap-3 py-10">
        <PageContainer className="flex flex-col gap-10">
          <MovieCarousel
            title="Tendencias de esta semana"
            movies={trending.movies}
          />

          <MovieCarousel
            title="Lo más popular del mes"
            movies={nowPlaying.movies}
          />
        </PageContainer>
      </div>
    </div>
  );
}
