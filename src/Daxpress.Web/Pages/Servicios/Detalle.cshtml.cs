using Daxpress.Web.Content;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Daxpress.Web.Pages.Servicios;

public class DetalleModel : PageModel
{
    public Servicio Servicio { get; private set; } = null!;

    public IActionResult OnGet(string slug)
    {
        var servicio = SiteContent.BuscarServicio(slug);
        if (servicio is null)
            return NotFound();

        Servicio = servicio;
        return Page();
    }
}
