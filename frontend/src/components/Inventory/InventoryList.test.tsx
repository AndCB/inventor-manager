import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InventoryList from "./InventoryList";
import { SnackbarProvider } from "../../Contexts/SnackBarContext";
import { InventoryItem } from "../../models/InventoryItem";
import { PagedResponse } from "../../models/PagedResponse";

const {
  fetchInventoryItemsMock,
  addInventoryItemMock,
  updateInventoryItemMock,
  deleteInventoryItemMock,
} = vi.hoisted(() => ({
  fetchInventoryItemsMock: vi.fn(),
  addInventoryItemMock: vi.fn(),
  updateInventoryItemMock: vi.fn(),
  deleteInventoryItemMock: vi.fn(),
}));

vi.mock("../../services/apiService", () => ({
  fetchInventoryItems: fetchInventoryItemsMock,
  addInventoryItem: addInventoryItemMock,
  updateInventoryItem: updateInventoryItemMock,
  deleteInventoryItem: deleteInventoryItemMock,
}));

const makeItems = (count: number): InventoryItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    quantity: i,
    price: i + 0.5,
  }));

const paged = (items: InventoryItem[]): PagedResponse => ({
  items,
  totalCount: items.length,
  pageSize: 25,
  currentPage: 1,
  totalPages: Math.max(1, Math.ceil(items.length / 25)),
});

const renderList = () =>
  render(
    <SnackbarProvider>
      <InventoryList />
    </SnackbarProvider>
  );

describe("InventoryList", () => {
  beforeEach(() => {
    fetchInventoryItemsMock.mockReset();
    addInventoryItemMock.mockReset();
    updateInventoryItemMock.mockReset();
    deleteInventoryItemMock.mockReset();
    fetchInventoryItemsMock.mockResolvedValue(paged([]));
  });

  it("renders items returned by the API", async () => {
    fetchInventoryItemsMock.mockResolvedValue(
      paged([
        { id: 1, name: "Sony Headphones", quantity: 3, price: 99.99 },
        { id: 2, name: "USB Cable", quantity: 10, price: 4.5 },
      ])
    );
    renderList();

    expect(await screen.findByText("Sony Headphones")).toBeInTheDocument();
    expect(screen.getByText("USB Cable")).toBeInTheDocument();
    expect(screen.getByText("99.99")).toBeInTheDocument();
  });

  it("shows the empty state when there are no items", async () => {
    renderList();
    expect(
      await screen.findByText("No inventory items found.")
    ).toBeInTheDocument();
  });

  it("debounces the filter and resets to the first page", async () => {
    const user = userEvent.setup();
    fetchInventoryItemsMock.mockResolvedValue(paged(makeItems(30)));
    renderList();
    await screen.findByText("Item 1");

    expect(fetchInventoryItemsMock).toHaveBeenCalledTimes(1);
    expect(fetchInventoryItemsMock.mock.calls[0][0]).toMatchObject({
      Page: 1,
      PageSize: 25,
    });

    // Move to page 2 so the filter reset back to page 1 is observable.
    await user.click(screen.getByRole("button", { name: "next page" }));
    await waitFor(() =>
      expect(fetchInventoryItemsMock.mock.calls[fetchInventoryItemsMock.mock.calls.length - 1]?.[0]).toMatchObject({
        Page: 2,
      })
    );

    // Typing fires no per-keystroke requests: exactly one debounced
    // request goes out (with the page reset), not one per character.
    await user.type(screen.getByRole("textbox", { name: "Filter by Name" }), "sony");
    await waitFor(() => {
      const calls = fetchInventoryItemsMock.mock.calls;
      expect(calls).toHaveLength(3); // mount + page 2 + debounced filter
      expect(calls[calls.length - 1]?.[0]).toMatchObject({
        Filter: "sony",
        Page: 1,
      });
    });
  });

  it("asks for confirmation before deleting an item", async () => {
    const user = userEvent.setup();
    const keyboard = { id: 7, name: "Keyboard", quantity: 2, price: 59 };
    fetchInventoryItemsMock.mockResolvedValue(paged([keyboard]));
    deleteInventoryItemMock.mockResolvedValue(keyboard);
    renderList();
    await screen.findByText("Keyboard");

    // Cancelling keeps the item and makes no API call.
    await user.click(screen.getByRole("button", { name: "Delete Keyboard" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete "Keyboard"\?/)
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    // The dialog stays mounted during its exit transition, so wait for
    // it to actually leave the document.
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(deleteInventoryItemMock).not.toHaveBeenCalled();

    // Confirming deletes the item and closes the dialog.
    await user.click(screen.getByRole("button", { name: "Delete Keyboard" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(deleteInventoryItemMock).toHaveBeenCalledWith(7));
    expect(
      await screen.findByText("An Item has been deleted.")
    ).toBeInTheDocument();
  });

  it("edits an item from the form", async () => {
    const user = userEvent.setup();
    const laptop = { id: 3, name: "Laptop", quantity: 1, price: 1200 };
    fetchInventoryItemsMock.mockResolvedValue(paged([laptop]));
    updateInventoryItemMock.mockResolvedValue({
      ...laptop,
      name: "Gaming Laptop",
    });
    renderList();
    await screen.findByText("Laptop");

    // The edit button populates the form and switches the submit label.
    await user.click(screen.getByRole("button", { name: "Edit Laptop" }));
    const nameField = screen.getByRole("textbox", { name: "Name" });
    expect(nameField).toHaveValue("Laptop");
    await user.clear(nameField);
    await user.type(nameField, "Gaming Laptop");
    await user.click(screen.getByRole("button", { name: "Update Item" }));

    await waitFor(() =>
      expect(updateInventoryItemMock).toHaveBeenCalledWith(3, {
        name: "Gaming Laptop",
        quantity: 1,
        price: 1200,
      })
    );
    expect(
      await screen.findByText("An Item has been updated.")
    ).toBeInTheDocument();
  });

  it("creates an item from the form", async () => {
    const user = userEvent.setup();
    addInventoryItemMock.mockResolvedValue({
      id: 1,
      name: "Mouse",
      quantity: 5,
      price: 25,
    });
    renderList();

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Mouse");
    await user.type(screen.getByRole("spinbutton", { name: "Quantity" }), "5");
    await user.type(screen.getByRole("spinbutton", { name: "Price" }), "25");
    await user.click(screen.getByRole("button", { name: "Add Item" }));

    await waitFor(() =>
      expect(addInventoryItemMock).toHaveBeenCalledWith({
        name: "Mouse",
        quantity: 5,
        price: 25,
      })
    );
    expect(
      await screen.findByText("An Item has been created.")
    ).toBeInTheDocument();
  });
});
