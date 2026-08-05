using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    /// <summary>
    /// Data required to register a new account.
    /// </summary>
    public class RegisterDTO
    {
        /// <summary>
        /// The desired username for the new account.
        /// </summary>
        [Required]
        [MinLength(3, ErrorMessage = "Username must be at least 3 characters long.")]
        public required string Username { get; set; }

        /// <summary>
        /// The password for the new account.
        /// </summary>
        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public required string Password { get; set; }
    }
}
