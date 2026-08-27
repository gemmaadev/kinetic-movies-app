import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "@/features/auth/hooks/useAuth";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

function renderWithRoute(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<p>Protected content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Show loading state while Firebase confirms the session
  //   Given the auth state is still being checked
  //   When ProtectedRoute renders
  //   Then a loading indicator should be shown, not the content or a redirect
  it("shows a loading indicator while auth state is loading", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: true,
      getIdToken: vi.fn(),
    });

    renderWithRoute("/");

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });

  // Scenario: Redirect to /login when there's no session
  //   Given no authenticated user
  //   When ProtectedRoute renders
  //   Then the user should be redirected to /login
  it("redirects to /login when there is no authenticated user", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      getIdToken: vi.fn(),
    });

    renderWithRoute("/");

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });

  // Scenario: Show the protected content when there's a session
  //   Given an authenticated user
  //   When ProtectedRoute renders
  //   Then the protected content should be shown
  it("renders the protected content when there is an authenticated user", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "123" } as never,
      isAuthenticated: true,
      loading: false,
      getIdToken: vi.fn(),
    });

    renderWithRoute("/");

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });
});