using Microsoft.AspNetCore.Identity;

namespace backend.Interfaces
{
    /// <summary>
    /// Service for creating JWT tokens for authenticated users.
    /// </summary>
    public interface ITokenService
    {
        /// <summary>
        /// Creates a signed JWT for the given user.
        /// </summary>
        /// <param name="user">The user to generate a token for.</param>
        /// <returns>A signed JWT string.</returns>
        string CreateToken(IdentityUser user);
    }
}
