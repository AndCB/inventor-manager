import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInventory } from "./useInventory";
import { SnackbarProvider } from "../Contexts/SnackBarContext";
import { PagedResponse } from "../models/PagedResponse";

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

vi.mock("../services/apiService", () => ({
  fetchInventoryItems: fetchInventoryItemsMock,
  addInventoryItem: addInventoryItemMock,
  updateInventoryItem: updateInventoryItemMock,
  deleteInventoryItem: deleteInventoryItemMock,
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <SnackbarProvider>{children}</SnackbarProvider>
);

const pageWith = (count: number): PagedResponse => ({
  items: Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    quantity: i,
    price: i,
  })),
  totalCount: count,
  pageSize: 25,
  currentPage: 1,
  totalPages: Math.max(1, Math.ceil(count / 25)),
});

describe("useInventory", () => {
  beforeEach(() => {
    fetchInventoryItemsMock.mockReset();
    addInventoryItemMock.mockReset();
    updateInventoryItemMock.mockReset();
    deleteInventoryItemMock.mockReset();
    fetchInventoryItemsMock.mockResolvedValue(pageWith(0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetches the first page of items on mount with default settings", async () => {
    fetchInventoryItemsMock.mockResolvedValue(pageWith(2));
    const { result } = renderHook(() => useInventory(), { wrapper });

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(fetchInventoryItemsMock).toHaveBeenCalledTimes(1);
    expect(fetchInventoryItemsMock.mock.calls[0][0]).toMatchObject({
      Filter: "",
      SortBy: "id",
      IsDescending: false,
      Page: 1,
      PageSize: 25,
    });
  });

  it("debounces filter changes and resets the page to 1", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useInventory(), { wrapper });

    act(() => result.current.handleFilterChange("sony"));
    // The input updates immediately, but the query filter does not.
    expect(result.current.filterInput).toBe("sony");
    expect(result.current.filter).toBe("");
    expect(fetchInventoryItemsMock).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(299));
    expect(fetchInventoryItemsMock).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(1));
    expect(fetchInventoryItemsMock).toHaveBeenCalledTimes(2);
    expect(fetchInventoryItemsMock.mock.calls[1][0]).toMatchObject({
      Filter: "sony",
      Page: 1,
    });
  });

  it("resets the page when sorting changes", async () => {
    const { result } = renderHook(() => useInventory(), { wrapper });

    act(() => result.current.handlePageChange(null, 2));
    await waitFor(() =>
      expect(fetchInventoryItemsMock.mock.calls[fetchInventoryItemsMock.mock.calls.length - 1]?.[0]).toMatchObject({
        Page: 3,
      })
    );

    act(() => result.current.handleSort("name"));
    await waitFor(() =>
      expect(fetchInventoryItemsMock.mock.calls[fetchInventoryItemsMock.mock.calls.length - 1]?.[0]).toMatchObject({
        SortBy: "name",
        IsDescending: false,
        Page: 1,
      })
    );
  });

  it("cancels a pending debounce timer on unmount", () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() => useInventory(), { wrapper });

    act(() => result.current.handleFilterChange("sony"));
    unmount();
    act(() => vi.advanceTimersByTime(300));

    // The debounced fetch must not fire after unmount.
    expect(fetchInventoryItemsMock).toHaveBeenCalledTimes(1);
  });
});
