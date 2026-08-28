import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useAuthActions } from "./useAuthActions";
import { firebaseAuth } from "@/shared/services/firebase";
import { apiClient } from "@/shared/services/apiClient";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  updateProfile: vi.fn(),
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
    vi.resetAllMocks();
  });

  describe("registerWithEmail", () => {
    // Scenario: Successful registration
    //   Given valid registration data
    //   When registerWithEmail is called
    //   Then Firebase creates the user, sets the displayName, the backend is
    //   synced, and the user is redirected
    it("creates the Firebase user, sets displayName, syncs with backend, and navigates on success", async () => {
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: { uid: "test-uid" },
      } as never);
      vi.mocked(updateProfile).mockResolvedValue(undefined);
      vi.mocked(apiClient).mockResolvedValue({});

      const { result } = renderAuthActions();

      await act(async () => {
        await result.current.registerWithEmail(
          "test@test.com",
          "Password1",
          "Test User",
        );
      });

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        firebaseAuth,
        "test@test.com",
        "Password1",
      );
      expect(updateProfile).toHaveBeenCalledWith(
        { uid: "test-uid" },
        { displayName: "Test User" },
      );
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

      await act(async () => {
        await result.current.registerWithEmail(
          "test@test.com",
          "Password1",
          "Test User",
        );
      });

      expect(result.current.error).toBe("Ya existe una cuenta con este email.");
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Scenario: isLoading toggles correctly during the action
    //   Given a pending registration
    //   When registerWithEmail starts
    //   Then isLoading should be true until it resolves
    it("sets isLoading to false after completing", async () => {
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: { uid: "test-uid" },
      } as never);
      vi.mocked(updateProfile).mockResolvedValue(undefined);
      vi.mocked(apiClient).mockResolvedValue({});

      const { result } = renderAuthActions();

      await act(async () => {
        await result.current.registerWithEmail(
          "test@test.com",
          "Password1",
          "Test User",
        );
      });

      expect(result.current.isLoading).toBe(false);
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

      await act(async () => {
        await result.current.loginWithEmail("test@test.com", "Password1");
      });

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        firebaseAuth,
        "test@test.com",
        "Password1",
      );
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

      await act(async () => {
        await result.current.loginWithEmail("test@test.com", "wrongpass");
      });

      expect(result.current.error).toBe("Email o contraseña incorrectos.");
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

      await act(async () => {
        await result.current.loginWithEmail("test@test.com", "wrongpass");
      });

      expect(result.current.error).toBe(
        "Demasiados intentos. Inténtalo más tarde.",
      );
    });
  });

  describe("loginWithGoogle", () => {
    const mockGoogleCredential = {
      user: {
        displayName: "Ada Lovelace",
        email: "ada@example.com",
        photoURL: "https://example.com/ada.jpg",
      },
    };

    // Scenario: Successful Google sign-in
    //   Given the Google popup resolves with a valid credential
    //   When loginWithGoogle is called
    //   Then the backend is synced via /api/auth/register, and the user is redirected
    it("syncs the user via /api/auth/register and navigates on success", async () => {
      vi.mocked(signInWithPopup).mockResolvedValue(
        mockGoogleCredential as never,
      );
      vi.mocked(apiClient).mockResolvedValue({});

      const { result } = renderAuthActions();

      await act(async () => {
        await result.current.loginWithGoogle();
      });

      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(apiClient).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@example.com",
          avatarUrl: "https://example.com/ada.jpg",
        }),
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    // Scenario: User closes the popup or a generic error occurs
    //   Given the Google popup fails without a specific known code
    //   When loginWithGoogle is called
    //   Then a generic error message is set, and no backend sync happens
    it("sets a generic error message when the popup fails and does not call the backend", async () => {
      vi.mocked(signInWithPopup).mockRejectedValue({
        code: "auth/popup-closed-by-user",
      });

      const { result } = renderAuthActions();

      await act(async () => {
        await result.current.loginWithGoogle();
      });

      expect(apiClient).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result.current.error).toBe(
        "Ha ocurrido un error. Inténtalo de nuevo.",
      );
    });

    // Scenario: Account already exists with a different provider
    //   Given the email is already registered with email/password
    //   When loginWithGoogle is called
    //   Then a specific conflict error message is set
    it("shows a specific message when the account exists with a different provider", async () => {
      vi.mocked(signInWithPopup).mockRejectedValue({
        code: "auth/account-exists-with-different-credential",
      });

      const { result } = renderAuthActions();

      await act(async () => {
        await result.current.loginWithGoogle();
      });

      expect(result.current.error).toBe(
        "Ya existe una cuenta con este email usando otro método de acceso. Prueba a iniciar sesión con tu contraseña.",
      );
    });
  });
});
