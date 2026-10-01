using Daxpress.Web.Content;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Daxpress.Web.Pages.Sectores;

public class DetalleModel : PageModel
{
    public Sector Sector { get; private set; } = null!;

    public IActionResult OnGet(string slug)
    {
        var sector = SiteContent.BuscarSector(slug);
        if (sector is null)
            return NotFound();

        Sector = sector;
        return Page();
    }
}
