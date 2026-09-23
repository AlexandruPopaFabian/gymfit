using gymfit.Data;
using gymfit.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

namespace gymfit.Controllers;

[EnableCors("AllowReact")]
public class SportClassesController : ODataController
{
    private readonly GymFitContext _context;

    public SportClassesController(GymFitContext context)
    {
        _context = context;
    }

    [EnableQuery]
    public IActionResult Get()
    {
        // 🔥 Include pentru ca OData să poată folosi $expand=Trainers sau să returneze antrenorii
        return Ok(_context.SportClasses.Include(c => c.Trainers));
    }

    [EnableQuery]
    public IActionResult Get(int key)
    {
        var cls = _context.SportClasses
            .Include(c => c.Trainers)
            .FirstOrDefault(c => c.Id == key);

        return cls is null ? NotFound() : Ok(cls);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Post([FromBody] SportClass sportClass)
    {
        // 🔥 Curățăm toate erorile de validare generate pe colecția de antrenori trimiși doar cu ID
        var keysToRemove = ModelState.Keys.Where(k => k.StartsWith("Trainers")).ToList();
        foreach (var key in keysToRemove)
        {
            ModelState.Remove(key);
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (sportClass.Trainers != null && sportClass.Trainers.Any())
        {
            var trainerIds = sportClass.Trainers.Select(t => t.Id).ToList();

            var existingTrainers = await _context.Users.OfType<Trainer>()
                .Where(t => trainerIds.Contains(t.Id))
                .ToListAsync();

            sportClass.Trainers = existingTrainers;
        }
        else
        {
            sportClass.Trainers = new List<Trainer>();
        }

        _context.SportClasses.Add(sportClass);
        await _context.SaveChangesAsync();

        return Created(sportClass);
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int key)
    {
        // Încărcăm clasa împreună cu colecția sa de antrenori
        var cls = await _context.SportClasses
            .Include(c => c.Trainers)
            .FirstOrDefaultAsync(c => c.Id == key);

        if (cls == null)
            return NotFound();

        // Curățăm legăturile din tabela intermediară (SportClassTrainer)
        cls.Trainers.Clear();

        _context.SportClasses.Remove(cls);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}