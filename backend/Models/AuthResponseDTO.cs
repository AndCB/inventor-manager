namespace backend.Models
{
    /// <summary>
    /// Payload returned after a successful login or registration.
    /// </summary>
    public class AuthResponseDTO
    {
        /// <summary>
        /// The signed JWT used to authorize protected requests.
        /// </summary>
        public required string Token { get; set; }

        /// <summary>
        /// The username of the authenticated account.
        /// </summary>
        public required string Username { get; set; }
    }
}
