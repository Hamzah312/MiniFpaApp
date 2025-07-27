using Microsoft.EntityFrameworkCore;

namespace MiniFPAService;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddAuthorization();
        builder.Services.AddDbContext<MiniFPAService.Data.ApplicationDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
        
        
        builder.Services.AddScoped<MiniFPAService.Repositories.IFinancialRecordRepository, MiniFPAService.Repositories.FinancialRecordRepository>();
        builder.Services.AddScoped<MiniFPAService.Services.IFinancialRecordService, MiniFPAService.Services.FinancialRecordService>();
        builder.Services.AddScoped<MiniFPAService.Services.IExcelService, MiniFPAService.Services.ExcelService>();

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddControllers(); 
        builder.Services.AddEndpointsApiExplorer();
        
        
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhost4200", policy =>
            {
                policy.WithOrigins("http://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        var app = builder.Build();

        // Ensure SQLite database is created if it does not exist
        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MiniFPAService.Data.ApplicationDbContext>();
            db.Database.EnsureCreated();
            
            // Seed demo data
            db.SeedData();
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors("AllowLocalhost4200");
        app.UseAuthorization();
        app.MapControllers();  
        app.Run();
    }
}

