using gymfit.Data;
using gymfit.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

namespace gymfit.Controllers;

public class ClassSchedulesController : ODataController
{
    private readonly GymFitContext _context;

    public ClassSchedulesController(GymFitContext context)
    {
        _context = context;
    }

    [EnableQuery]
    public IActionResult Get()
    {
        return Ok(_context.ClassSchedules);
    }

    [EnableQuery]
    public IActionResult Get(int key)
    {
        var schedule = _context.ClassSchedules.FirstOrDefault(s => s.Id == key);
        return schedule is null ? NotFound() : Ok(schedule);
    }

    [HttpPost]
    [Authorize(Roles = "Trainer")]
    public async Task<IActionResult> Post([FromBody] ClassSchedule newSchedule)
    {
        if (newSchedule == null)
            return BadRequest("Invalid body");

        if (newSchedule.StartTime >= newSchedule.EndTime)
        {
            return BadRequest("Start time must be strictly before end time.");
        }

        var utcStart = newSchedule.StartTime.Kind == DateTimeKind.Utc
            ? newSchedule.StartTime
            : newSchedule.StartTime.ToUniversalTime();

        var utcEnd = newSchedule.EndTime.Kind == DateTimeKind.Utc
            ? newSchedule.EndTime
            : newSchedule.EndTime.ToUniversalTime();

        // Overlap check
        bool isOverlapping = await _context.ClassSchedules
            .AnyAsync(s => utcStart < s.EndTime && utcEnd > s.StartTime);

        if (isOverlapping)
        {
            return BadRequest("This time slot is already taken! Please choose another hour or day.");
        }

        // Store as UTC
        newSchedule.StartTime = utcStart;
        newSchedule.EndTime = utcEnd;

        _context.ClassSchedules.Add(newSchedule);
        await _context.SaveChangesAsync();

        return Created(newSchedule);
    }
}