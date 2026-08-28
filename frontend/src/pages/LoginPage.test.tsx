import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import LoginPage from "./LoginPage";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

vi.mock("@/features/auth/hooks/useAuthActions", () => ({
  useAuthActions: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  const loginWithEmail = vi.fn();
  const loginWithGoogle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthActions).mockReturnValue({
      registerWithEmail: vi.fn(),
      loginWithEmail,
      loginWithGoogle,
      isLoading: false,
      error: null,
    });
  });

  // Scenario: Submit with an invalid email format
  //   Given the login form filled with an invalid email
  //   When I submit it
  //   Then I should see a validation error and loginWithEmail should not be called
  it("shows an error when the email format is invalid", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "not-an-email",
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "somepassword");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText(/introduce un email válido/i)).toBeInTheDocument();
    expect(loginWithEmail).not.toHaveBeenCalled();
  });

  // Scenario: Submit with an empty password
  //   Given the login form filled with a valid email but no password
  //   When I submit it
  //   Then I should see a validation error and loginWithEmail should not be called
  it("shows an error when the password is empty", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@test.com",
    );
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText(/introduce tu contraseña/i)).toBeInTheDocument();
    expect(loginWithEmail).not.toHaveBeenCalled();
  });

  // Scenario: Submit a valid login form
  //   Given the login form filled with valid data
  //   When I submit it
  //   Then loginWithEmail should be called with the correct arguments
  it("calls loginWithEmail with valid data", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@test.com",
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "somepassword");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(loginWithEmail).toHaveBeenCalledWith(
      "test@test.com",
      "somepassword",
    );
  });

  // Scenario: Click "Continuar con Google" triggers loginWithGoogle
  //   Given the login page
  //   When I click "Continuar con Google"
  //   Then loginWithGoogle should be called
  it("calls loginWithGoogle when clicking the Google button", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole("button", { name: /continuar con google/i }),
    );

    expect(loginWithGoogle).toHaveBeenCalled();
  });

  // Scenario: Show a Firebase error returned by the hook
  //   Given useAuthActions returns an error
  //   When the page renders
  //   Then the error message should be visible
  it("shows the error returned by useAuthActions", () => {
    vi.mocked(useAuthActions).mockReturnValue({
      registerWithEmail: vi.fn(),
      loginWithEmail,
      loginWithGoogle,
      isLoading: false,
      error: "Email o contraseña incorrectos.",
    });

    renderPage();

    expect(
      screen.getByText(/email o contraseña incorrectos/i),
    ).toBeInTheDocument();
  });

  // Scenario: Link to password recovery is present
  //   Given the login page
  //   Then a link to /recuperar-contrasena should be visible
  it("has a link to the forgot-password page", () => {
    renderPage();

    const link = screen.getByRole("link", { name: /olvidaste tu contraseña/i });
    expect(link).toHaveAttribute("href", "/recuperar-contrasena");
  });
});
