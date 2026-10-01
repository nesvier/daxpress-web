using System.Text;
using Daxpress.Web.Content;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<SiteOptions>(builder.Configuration.GetSection("Site"));
builder.Services.AddSingleton<LeadStore>();
builder.Services.AddRouting(o => o.LowercaseUrls = true);
builder.Services.AddResponseCompression(o => o.EnableForHttps = true);
builder.Services.AddRazorPages();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseResponseCompression();
app.UseStatusCodePagesWithReExecute("/no-encontrado");
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
        ctx.Context.Response.Headers.CacheControl = "public,max-age=604800",
});
app.UseRouting();
app.MapRazorPages();

app.MapGet("/robots.txt", (HttpRequest request, IOptions<SiteOptions> site) =>
    site.Value.EsDominioOficial(request)
        ? Results.Text($"User-agent: *\nAllow: /\n\nSitemap: {site.Value.BaseUrl}/sitemap.xml\n", "text/plain")
        : Results.Text("User-agent: *\nDisallow: /\n", "text/plain"));

app.MapGet("/sitemap.xml", (IOptions<SiteOptions> site) =>
{
    var rutas = new List<string> { "/", "/servicios", "/sectores", "/casos", "/blog", "/contacto" };
    rutas.AddRange(SiteContent.Servicios.Select(s => $"/servicios/{s.Slug}"));
    rutas.AddRange(SiteContent.Sectores.Select(s => $"/sectores/{s.Slug}"));
    rutas.AddRange(SiteContent.Blog.Select(a => $"/blog/{a.Slug}"));

    var xml = new StringBuilder("""<?xml version="1.0" encoding="UTF-8"?>""");
    xml.Append("""<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">""");
    foreach (var ruta in rutas)
        xml.Append($"<url><loc>{site.Value.BaseUrl}{ruta}</loc></url>");
    xml.Append("</urlset>");
    return Results.Text(xml.ToString(), "application/xml");
});

app.Run();
