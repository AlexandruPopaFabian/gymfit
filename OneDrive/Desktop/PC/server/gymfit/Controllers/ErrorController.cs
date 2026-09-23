using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace gymfit.Controllers
{
    [ApiController]
    public class ErrorController : ControllerBase
    {
        [Route("error")]
        public IActionResult HandleError()
        {
            var exception = HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;

            if (exception != null)
            {
                Log.Error(exception, "Unhandled exception caught by global handler");
            }

            return Problem(
                title: "A server error occurred",
                detail: exception?.Message
            );
        }
    }
}
