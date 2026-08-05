using backend.Data;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    /// <summary>
    /// Repository for managing inventory items.
    /// Implements the <see cref="IInventoryRepository"/> interface to provide CRUD operations for inventory.
    /// </summary>
    public class ItemRepo(AppDBContext context) : IInventoryRepository
    {
        private readonly AppDBContext _context = context;

        /// <summary>
        /// Creates a new inventory item asynchronously.
        /// </summary>
        /// <param name="item">The inventory item to create, represented as an <see cref="InventoryItemDTO"/>.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the created <see cref="InventoryItem"/>.</returns>
        public async Task<InventoryItem> CreateAsync(InventoryItemDTO item)
        {
            InventoryItem newItem = new(item);
            await _context.InventoryItems.AddAsync(newItem);
            await _context.SaveChangesAsync();
            return newItem;
        }

        /// <summary>
        /// Deletes an existing inventory item asynchronously by its ID.
        /// </summary>
        /// <param name="id">The ID of the inventory item to delete.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the deleted <see cref="InventoryItem"/> if found; otherwise, null.</returns>
        public async Task<InventoryItem?> DeleteAsync(int id)
        {
            var item = await _context.InventoryItems.FirstOrDefaultAsync(x => x.Id == id);

            if (item == null)
            {
                return null;
            }

            _context.InventoryItems.Remove(item);
            await _context.SaveChangesAsync();
            return item;
        }

        /// <summary>
        /// Retrieves all inventory items asynchronously, with optional filtering, sorting, and pagination.
        /// </summary>
        /// <param name="query">The query object containing filtering, sorting, and pagination parameters.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a <see cref="PagedResult{InventoryItem}"/> with the paginated list of items.</returns>
        public async Task<PagedResult<InventoryItem>> GetAllAsync(QueryObject query)
        {
            var itemsQuery = _context.InventoryItems.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Filter))
            {
                itemsQuery = itemsQuery.Where(s => s.Name.Contains(query.Filter));
            }

            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if (query.SortBy.Equals("Id", StringComparison.OrdinalIgnoreCase))
                {
                    itemsQuery = query.IsDescending
                        ? itemsQuery.OrderByDescending(s => s.Id)
                        : itemsQuery.OrderBy(s => s.Id);
                }
                if (query.SortBy.Equals("Name", StringComparison.OrdinalIgnoreCase))
                {
                    itemsQuery = query.IsDescending
                        ? itemsQuery.OrderByDescending(s => s.Name)
                        : itemsQuery.OrderBy(s => s.Name);
                }
                if (query.SortBy.Equals("Quantity", StringComparison.OrdinalIgnoreCase))
                {
                    itemsQuery = query.IsDescending
                        ? itemsQuery.OrderByDescending(s => s.Quantity)
                        : itemsQuery.OrderBy(s => s.Quantity);
                }
                if (query.SortBy.Equals("Price", StringComparison.OrdinalIgnoreCase))
                {
                    itemsQuery = query.IsDescending
                        ? itemsQuery.OrderByDescending(s => s.Price)
                        : itemsQuery.OrderBy(s => s.Price);
                }
            }

            var skipNumber = (query.Page - 1) * query.PageSize;
            var totalItems = await itemsQuery.CountAsync();

            var items = await itemsQuery.Skip(skipNumber).Take(query.PageSize).ToListAsync();
            return new PagedResult<InventoryItem>
            {
                Items = items,
                TotalCount = totalItems,
                PageSize = query.PageSize,
                CurrentPage = query.Page,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize),
            };
        }

        /// <summary>
        /// Retrieves an inventory item asynchronously by its ID.
        /// </summary>
        /// <param name="id">The ID of the inventory item to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="InventoryItem"/> if found; otherwise, null.</returns>
        public async Task<InventoryItem?> GetByIdAsync(int id)
        {
            return await _context.InventoryItems.FirstOrDefaultAsync(i => i.Id == id);
        }

        /// <summary>
        /// Checks if an inventory item exists asynchronously by its ID.
        /// </summary>
        /// <param name="id">The ID of the inventory item to check.</param>
        /// <returns>A task that represents the asynchronous operation. The task result is true if the item exists; otherwise, false.</returns>
        public Task<bool> ItemExists(int id)
        {
            return _context.InventoryItems.AnyAsync(s => s.Id == id);
        }

        /// <summary>
        /// Updates an existing inventory item asynchronously by its ID.
        /// </summary>
        /// <param name="id">The ID of the inventory item to update.</param>
        /// <param name="itemDto">The updated item data, represented as an <see cref="InventoryItemDTO"/>.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the updated <see cref="InventoryItem"/> if found and updated; otherwise, null.</returns>
        public async Task<InventoryItem?> UpdateAsync(int id, InventoryItemDTO itemDto)
        {
            var existingItem = await _context.InventoryItems.FirstOrDefaultAsync(x => x.Id == id);

            if (existingItem == null)
            {
                return null;
            }

            existingItem.Name = itemDto.Name;
            existingItem.Quantity = itemDto.Quantity;
            existingItem.Price = itemDto.Price;

            await _context.SaveChangesAsync();

            return existingItem;
        }
    }
}
