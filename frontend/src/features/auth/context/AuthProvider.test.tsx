import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "../hooks/useAuth";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock("@/shared/services/firebase", () => ({
  firebaseAuth: {},
}));

function TestComponent() {
  const { user, isAuthenticated, loading } = useAuth();
  return (
    <div>
      <p>loading: {String(loading)}</p>
      <p>isAuthenticated: {String(isAuthenticated)}</p>
      <p>user: {user ? user.uid : "none"}</p>
    </div>
  );
}

describe("AuthProvider", () => {
  it("starts in a loading state with no user", () => {
    vi.mocked(onAuthStateChanged).mockImplementation(() => () => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText(/loading: true/i)).toBeInTheDocument();
    expect(screen.getByText(/user: none/i)).toBeInTheDocument();
  });

  it("updates state when Firebase confirms an authenticated user", async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      const onNext = callback as (user: User | null) => void;
      onNext({ uid: "test-uid" } as User);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/loading: false/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/isAuthenticated: true/i)).toBeInTheDocument();
    expect(screen.getByText(/user: test-uid/i)).toBeInTheDocument();
  });

  it("updates state when Firebase confirms no user is logged in", async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      const onNext = callback as (user: User | null) => void;
      onNext(null);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/loading: false/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/isAuthenticated: false/i)).toBeInTheDocument();
  });
});