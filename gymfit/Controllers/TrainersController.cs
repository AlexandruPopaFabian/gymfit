using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using gymfit.Data;
using gymfit.Models;

namespace gymfit.Controllers;

public class TrainersController : ODataController
{
    [EnableQuery]
    public IActionResult Get()
    {
        return Ok(DataSource.Trainers);
    }

    [EnableQuery]
    public IActionResult Get(int key)
    {
        var trainer = DataSource.Trainers.FirstOrDefault(t => t.Id == key);
        return trainer is null ? NotFound() : Ok(trainer);
    }
    [HttpPost]
    public IActionResult Post([FromBody] Trainer newTrainer)
    {
        if (newTrainer == null)
            return BadRequest("Invalid body");

        newTrainer.Id = DataSource.Trainers.Any()
            ? DataSource.Trainers.Max(t => t.Id) + 1
            : 1;

        DataSource.Trainers.Add(newTrainer);

        return Created(newTrainer);
    }
    [HttpDelete]
    public IActionResult Delete([FromRoute] int key)
    {
        var trainer = DataSource.Trainers.FirstOrDefault(t => t.Id == key);

        if (trainer == null)
            return NotFound();

        DataSource.Trainers.Remove(trainer);

        return NoContent();
    }
}

