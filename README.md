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

## Publicar (Render, plan gratuito)

El `Dockerfile` de la raíz construye y corre el sitio; respeta la variable `PORT` que asigna el host.
En Render: **New → Web Service**, elegir este repo, runtime **Docker**, plan **Free**. Cada push a `main` vuelve a publicar.

En el plan gratuito el sitio se duerme tras unos minutos sin visitas (la primera carga tarda) y el disco
no es persistente: las solicitudes en `App_Data` se pierden al redeployar.

Fuera del dominio oficial (`Site:BaseUrl`) el sitio se marca `noindex` y `robots.txt` bloquea todo,
así la dirección provisoria no compite en Google con la definitiva.

## Pendiente

- Completar `Site:WhatsApp` (formato `598XXXXXXXX`); el botón de WhatsApp se muestra solo cuando hay número.
- Registrar `daxpress.com.uy` y apuntarlo al hosting.
- Alta en Google Search Console y envío de `/sitemap.xml`.
- Aviso por correo de nuevas solicitudes (hoy quedan en `App_Data/leads.jsonl`).
