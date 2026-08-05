import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { useSnackbar } from "../Contexts/SnackBarContext";
import { InventoryItem } from "../models/InventoryItem";
import {
  addInventoryItem,
  deleteInventoryItem,
  fetchInventoryItems,
  updateInventoryItem,
} from "../services/apiService";

const INITIAL_ROWS_PER_PAGE = 25;
const DEBOUNCE_DELAY_MS = 300;

/**
 * Encapsulates all inventory state and side effects: data fetching, the
 * create/edit form, pagination, sorting, filtering, loading state, and
 * user feedback via snackbars.
 */
export function useInventory() {
  const { openSnackbarWithMessage } = useSnackbar();

  // Form state
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);

  // Data
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(INITIAL_ROWS_PER_PAGE);
  const [totalItems, setTotalItems] = useState(0);

  // Sorting
  const [sortBy, setSortBy] = useState<keyof InventoryItem>("id");
  const [isDescending, setIsDescending] = useState(false);

  // Filtering
  // The input value updates immediately; the actual query filter is
  // debounced so a request only fires after the user pauses typing.
  const [filterInput, setFilterInput] = useState("");
  const [filter, setFilter] = useState("");
  const filterDebounceRef = useRef<number | null>(null);

  // Cancel any pending debounced filter change on unmount.
  useEffect(() => {
    return () => {
      if (filterDebounceRef.current !== null) {
        window.clearTimeout(filterDebounceRef.current);
      }
    };
  }, []);

  // Tracks the most recent request so stale responses (e.g. from rapid
  // filter typing) never overwrite newer data.
  const requestIdRef = useRef(0);

  const fetchItems = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setLoadError(false);
    try {
      const response = await fetchInventoryItems({
        Filter: filter,
        SortBy: sortBy,
        IsDescending: isDescending,
        Page: page + 1,
        PageSize: rowsPerPage,
      });
      if (requestId !== requestIdRef.current) return; // stale response
      setItems(response.items);
      setTotalItems(response.totalCount);
      setLoadError(false);
    } catch {
      if (requestId !== requestIdRef.current) return; // stale failure
      setLoadError(true);
      openSnackbarWithMessage(
        "Failed to load inventory items. Please try again.",
        "error"
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [filter, sortBy, isDescending, page, rowsPerPage, openSnackbarWithMessage]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateInventoryItem(editId, { name, quantity, price });
        openSnackbarWithMessage("An Item has been updated.", "success");
      } else {
        await addInventoryItem({ name, quantity, price });
        openSnackbarWithMessage("An Item has been created.", "success");
      }
      clearFields();
      fetchItems();
    } catch {
      openSnackbarWithMessage(
        editId
          ? "Failed to update item. Please try again."
          : "Failed to create item. Please try again.",
        "error"
      );
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setName(item.name);
    setQuantity(item.quantity);
    setPrice(item.price);
    setEditId(item.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteInventoryItem(id);
      openSnackbarWithMessage("An Item has been deleted.", "success");
      // If we just removed the only row on this page, step back a page so
      // the user isn't left staring at an out-of-range, empty page.
      if (items.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchItems();
      }
    } catch {
      openSnackbarWithMessage(
        "Failed to delete item. Please try again.",
        "error"
      );
    }
  };

  const clearFields = () => {
    setName("");
    setQuantity(0);
    setPrice(0);
    setEditId(null);
  };

  const handleSort = (column: keyof InventoryItem) => {
    if (sortBy === column) {
      setIsDescending((prev) => !prev);
    } else {
      setSortBy(column);
      setIsDescending(false);
    }
    // A new ordering changes which items land on each page.
    setPage(0);
  };

  // Reset to the first page when filtering, so results that match on
  // earlier pages are always visible instead of a stale page number.
  const handleFilterChange = (value: string) => {
    setFilterInput(value);
    if (filterDebounceRef.current !== null) {
      window.clearTimeout(filterDebounceRef.current);
    }
    filterDebounceRef.current = window.setTimeout(() => {
      setFilter(value);
      setPage(0);
    }, DEBOUNCE_DELAY_MS);
  };

  const handlePageChange = (
    _event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  return {
    items,
    totalItems,
    isLoading,
    loadError,
    name,
    setName,
    quantity,
    setQuantity,
    price,
    setPrice,
    editId,
    handleSubmit,
    handleEdit,
    handleDelete,
    clearFields,
    page,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    sortBy,
    isDescending,
    handleSort,
    filter,
    filterInput,
    handleFilterChange,
  };
}
