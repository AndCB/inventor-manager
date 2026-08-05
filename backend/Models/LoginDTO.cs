using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    /// <summary>
    /// Data required to log in to an existing account.
    /// </summary>
    public class LoginDTO
    {
        /// <summary>
        /// The account's username.
        /// </summary>
        [Required]
        public required string Username { get; set; }

        /// <summary>
        /// The account's password.
        /// </summary>
        [Required]
        public required string Password { get; set; }
    }
}
