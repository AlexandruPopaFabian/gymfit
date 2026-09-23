using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using gymfit.Data;
using gymfit.Models;

namespace gymfit.Controllers;

public class SportClassesController : ODataController
{
    [EnableQuery]
    public IActionResult Get()
    {
        return Ok(DataSource.SportClasses);
    }

    [EnableQuery]
    public IActionResult Get(int key)
    {
        var cls = DataSource.SportClasses.FirstOrDefault(c => c.Id == key);
        return cls is null ? NotFound() : Ok(cls);
    }

    // ---------------------- POST ----------------------
    [HttpPost]
    public IActionResult Post([FromBody] SportClass newClass)
    {
        if (newClass == null)
            return BadRequest("Invalid body");

        newClass.Id = DataSource.SportClasses.Any()
            ? DataSource.SportClasses.Max(c => c.Id) + 1
            : 1;

        DataSource.SportClasses.Add(newClass);

        return Created(newClass);
    }

    // ---------------------- DELETE ----------------------
    [HttpDelete]
    public IActionResult Delete([FromRoute] int key)
    {
        var cls = DataSource.SportClasses.FirstOrDefault(c => c.Id == key);

        if (cls == null)
            return NotFound();

        DataSource.SportClasses.Remove(cls);

        return NoContent();
    }
}

