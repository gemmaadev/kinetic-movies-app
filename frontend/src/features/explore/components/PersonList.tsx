import type { Person } from "@/features/explore/types/explore.types";

interface PersonListProps {
  title: string;
  people: Person[];
}

export function PersonList({ title, people }: PersonListProps) {
  if (people.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      <div className="flex flex-wrap gap-4">
        {people.map((person) => (
          <div key={person.id} className="flex flex-col items-center gap-2">
            {person.photoUrl && (
              <img
                src={person.photoUrl}
                alt={person.name}
                className="h-20 w-20 rounded-full object-cover md:h-30 md:w-30"
              />
            )}
            <p className="text-center text-sm">{person.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
