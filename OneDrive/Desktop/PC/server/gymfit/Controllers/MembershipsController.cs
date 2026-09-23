using gymfit.Data;
using gymfit.Models;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;             

namespace gymfit.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembershipsController : ControllerBase
{
    private readonly GymFitContext _context;

    public MembershipsController(GymFitContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var memberships = await _context.Set<Membership>().ToListAsync();
        return Ok(memberships);
    }

    [HttpPost("subscribe")]
    [Authorize] 
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "Invalid session." });
        }

        int loggedInUserId = int.Parse(userIdClaim);

        var membership = await _context.Set<Membership>().FindAsync(request.MembershipId);
        if (membership == null) return NotFound(new { message = "Membership not found" });

        var activeSub = await _context.Set<UserMembership>()
            .FirstOrDefaultAsync(um => um.UserId == loggedInUserId && um.EndDate > DateTime.UtcNow);

        if (activeSub != null)
        {
            return BadRequest(new { message = "You already have an active membership." });
        }

        var userMembership = new UserMembership
        {
            UserId = loggedInUserId,
            MembershipId = request.MembershipId,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(membership.DurationDays)
        };

        _context.Set<UserMembership>().Add(userMembership);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"You have successfully subscribed to {membership.Name}!" });
    }
}

public class SubscribeRequest
{
    public int MembershipId { get; set; }
}