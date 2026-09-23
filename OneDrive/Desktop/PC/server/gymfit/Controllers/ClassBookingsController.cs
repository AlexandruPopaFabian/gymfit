using gymfit.Data;
using gymfit.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace gymfit.Controllers;

public class ClassBookingsController : ODataController
{
    private readonly GymFitContext _context;

    public ClassBookingsController(GymFitContext context)
    {
        _context = context;
    }

    [EnableQuery]
    public IActionResult Get()
    {
        return Ok(_context.Set<ClassBooking>());
    }

    [Authorize]
    public async Task<IActionResult> Post([FromBody] ClassBookingDto request)
    {
        if (request == null)
            return BadRequest("Invalid body");

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized("Expired session or invalid token.");
        }

        int loggedInUserId = int.Parse(userIdClaim);

        // VERIFICARE: Are utilizatorul un abonament activ în acest moment?
        // Verificăm dacă există vreun abonament în tabela de legătură unde EndDate este în viitor
        bool hasActiveMembership = await _context.Set<UserMembership>()
            .AnyAsync(um => um.UserId == loggedInUserId && um.EndDate >= DateTime.UtcNow);

        if (!hasActiveMembership)
        {
            return BadRequest("Access Denied! You do not have an active membership. Please purchase one first.");
        }

        // 2. Verificările tale existente rămân la fel:
        var scheduleExists = await _context.ClassSchedules.AnyAsync(cs => cs.Id == request.ClassScheduleId);
        if (!scheduleExists) return NotFound("Class schedule not found.");

        var alreadyBooked = await _context.Set<ClassBooking>()
            .AnyAsync(cb => cb.UserId == loggedInUserId && cb.ClassScheduleId == request.ClassScheduleId);

        if (alreadyBooked)
        {
            return BadRequest("You have already booked a spot for this class!");
        }

        // 3. Salvarea rezervării
        var booking = new ClassBooking
        {
            UserId = loggedInUserId,
            ClassScheduleId = request.ClassScheduleId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Set<ClassBooking>().Add(booking);
        await _context.SaveChangesAsync();

        return Created(booking);
    }
    [Authorize]
    public async Task<IActionResult> Delete([FromODataUri] int key)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized("Expired session or invalid token.");
        }

        int loggedInUserId = int.Parse(userIdClaim);

        var booking = await _context.Set<ClassBooking>().FindAsync(key);
        if (booking == null)
        {
            return NotFound("Booking not found.");
        }

        if (booking.UserId != loggedInUserId)
        {
            return Unauthorized("You do not have permission to cancel this booking.");
        }

        _context.Set<ClassBooking>().Remove(booking);
        await _context.SaveChangesAsync();

        return NoContent(); 
    }
}

public class ClassBookingDto
{
    public int ClassScheduleId { get; set; }
}