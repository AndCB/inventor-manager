using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for handling all requests related to inventory items
    /// </summary>
    /// <param name="repo">Repository for comunicating with the database</param>
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController(IInventoryRepository repo) : ControllerBase
    {
        private readonly IInventoryRepository _repo = repo;

        ///<summary>
        ///Retrieves all inventory items.
        ///</summary>
        ///<returns> A paged result of the inventory</returns>
        ///<response code="200">Correctly fetches the inventory data</response>
        ///<response code="400">There was an issue with the request</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PagedResult<InventoryItem>>> GetAllItems(
            [FromQuery] QueryObject query
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var items = await _repo.GetAllAsync(query);

            return Ok(items);
        }

        ///<summary>
        ///Gets a specific item from the inventory.
        ///</summary>
        /// <param name="id">The ID of the inventory item to find</param>
        ///<returns> The specified item</returns>
        ///<response code="200">Item found</response>
        ///<response code="400">There was an issue with the request</response>
        ///<response code="404">No item found for the given id</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<InventoryItem>> GetById(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = await _repo.GetByIdAsync(id);
            if (item == null)
                return NotFound(id);
            return Ok(item);
        }

        ///<summary>
        ///Adds a new entry to the inventory.
        ///</summary>
        ///<returns> The added item</returns>
        ///<response code="200">Item created successfully</response>
        ///<response code="400">The item is invalid</response>
        ///<response code="401">Authentication required</response>
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<InventoryItemDTO>> Add(
            [FromBody] InventoryItemDTO newItem
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = await _repo.CreateAsync(newItem);

            return CreatedAtAction(nameof(GetById), new { id = item.Id }, newItem);
        }

        ///<summary>
        ///Updates the specified item in the inventory.
        ///</summary>
        /// <param name="id">The ID of the inventory item to update</param>
        /// <param name="updatedItem">The updated details of the inventory item</param>
        ///<returns> The updated item</returns>
        ///<response code="200">Item correctly updated</response>
        ///<response code="400">There was an issue with the request</response>
        ///<response code="401">Authentication required</response>
        ///<response code="404">No item found for the given id</response>
        [Authorize]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Update(
            int id,
            [FromBody] InventoryItemDTO updatedItem
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var itemModel = await _repo.UpdateAsync(id, updatedItem);
            if (itemModel == null)
                return NotFound();

            return Ok(itemModel);
        }

        ///<summary>
        ///Deletes an item from the inventory.
        ///</summary>
        /// <param name="id">The ID of the inventory item to delete</param>
        ///<response code="204">Item correctly deleted</response>
        ///<response code="400">There was an issue with the request</response>
        ///<response code="401">Authentication required</response>
        ///<response code="404">No item found for the given id</response>
        [Authorize]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteItem(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = await _repo.DeleteAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
