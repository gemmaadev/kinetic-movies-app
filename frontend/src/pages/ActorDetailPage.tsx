import { PersonDetailPage } from "@/features/person/components/PersonDetailPage";

export default function ActorDetailPage() {
  return (
    <PersonDetailPage
      getMovies={(filmography) => filmography}
      moviesTitle="Películas destacadas"
      notFoundMessage="Actor no encontrado."
    />
  );
}
