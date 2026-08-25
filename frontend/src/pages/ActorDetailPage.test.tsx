import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import ActorDetailPage from "./ActorDetailPage";
import { usePersonDetail } from "@/features/person/hooks/usePersonDetail";

vi.mock("@/features/person/hooks/usePersonDetail", () => ({
  usePersonDetail: vi.fn(),
}));

// Scenario: ActorDetailPage uses the actor's filmography (not directing credits)
it("renders acting filmography, not directing credits", () => {
  vi.mocked(usePersonDetail).mockReturnValue({
    person: {
      id: 1,
      name: "Test Actor",
      photoUrl: null,
      biography: "",
      birthday: null,
      placeOfBirth: null,
      filmography: [
        {
          id: 1,
          title: "Acted Movie",
          posterUrl: null,
          voteAverage: 7,
          releaseYear: 2020,
        },
      ],
      filmographyAsDirector: [
        {
          id: 2,
          title: "Directed Movie",
          posterUrl: null,
          voteAverage: 8,
          releaseYear: 2021,
        },
      ],
    },
    isLoading: false,
    error: null,
  });

  render(
    <MemoryRouter initialEntries={["/actor/1"]}>
      <Routes>
        <Route path="/actor/:id" element={<ActorDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByText("Acted Movie")).toBeInTheDocument();
  expect(screen.queryByText("Directed Movie")).not.toBeInTheDocument();
});
