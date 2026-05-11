using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using gymfit.Data;
using gymfit.Models;
/*
namespace gymfit.Controllers
{
    public class MembersController : ODataController
    {
        [EnableQuery]
        public IActionResult Get()
        {
            return Ok(DataSource.Members);
        }

        [EnableQuery]
        public IActionResult Get(int key)
        {
            var member = DataSource.Members.FirstOrDefault(m => m.Id == key);
            return member is null ? NotFound() : Ok(member);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Member newMember)
        {
            if (newMember == null)
                return BadRequest("Invalid body");

            newMember.Id = DataSource.Members.Any()
                ? DataSource.Members.Max(m => m.Id) + 1
                : 1;

            DataSource.Members.Add(newMember);

            return Created(newMember);
        }

        [HttpDelete]
        public IActionResult Delete([FromRoute] int key)
        {
            var member = DataSource.Members.FirstOrDefault(m => m.Id == key);

            if (member == null)
                return NotFound();

            DataSource.Members.Remove(member);

            // Reindexare ID-uri
            int newId = 1;
            foreach (var m in DataSource.Members)
                m.Id = newId++;

            return NoContent();
        }
    }
}*/
