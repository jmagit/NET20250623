using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SSRApp.Data;

namespace SSRApp {
    public class Program {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
            builder.Services.AddDbContext<AdventureWorksContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("AdventureWorksConnection"))
                );

            builder.Services.AddDatabaseDeveloperPageExceptionFilter();

            builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddEntityFrameworkStores<ApplicationDbContext>();
            builder.Services.AddControllersWithViews();

            builder.Services.AddControllers().AddXmlSerializerFormatters();
            builder.Services.AddOpenApi(options => {
                options.AddDocumentTransformer((document, context, cancellationToken) => {
                    document.Info = new() {
                        Title = "Demos del curso", Version = "v1", Description = "Un ejemplo simple ASP.NET Core Web API"
                    };
                    return Task.CompletedTask;
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if(app.Environment.IsDevelopment()) {
                app.UseMigrationsEndPoint();
            } else {
                app.UseExceptionHandler("/Home/Error");
            }

            app.MapOpenApi();
            app.UseSwaggerUI(options => {
                options.SwaggerEndpoint("/openapi/v1.json", "v1");
            });

            app.UseRouting();
            app.UseCors("AllowAll");
            app.UseAuthorization();

            app.MapStaticAssets();
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}")
                .WithStaticAssets();
            app.MapRazorPages()
               .WithStaticAssets();
            app.MapGet("/oops", () => "Oops! An error happened.");

            app.Run();
        }
    }
}
