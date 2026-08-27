import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useAuthActions } from "./useAuthActions";
import { firebaseAuth } from "@/shared/services/firebase";
import { apiClient } from "@/shared/services/apiClient";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock("@/shared/services/firebase", () => ({
  firebaseAuth: {},
}));

vi.mock("@/shared/services/apiClient", () => ({
  apiClient: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderAuthActions() {
  return renderHook(() => useAuthActions(), {
    wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
  });
}

describe("useAuthActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerWithEmail", () => {
    // Scenario: Successful registration
    //   Given valid registration data
    //   When registerWithEmail is called
    //   Then Firebase creates the user, the backend is synced, and the user is redirected
    it("creates the Firebase user, syncs with backend, and navigates on success", async () => {
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({} as never);
      vi.mocked(apiClient).mockResolvedValue({});

      const { result } = renderAuthActions();

      await result.current.registerWithEmail(
        "test@test.com",
        "Password1",
        "Test User",
      );

      await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          firebaseAuth,
          "test@test.com",
          "Password1",
        );
      });

      expect(apiClient).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: "Test User", email: "test@test.com" }),
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    // Scenario: Firebase rejects registration (email already in use)
    //   Given an email that already has an account
    //   When registerWithEmail is called
    //   Then the translated error message should be set, and no navigation happens
    it("sets a translated error message when Firebase rejects the registration", async () => {
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
        code: "auth/email-already-in-use",
      });

      const { result } = renderAuthActions();

      await result.current.registerWithEmail(
        "test@test.com",
        "Password1",
        "Test User",
      );

      await waitFor(() => {
        expect(result.current.error).toBe(
          "Ya existe una cuenta con este email.",
        );
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Scenario: isLoading toggles correctly during the action
    //   Given a pending registration
    //   When registerWithEmail starts
    //   Then isLoading should be true until it resolves
    it("sets isLoading to false after completing", async () => {
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({} as never);
      vi.mocked(apiClient).mockResolvedValue({});

      const { result } = renderAuthActions();

      await result.current.registerWithEmail(
        "test@test.com",
        "Password1",
        "Test User",
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("loginWithEmail", () => {
    // Scenario: Successful login
    //   Given valid credentials
    //   When loginWithEmail is called
    //   Then Firebase signs in, the backend is synced, and the user is redirected
    it("signs in with Firebase, syncs with backend, and navigates on success", async () => {
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as never);
      vi.mocked(apiClient).mockResolvedValue({});

      const { result } = renderAuthActions();

      await result.current.loginWithEmail("test@test.com", "Password1");

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          firebaseAuth,
          "test@test.com",
          "Password1",
        );
      });

      expect(apiClient).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({}),
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    // Scenario: Wrong credentials
    //   Given an incorrect password
    //   When loginWithEmail is called
    //   Then a generic "incorrect credentials" error should be set
    it("sets a generic error message for wrong credentials", async () => {
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue({
        code: "auth/wrong-password",
      });

      const { result } = renderAuthActions();

      await result.current.loginWithEmail("test@test.com", "wrongpass");

      await waitFor(() => {
        expect(result.current.error).toBe("Email o contraseña incorrectos.");
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Scenario: Too many failed attempts
    //   Given repeated failed login attempts
    //   When Firebase returns "too-many-requests"
    //   Then a rate-limit error message should be shown
    it("sets a rate-limit error message", async () => {
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue({
        code: "auth/too-many-requests",
      });

      const { result } = renderAuthActions();

      await result.current.loginWithEmail("test@test.com", "wrongpass");

      await waitFor(() => {
        expect(result.current.error).toBe(
          "Demasiados intentos. Inténtalo más tarde.",
        );
      });
    });
  });
});
