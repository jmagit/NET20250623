using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SSRApp.Data;
using System;
using System.Net.Http;
using System.Security.Cryptography;

namespace SSRApp {

    public class Program {
        private static async Task<RsaSecurityKey> PedirClavePublica(string url) {
            var httpClient = new HttpClient();
            var rsa = RSA.Create();
            var response = await httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var pem = await response.Content.ReadAsStringAsync();
            rsa.ImportFromPem(pem.ToCharArray());
            return new RsaSecurityKey(rsa);
        }
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

            // Configuración de la autenticación JWT Bearer
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(async options => {
                    options.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuer = true, // Valida el emisor del token
                        ValidateAudience = true, // Valida la audiencia del token
                        ValidateLifetime = true, // Valida la fecha de expiración del token
                        ValidateIssuerSigningKey = true, // MUY IMPORTANTE: Valida la firma del token

                        // Obtener la configuración desde appsettings.json
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        // Especificamos la clave pública para la validación de la firma (RS256)
                        IssuerSigningKey = await PedirClavePublica("http://localhost:5039/Auth/publickey"),

                        ClockSkew = TimeSpan.Zero // Elimina la tolerancia de tiempo por defecto (5 minutos)
                    };
                });
            builder.Services.AddAuthorization(); // Habilita la autorización

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

            app.UseAuthentication();
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
