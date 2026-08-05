import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const {
  loginMock,
  registerMock,
  fetchInventoryItemsMock,
  addInventoryItemMock,
  updateInventoryItemMock,
  deleteInventoryItemMock,
} = vi.hoisted(() => ({
  loginMock: vi.fn(),
  registerMock: vi.fn(),
  fetchInventoryItemsMock: vi.fn(),
  addInventoryItemMock: vi.fn(),
  updateInventoryItemMock: vi.fn(),
  deleteInventoryItemMock: vi.fn(),
}));

vi.mock("./services/apiService", () => ({
  login: loginMock,
  register: registerMock,
  fetchInventoryItems: fetchInventoryItemsMock,
  addInventoryItem: addInventoryItemMock,
  updateInventoryItem: updateInventoryItemMock,
  deleteInventoryItem: deleteInventoryItemMock,
}));

const emptyPage = {
  items: [],
  totalCount: 0,
  pageSize: 25,
  currentPage: 1,
  totalPages: 0,
};

const oneItemPage = {
  items: [{ id: 1, name: "Sony Headphones", quantity: 3, price: 99.99 }],
  totalCount: 1,
  pageSize: 25,
  currentPage: 1,
  totalPages: 1,
};

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    loginMock.mockReset();
    registerMock.mockReset();
    fetchInventoryItemsMock.mockReset();
    addInventoryItemMock.mockReset();
    updateInventoryItemMock.mockReset();
    deleteInventoryItemMock.mockReset();
    fetchInventoryItemsMock.mockResolvedValue(emptyPage);
  });

  it("shows the auth page when logged out", () => {
    render(<App />);
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
  });

  it("switches to the inventory view after a successful login", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({ token: "token-123", username: "alice" });
    fetchInventoryItemsMock.mockResolvedValue(oneItemPage);
    render(<App />);

    await user.type(screen.getByRole("textbox", { name: "Username" }), "alice");
    await user.type(screen.getByLabelText(/^Password/), "Passw0rd!");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByText("Signed in as alice")).toBeInTheDocument();
    expect(await screen.findByText("Sony Headphones")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("stays on the auth page and shows an error when login fails", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValue({ isAxiosError: true, response: { status: 401 } });
    render(<App />);

    await user.type(screen.getByRole("textbox", { name: "Username" }), "alice");
    await user.type(screen.getByLabelText(/^Password/), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(
      await screen.findByText("Invalid username or password.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
    // A failed login must not reach the inventory view.
    expect(fetchInventoryItemsMock).not.toHaveBeenCalled();
  });

  it("lands on the inventory view after registering", async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValue({ token: "token-456", username: "bob" });
    render(<App />);

    await user.click(screen.getByRole("tab", { name: "Register" }));
    await user.type(screen.getByRole("textbox", { name: "Username" }), "bob");
    await user.type(screen.getByLabelText(/^Password/), "Passw0rd!");
    await user.type(screen.getByLabelText("Confirm Password", { exact: false }), "Passw0rd!");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(await screen.findByText("Signed in as bob")).toBeInTheDocument();
    expect(fetchInventoryItemsMock).toHaveBeenCalled();
  });
});
