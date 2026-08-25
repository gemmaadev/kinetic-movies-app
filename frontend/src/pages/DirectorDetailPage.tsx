import { PersonDetailPage } from "@/features/person/components/PersonDetailPage";

export default function DirectorDetailPage() {
  return (
    <PersonDetailPage
      getMovies={(_, filmographyAsDirector) => filmographyAsDirector}
      moviesTitle="Películas dirigidas"
      notFoundMessage="Director no encontrado."
    />
  );
}
