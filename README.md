# Daxpress — sitio web

Sitio de Daxpress (automatización y software a medida para pymes, Montevideo).
ASP.NET Core 8 Razor Pages, HTML renderizado en servidor, sin JavaScript ni librerías de terceros.

## Correr en local

```bash
dotnet run --project src/Daxpress.Web
```

Abre en http://localhost:5180.

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Servicios, sectores, casos y blog (textos y SEO) | `src/Daxpress.Web/Content/SiteContent.cs` |
| Correo, WhatsApp y URL pública | `appsettings.json` → sección `Site` |
| Páginas | `src/Daxpress.Web/Pages` (`/servicios/{slug}`, `/sectores/{slug}`) |
| Estilos | `src/Daxpress.Web/wwwroot/css/site.css` |
| Solicitudes de diagnóstico | `src/Daxpress.Web/App_Data/leads.jsonl` (fuera de git) |

`/sitemap.xml` y `/robots.txt` se generan solos a partir del contenido.
Al agregar un servicio, sector o artículo en `SiteContent.cs`, su página y su entrada en el sitemap aparecen automáticamente.

## Pendiente antes de publicar

- Completar `Site:Email` y `Site:WhatsApp` (formato `598XXXXXXXX`); el botón de WhatsApp se muestra solo cuando hay número.
- Registrar el dominio y ajustar `Site:BaseUrl`.
- Alta en Google Search Console y envío de `/sitemap.xml`.
- Aviso por correo de nuevas solicitudes (hoy quedan en `App_Data/leads.jsonl`).
