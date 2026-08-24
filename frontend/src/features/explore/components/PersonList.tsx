import { Link } from "react-router";

interface PersonListItem {
  id: number;
  name: string;
  photoUrl: string | null;
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
              {person.photoUrl && (
                <img
                  src={person.photoUrl}
                  alt={person.name}
                  className="h-20 w-20 rounded-full object-cover md:h-30 md:w-30"
                />
              )}
              <p className="text-center text-sm">{person.name}</p>
            </>
          );

          return linkTo ? (
            <Link
              key={person.id}
              to={linkTo(person.id)}
              className="flex flex-col items-center gap-2"
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
