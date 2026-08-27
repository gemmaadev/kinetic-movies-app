import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import ForgotPasswordPage from "./ForgotPasswordPage";
import { sendPasswordResetEmail } from "firebase/auth";

vi.mock("firebase/auth", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("@/shared/services/firebase", () => ({
  firebaseAuth: {},
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>,
  );
}

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Submit with an invalid email format
  //   Given the form with an invalid email
  //   When I submit it
  //   Then I should see a validation error and sendPasswordResetEmail should not be called
  it("shows an error when the email format is invalid", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "not-an-email",
    );
    await user.click(screen.getByRole("button", { name: /enviar enlace/i }));

    expect(screen.getByText(/introduce un email válido/i)).toBeInTheDocument();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  // Scenario: Submit a valid email and Firebase succeeds
  //   Given a valid email
  //   When I submit the form
  //   Then sendPasswordResetEmail should be called and the success view should show
  it("shows the success view after sending the reset email", async () => {
    vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@test.com",
    );
    await user.click(screen.getByRole("button", { name: /enviar enlace/i }));

    expect(await screen.findByText(/revisa tu email/i)).toBeInTheDocument();
    expect(screen.getByText(/test@test.com/i)).toBeInTheDocument();
  });

  // Scenario: Firebase reports no account for this email
  //   Given an email with no matching account
  //   When I submit the form
  //   Then a translated error message should be shown
  it("shows a translated error when the account doesn't exist", async () => {
    vi.mocked(sendPasswordResetEmail).mockRejectedValue({
      code: "auth/user-not-found",
    });
    const user = userEvent.setup();
    renderPage();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "noexiste@test.com",
    );
    await user.click(screen.getByRole("button", { name: /enviar enlace/i }));

    expect(
      await screen.findByText(/no existe ninguna cuenta con este email/i),
    ).toBeInTheDocument();
  });

  // Scenario: Link back to login is present on the initial form
  it("has a link back to login on the form view", () => {
    renderPage();

    const link = screen.getByRole("link", { name: /volver a iniciar sesión/i });
    expect(link).toHaveAttribute("href", "/login");
  });
});
