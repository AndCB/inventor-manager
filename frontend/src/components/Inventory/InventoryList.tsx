// src/components/Inventory/InventoryList.tsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { InventoryItem } from "../../models/InventoryItem";
import { ArrowDownward, ArrowUpward, Delete, Edit } from "@mui/icons-material";
import JumpToFirstOrLast from "../pagination/JumpToFirstOrLastActions";
import { useInventory } from "../../hooks/useInventory";

const InventoryList: React.FC = () => {
  const {
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
    setFilter,
  } = useInventory();

  // Styling state
  const [onHover, setOnHover] = useState("");

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 justify-evenly">
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {editId ? "Update Item" : "Add Item"}
        </Button>
        <Button onClick={clearFields} variant="outlined" color="secondary">
          Clear
        </Button>
      </form>

      {/* Filter input */}
      <TextField
        label="Filter by Name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginTop: "16px", marginBottom: "16px" }}
      />

      {isLoading && <LinearProgress />}

      <TableContainer component={Paper} className="max-h-[30rem] overflow-y-auto">
        <Table>
          <TableHead>
            <TableRow>
              {["id", "name", "quantity", "price"].map((column) => (
                <TableCell
                  key={column}
                  onClick={() => handleSort(column as keyof InventoryItem)}
                  onMouseEnter={() => setOnHover(column)}
                  onMouseLeave={() => setOnHover("")}
                  className="sticky top-0 z-10 bg-white"
                  sx={{ cursor: "pointer" }}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}

                  <IconButton
                    size="small"
                    sx={{
                      visibility:
                        onHover === column || sortBy === column
                          ? "visible"
                          : "hidden",
                    }}
                  >
                    {sortBy === column && isDescending ? (
                      <ArrowDownward fontSize="small" />
                    ) : (
                      <ArrowUpward fontSize="small" />
                    )}
                  </IconButton>
                </TableCell>
              ))}
              <TableCell className="sticky top-0 z-10 bg-white">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {loadError
                    ? "Failed to load inventory items."
                    : "No inventory items found."}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(item)}
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      color="secondary"
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        ActionsComponent={JumpToFirstOrLast}
      />
    </div>
  );
};

export default InventoryList;
