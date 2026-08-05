import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthPage from "./AuthPage";
import { SnackbarProvider } from "../../Contexts/SnackBarContext";

const { loginMock, registerMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  registerMock: vi.fn(),
}));

vi.mock("../../Contexts/AuthContext", () => ({
  useAuth: () => ({
    auth: null,
    isAuthenticated: false,
    login: loginMock,
    register: registerMock,
    logout: vi.fn(),
  }),
}));

const renderAuthPage = () =>
  render(
    <SnackbarProvider>
      <AuthPage />
    </SnackbarProvider>
  );

// Mirrors the shape axios errors have, so getAuthErrorMessage maps statuses.
const axiosError = (status: number) => ({
  isAxiosError: true,
  response: { status },
});

describe("AuthPage", () => {
  beforeEach(() => {
    loginMock.mockReset();
    registerMock.mockReset();
  });

  it("renders the login form by default", () => {
    renderAuthPage();
    expect(screen.getByText("Sign in to manage inventory.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Username" })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Confirm Password")).not.toBeInTheDocument();
  });

  it("shows the confirm password field when switching to register", async () => {
    const user = userEvent.setup();
    renderAuthPage();
    await user.click(screen.getByRole("tab", { name: "Register" }));
    expect(
      screen.getByText("Create an account to manage inventory.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password", { exact: false })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" })
    ).toBeInTheDocument();
  });

  it("does not submit when passwords do not match and shows a snackbar", async () => {
    const user = userEvent.setup();
    renderAuthPage();
    await user.click(screen.getByRole("tab", { name: "Register" }));
    await user.type(screen.getByRole("textbox", { name: "Username" }), "alice");
    await user.type(screen.getByLabelText(/^Password/), "Passw0rd!");
    await user.type(screen.getByLabelText("Confirm Password", { exact: false }), "Passw0rd");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    // The helper text also says this, so scope the assertion to the
    // snackbar, which renders as a role="alert" element.
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Passwords do not match.");
    expect(registerMock).not.toHaveBeenCalled();
  });

  it("calls login with the entered credentials on success", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue(undefined);
    renderAuthPage();
    await user.type(screen.getByRole("textbox", { name: "Username" }), "alice");
    await user.type(screen.getByLabelText(/^Password/), "Passw0rd!");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith("alice", "Passw0rd!")
    );
    expect(await screen.findByText("Welcome back!")).toBeInTheDocument();
  });

  it("shows an error snackbar when login fails with 401", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValue(axiosError(401));
    renderAuthPage();
    await user.type(screen.getByRole("textbox", { name: "Username" }), "alice");
    await user.type(screen.getByLabelText(/^Password/), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(
      await screen.findByText("Invalid username or password.")
    ).toBeInTheDocument();
  });
});
