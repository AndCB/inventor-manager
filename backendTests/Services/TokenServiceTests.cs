using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace backendTests.Services
{
    public class TokenServiceTests
    {
        private const string TestKey =
            "a-very-long-test-secret-key-that-is-at-least-32-characters-long";
        private const string TestIssuer = "TestIssuer";
        private const string TestAudience = "TestAudience";

        private static IConfiguration CreateConfig() =>
            new ConfigurationBuilder()
                .AddInMemoryCollection(
                    new Dictionary<string, string?>
                    {
                        ["JWT:Key"] = TestKey,
                        ["JWT:Issuer"] = TestIssuer,
                        ["JWT:Audience"] = TestAudience,
                    }
                )
                .Build();

        [Fact]
        public void CreateToken_ContainsUserClaims_IssuerAndAudience()
        {
            // Arrange
            var user = new IdentityUser { Id = "user-id-123", UserName = "tester" };
            var service = new TokenService(CreateConfig());

            // Act
            var token = service.CreateToken(user);
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

            // Assert
            Assert.Equal(
                "user-id-123",
                jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value
            );
            Assert.Equal(
                "tester",
                jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.UniqueName).Value
            );
            Assert.Equal(TestIssuer, jwt.Issuer);
            Assert.Equal(TestAudience, jwt.Audiences.First());
            Assert.Equal(SecurityAlgorithms.HmacSha256, jwt.Header.Alg);
        }

        [Fact]
        public void CreateToken_ReturnsToken_ThatExpiresInOneDay()
        {
            // Arrange
            var user = new IdentityUser { Id = "user-id-123", UserName = "tester" };
            var service = new TokenService(CreateConfig());
            var oneDayAgo = DateTime.UtcNow.AddDays(1).AddSeconds(-30);
            var oneDayFromNow = DateTime.UtcNow.AddDays(1).AddSeconds(30);

            // Act
            var token = service.CreateToken(user);
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

            // Assert
            var expires = jwt.ValidTo.ToUniversalTime();
            Assert.True(expires > oneDayAgo && expires < oneDayFromNow);
        }

        [Fact]
        public void CreateToken_ProducesToken_ThatValidatesAgainstTheConfiguredKey()
        {
            // Arrange
            var user = new IdentityUser { Id = "user-id-123", UserName = "tester" };
            var service = new TokenService(CreateConfig());
            var token = service.CreateToken(user);

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestKey)),
                ValidateIssuer = true,
                ValidIssuer = TestIssuer,
                ValidateAudience = true,
                ValidAudience = TestAudience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
            };

            // Act
            var principal = new JwtSecurityTokenHandler().ValidateToken(
                token,
                validationParameters,
                out _
            );

            // Assert
            Assert.NotNull(principal);
            Assert.Equal("tester", principal.FindFirst(ClaimTypes.Name)?.Value);
        }
    }
}
