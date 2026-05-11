using Microsoft.AspNetCore.OData;
using Microsoft.OData.ModelBuilder;
using gymfit.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// -------------------- LOGGING --------------------
Log.Logger = new LoggerConfiguration()
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// -------------------- ODATA --------------------
var odataBuilder = new ODataConventionModelBuilder();
odataBuilder.EntitySet<SportClass>("SportClasses");
odataBuilder.EntitySet<Trainer>("Trainers");

builder.Services.AddControllers().AddOData(opt =>
    opt.Select().Filter().OrderBy().Expand().Count().SetMaxTop(100)
       .AddRouteComponents("odata", odataBuilder.GetEdmModel()));

// -------------------- CORS --------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();
app.UseExceptionHandler("/error");

// -------------------- MIDDLEWARE --------------------
app.UseCors("AllowReact");

app.MapControllers();

app.UseSerilogRequestLogging();

app.Run();
