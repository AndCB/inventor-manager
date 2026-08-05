using backend.Controllers;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backendTests.Controller
{
    public class AuthControllerTests
    {
        private readonly Mock<UserManager<IdentityUser>> _mockUserManager;
        private readonly Mock<ITokenService> _mockTokenService;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            var store = new Mock<IUserStore<IdentityUser>>();
            _mockUserManager = new Mock<UserManager<IdentityUser>>(
                store.Object,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );
            _mockTokenService = new Mock<ITokenService>();
            _controller = new AuthController(_mockUserManager.Object, _mockTokenService.Object);
        }

        [Fact]
        public async Task Register_ReturnsOkWithToken_WhenUserIsNew()
        {
            // Arrange
            var registerDto = new RegisterDTO { Username = "newuser", Password = "Passw0rd!" };
            _mockUserManager
                .Setup(um => um.FindByNameAsync("newuser"))
                .ReturnsAsync((IdentityUser?)null);
            _mockUserManager
                .Setup(um => um.CreateAsync(It.IsAny<IdentityUser>(), "Passw0rd!"))
                .ReturnsAsync(IdentityResult.Success);
            _mockTokenService
                .Setup(ts => ts.CreateToken(It.IsAny<IdentityUser>()))
                .Returns("test-token");

            // Act
            var result = await _controller.Register(registerDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<AuthResponseDTO>(okResult.Value);
            Assert.Equal("test-token", response.Token);
            Assert.Equal("newuser", response.Username);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            var registerDto = new RegisterDTO { Username = "newuser", Password = "Passw0rd!" };
            _controller.ModelState.AddModelError("Username", "The Username field is required.");

            // Act
            var result = await _controller.Register(registerDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _mockUserManager.Verify(
                um => um.CreateAsync(It.IsAny<IdentityUser>(), It.IsAny<string>()),
                Times.Never
            );
        }

        [Fact]
        public async Task Register_ReturnsConflict_WhenUsernameIsTaken()
        {
            // Arrange
            var registerDto = new RegisterDTO { Username = "existing", Password = "Passw0rd!" };
            var existingUser = new IdentityUser { UserName = "existing" };
            _mockUserManager
                .Setup(um => um.FindByNameAsync("existing"))
                .ReturnsAsync(existingUser);

            // Act
            var result = await _controller.Register(registerDto);

            // Assert
            Assert.IsType<ConflictObjectResult>(result.Result);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenPasswordPolicyFails()
        {
            // Arrange
            var registerDto = new RegisterDTO { Username = "newuser", Password = "weak" };
            _mockUserManager
                .Setup(um => um.FindByNameAsync("newuser"))
                .ReturnsAsync((IdentityUser?)null);
            _mockUserManager
                .Setup(um => um.CreateAsync(It.IsAny<IdentityUser>(), "weak"))
                .ReturnsAsync(
                    IdentityResult.Failed(
                        new IdentityError
                        {
                            Description = "Passwords must have at least one uppercase ('A'-'Z').",
                        }
                    )
                );

            // Act
            var result = await _controller.Register(registerDto);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errors = Assert.IsAssignableFrom<IEnumerable<string>>(badRequest.Value);
            Assert.Contains("Passwords must have at least one uppercase ('A'-'Z').", errors);
        }

        [Fact]
        public async Task Login_ReturnsOkWithToken_WhenCredentialsAreValid()
        {
            // Arrange
            var loginDto = new LoginDTO { Username = "tester", Password = "Passw0rd!" };
            var user = new IdentityUser { Id = "user-1", UserName = "tester" };
            _mockUserManager.Setup(um => um.FindByNameAsync("tester")).ReturnsAsync(user);
            _mockUserManager
                .Setup(um => um.CheckPasswordAsync(user, "Passw0rd!"))
                .ReturnsAsync(true);
            _mockTokenService.Setup(ts => ts.CreateToken(user)).Returns("test-token");

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<AuthResponseDTO>(okResult.Value);
            Assert.Equal("test-token", response.Token);
            Assert.Equal("tester", response.Username);
        }

        [Fact]
        public async Task Login_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            var loginDto = new LoginDTO { Username = "tester", Password = "Passw0rd!" };
            _controller.ModelState.AddModelError("Username", "The Username field is required.");

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _mockUserManager.Verify(
                um => um.CheckPasswordAsync(It.IsAny<IdentityUser>(), It.IsAny<string>()),
                Times.Never
            );
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenPasswordIsWrong()
        {
            // Arrange
            var loginDto = new LoginDTO { Username = "tester", Password = "WrongPass1!" };
            var user = new IdentityUser { UserName = "tester" };
            _mockUserManager.Setup(um => um.FindByNameAsync("tester")).ReturnsAsync(user);
            _mockUserManager
                .Setup(um => um.CheckPasswordAsync(user, "WrongPass1!"))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenUserDoesNotExist()
        {
            // Arrange
            var loginDto = new LoginDTO { Username = "ghost", Password = "Passw0rd!" };
            _mockUserManager
                .Setup(um => um.FindByNameAsync("ghost"))
                .ReturnsAsync((IdentityUser?)null);

            // Act
            var result = await _controller.Login(loginDto);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }
    }
}
