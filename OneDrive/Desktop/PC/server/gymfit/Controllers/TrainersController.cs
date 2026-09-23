using gymfit.Data;
using gymfit.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace gymfit.Controllers;

[EnableCors("AllowReact")]
public class TrainersController : ODataController
{
    private readonly GymFitContext _context;

    public TrainersController(GymFitContext context)
    {
        _context = context;
    }

    [EnableQuery]
    public IActionResult Get()
    {
        // 🔥 ADAUGAT: .Include(t => t.Classes) pentru a include lista de clase în răspunsul JSON
        return Ok(_context.Users.OfType<Trainer>().Include(t => t.Classes));
    }

    [EnableQuery]
    public IActionResult Get(int key)
    {
        // 🔥 ADAUGAT: .Include(t => t.Classes) pentru detalii antrenor
        var trainer = _context.Users.OfType<Trainer>()
            .Include(t => t.Classes)
            .FirstOrDefault(t => t.Id == key);

        return trainer is null ? NotFound() : Ok(trainer);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Post([FromBody] Trainer newTrainer)
    {
        if (newTrainer == null || string.IsNullOrEmpty(newTrainer.Name) || string.IsNullOrEmpty(newTrainer.Email))
        {
            return BadRequest("Name and Email are required fields for a trainer.");
        }

        if (!string.IsNullOrEmpty(newTrainer.PasswordHash))
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(newTrainer.PasswordHash));
                newTrainer.PasswordHash = Convert.ToBase64String(bytes);
            }
        }
        else
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes("TrainerDefault123!"));
                newTrainer.PasswordHash = Convert.ToBase64String(bytes);
            }
        }

        if (newTrainer.Classes != null && newTrainer.Classes.Count > 0)
        {
            var attachedClasses = new List<SportClass>();
            foreach (var sportClass in newTrainer.Classes)
            {
                var existingClass = await _context.SportClasses.FindAsync(sportClass.Id);
                if (existingClass != null)
                {
                    attachedClasses.Add(existingClass);
                }
            }
            newTrainer.Classes = attachedClasses;
        }

        _context.Users.Add(newTrainer);
        await _context.SaveChangesAsync();

        return Created(newTrainer);
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int key)
    {
        // 1. Încărcăm antrenorul împreună cu colecția sa de clase
        var trainer = await _context.Users.OfType<Trainer>()
            .Include(t => t.Classes)
            .FirstOrDefaultAsync(t => t.Id == key);

        if (trainer == null)
            return NotFound();

        // 2. În Many-to-Many, golim colecția de clase pentru a curăța tabela de legătură (SportClassTrainer)
        trainer.Classes.Clear();

        // 3. Ștergem antrenorul din baza de date
        _context.Users.Remove(trainer);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}