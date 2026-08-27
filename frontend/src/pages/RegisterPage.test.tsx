import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import RegisterPage from "./RegisterPage";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

vi.mock("@/features/auth/hooks/useAuthActions", () => ({
  useAuthActions: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/nombre/i), "Test User");
  await user.type(
    screen.getByLabelText(/correo electrónico/i),
    "test@test.com",
  );
  await user.type(screen.getByLabelText(/^contraseña/i), "Password1");
  await user.type(screen.getByLabelText(/confirmar contraseña/i), "Password1");
}

describe("RegisterPage", () => {
  const registerWithEmail = vi.fn();
  const loginWithGoogle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthActions).mockReturnValue({
      registerWithEmail,
      loginWithEmail: vi.fn(),
      loginWithGoogle,
      isLoading: false,
      error: null,
    });
  });

  // Scenario: Submit with an empty name
  it("shows an error when the name is empty", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@test.com",
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "Password1");
    await user.type(
      screen.getByLabelText(/confirmar contraseña/i),
      "Password1",
    );
    await user.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(registerWithEmail).not.toHaveBeenCalled();
  });

  // Scenario: Submit with an invalid email format
  it("shows an error when the email format is invalid", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/nombre/i), "Test User");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "not-an-email",
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "Password1");
    await user.type(
      screen.getByLabelText(/confirmar contraseña/i),
      "Password1",
    );
    await user.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(screen.getByText(/introduce un email válido/i)).toBeInTheDocument();
    expect(registerWithEmail).not.toHaveBeenCalled();
  });

  // Scenario: Submit with a password shorter than 8 characters
  it("shows an error when the password is too short", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/nombre/i), "Test User");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@test.com",
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "abc123");
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "abc123");
    await user.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(screen.getByText(/al menos 8 caracteres/i)).toBeInTheDocument();
    expect(registerWithEmail).not.toHaveBeenCalled();
  });

  // Scenario: Submit with a password missing an uppercase letter
  it("shows an error when the password has no uppercase letter", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/nombre/i), "Test User");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@test.com",
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "password1");
    await user.type(
      screen.getByLabelText(/confirmar contraseña/i),
      "password1",
    );
    await user.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(screen.getByText(/al menos una mayúscula/i)).toBeInTheDocument();
    expect(registerWithEmail).not.toHaveBeenCalled();
  });

  // Scenario: Submit with a password missing a number
  it("shows an error when the password has no number", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/nombre/i), "Test User");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@test.com",
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "Password");
    await user.type(screen.getByLabelText(/confirmar contraseña/i), "Password");
    await user.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(screen.getByText(/al menos un número/i)).toBeInTheDocument();
    expect(registerWithEmail).not.toHaveBeenCalled();
  });

  // Scenario: Submit with mismatched passwords
  it("shows an error when passwords do not match", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/nombre/i), "Test User");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@test.com",
    );
    await user.type(screen.getByLabelText(/^contraseña/i), "Password1");
    await user.type(
      screen.getByLabelText(/confirmar contraseña/i),
      "Password2",
    );
    await user.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(
      screen.getByText(/las contraseñas no coinciden/i),
    ).toBeInTheDocument();
    expect(registerWithEmail).not.toHaveBeenCalled();
  });

  // Scenario: Submit a fully valid registration form
  it("calls registerWithEmail with valid data", async () => {
    const user = userEvent.setup();
    renderPage();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(registerWithEmail).toHaveBeenCalledWith(
      "test@test.com",
      "Password1",
      "Test User",
    );
  });

  // Scenario: Show a backend/Firebase error returned by the hook
  it("shows the error returned by useAuthActions", () => {
    vi.mocked(useAuthActions).mockReturnValue({
      registerWithEmail,
      loginWithEmail: vi.fn(),
      loginWithGoogle,
      isLoading: false,
      error: "Ya existe una cuenta con este email.",
    });

    renderPage();

    expect(screen.getByText(/ya existe una cuenta/i)).toBeInTheDocument();
  });
  // Scenario: Link to login page is present
  it("has a link to the login page", () => {
    renderPage();

    const link = screen.getByRole("link", { name: /inicia sesión/i });
    expect(link).toHaveAttribute("href", "/login");
  });
});
