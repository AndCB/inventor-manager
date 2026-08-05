using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for handling account registration and login.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(
        UserManager<IdentityUser> userManager,
        ITokenService tokenService
    ) : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager = userManager;
        private readonly ITokenService _tokenService = tokenService;

        /// <summary>
        /// Registers a new account and returns a JWT so the user is logged in immediately.
        /// </summary>
        /// <param name="registerDto">The username and password for the new account.</param>
        /// <returns>A JWT token and the registered username.</returns>
        /// <response code="200">Account created and token issued</response>
        /// <response code="400">Invalid input or password policy not met</response>
        /// <response code="409">The username is already taken</response>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<AuthResponseDTO>> Register(
            [FromBody] RegisterDTO registerDto
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByNameAsync(registerDto.Username);
            if (existingUser != null)
                return Conflict(new { message = "Username is already taken." });

            var user = new IdentityUser { UserName = registerDto.Username };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(error => error.Description));

            var token = _tokenService.CreateToken(user);
            return Ok(new AuthResponseDTO { Token = token, Username = user.UserName! });
        }

        /// <summary>
        /// Logs in an existing account and returns a JWT.
        /// </summary>
        /// <param name="loginDto">The username and password of the account.</param>
        /// <returns>A JWT token and the username.</returns>
        /// <response code="200">Login successful, token issued</response>
        /// <response code="400">Invalid input</response>
        /// <response code="401">Invalid username or password</response>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<AuthResponseDTO>> Login([FromBody] LoginDTO loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized(new { message = "Invalid username or password." });

            var token = _tokenService.CreateToken(user);
            return Ok(new AuthResponseDTO { Token = token, Username = user.UserName! });
        }
    }
}
