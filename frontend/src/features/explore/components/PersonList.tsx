import { resizePosterUrl } from "@/shared/utils/resizePosterUrl";
import { Link } from "react-router";

interface PersonListItem {
  id: number;
  name: string;
  photoUrl: string | null;
  subtitle?: string;
}

interface PersonListProps {
  title: string;
  people: PersonListItem[];
  linkTo?: (id: number) => string;
}

export function PersonList({ title, people, linkTo }: PersonListProps) {
  if (people.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      <div className="flex flex-wrap gap-4">
        {people.map((person) => {
          const content = (
            <>
              {person.photoUrl ? (
                <img
                  src={resizePosterUrl(person.photoUrl, "w200") ?? undefined}
                  alt={person.name}
                  width={96}
                  height={96}
                  className="h-20 w-20 rounded-full object-cover md:h-24 md:w-24"
                />
              ) : (
                <div
                  className="h-20 w-20 rounded-full bg-bg-surface md:h-24 md:w-24"
                  role="img"
                  aria-label={`Sin imagen disponible de ${person.name}`}
                />
              )}
              <p className="text-center text-sm font-bold">{person.name}</p>
              {person.subtitle && (
                <p className="text-center text-xs text-secondary-text">
                  {person.subtitle}
                </p>
              )}
            </>
          );

          return linkTo ? (
            <Link
              key={person.id}
              to={linkTo(person.id)}
              className="flex flex-col items-center gap-1"
            >
              {content}
            </Link>
          ) : (
            <div key={person.id} className="flex flex-col items-center gap-2">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
