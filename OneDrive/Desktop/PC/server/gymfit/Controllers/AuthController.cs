using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using gymfit.Models;
using gymfit.Data;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace gymfit.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly GymFitContext _context;

        public AuthController(IConfiguration configuration, GymFitContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            string userEmail = string.Empty;
            string userRole = string.Empty;
            string userName = string.Empty;
            bool isAuthenticated = false;
            int currentUserId = 0;

            string hashedPassword = string.Empty;
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(model.Password);
                byte[] hashBytes = sha256.ComputeHash(passwordBytes);
                hashedPassword = Convert.ToBase64String(hashBytes);
            }

            var admin = _context.Set<Admin>().FirstOrDefault(a => a.Email == model.Email && a.PasswordHash == hashedPassword);
            if (admin != null)
            {
                currentUserId = admin.Id;
                userEmail = admin.Email;
                userRole = "Admin";
                userName = admin.Name ?? "System Admin";
                isAuthenticated = true;
            }

            if (!isAuthenticated)
            {
                var trainer = _context.Set<Trainer>().FirstOrDefault(t => t.Email == model.Email && t.PasswordHash == hashedPassword);
                if (trainer != null)
                {
                    currentUserId = trainer.Id;
                    userEmail = trainer.Email;
                    userRole = "Trainer";
                    userName = trainer.Name;
                    isAuthenticated = true;
                }
            }

            if (!isAuthenticated)
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == model.Email && u.PasswordHash == hashedPassword);
                if (user != null)
                {
                    currentUserId = user.Id;
                    userEmail = user.Email ?? model.Email;
                    userRole = "Client";
                    userName = user.Name ?? user.Email?.Split('@')[0] ?? "User";
                    isAuthenticated = true;
                }
            }

            if (isAuthenticated)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "CheiaTaSecretaFoarteLungaSiSecurizata123!");

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, currentUserId.ToString()),
                        new Claim(ClaimTypes.Email, userEmail),
                        new Claim(ClaimTypes.Role, userRole),
                        new Claim(ClaimTypes.Name, userName)
                    }),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                    Issuer = _configuration["Jwt:Issuer"] ?? "ServerulTauGymFit",
                    Audience = _configuration["Jwt:Audience"] ?? "ClientulTauReact"
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new
                {
                    message = "Login successful!",
                    id = currentUserId,
                    email = userEmail,
                    role = userRole,
                    name = userName,
                    token = tokenString
                });
            }

            return Unauthorized(new { message = "Invalid email or password" });
        }

        [HttpPost("signup")]
        public IActionResult Signup([FromBody] RegisterModel model)
        {
            var userExists = _context.Users.Any(u => u.Email == model.Email);
            if (userExists)
            {
                return BadRequest(new { message = "This email is already registered!" });
            }
            string hashedPassword = string.Empty;
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(model.Password);
                byte[] hashBytes = sha256.ComputeHash(passwordBytes);
                hashedPassword = Convert.ToBase64String(hashBytes);
            }

            var newUser = new User
            {
                Email = model.Email,
                PasswordHash = hashedPassword,
                Name = model.Email.Split('@')[0]
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok(new { message = "Account created successfully!" });
        }

        [HttpGet("my-account")]
        [Authorize]
        public IActionResult GetMyAccountDetails()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { message = "Invalid session." });
            }

            int userId = int.Parse(userIdClaim);

            // Căutăm utilizatorul de bază
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

           
            var assignedClassesPayload = new List<object>();
            var trainerEntity = _context.Users.OfType<Trainer>()
                .Include(t => t.Classes)
                .FirstOrDefault(t => t.Id == userId);

            if (trainerEntity != null && trainerEntity.Classes != null)
            {
                foreach (var sc in trainerEntity.Classes)
                {
                    assignedClassesPayload.Add(new
                    {
                        id = sc.Id,
                        name = sc.Name
                    });
                }
            }

            var activeMembership = _context.Set<UserMembership>()
                .Where(um => um.UserId == user.Id && um.EndDate >= DateTime.UtcNow)
                .Include(um => um.Membership)
                .OrderByDescending(um => um.EndDate)
                .Select(um => new
                {
                    um.Membership.Name,
                    um.Membership.Price,
                    ExpiresAt = um.EndDate
                })
                .FirstOrDefault();

            var myBookedClasses = _context.Set<ClassBooking>()
                .Where(cb => cb.UserId == user.Id)
                .Include(cb => cb.ClassSchedule)
                    .ThenInclude(cs => cs.SportClass)
                .OrderBy(cb => cb.ClassSchedule.StartTime)
                .Select(cb => new
                {
                    BookingId = cb.Id,
                    ClassName = cb.ClassSchedule.SportClass.Name,
                    StartTime = cb.ClassSchedule.StartTime,
                    EndTime = cb.ClassSchedule.EndTime
                })
                .ToList();

            return Ok(new
            {
                name = user.Name,
                email = user.Email,
                membership = activeMembership ?? (object)new { Name = "No active membership", Price = 0, ExpiresAt = (DateTime?)null },
                classes = myBookedClasses,
                assignedClasses = assignedClassesPayload // Trimitem listele de clase dedicate strict antrenorului
            });
        }

        public class LoginModel
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class RegisterModel
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}