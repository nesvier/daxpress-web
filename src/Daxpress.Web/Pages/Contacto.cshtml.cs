using System.ComponentModel.DataAnnotations;
using Daxpress.Web.Content;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Daxpress.Web.Pages;

public class ContactoModel(LeadStore leads) : PageModel
{
    [BindProperty]
    public SolicitudDiagnostico Solicitud { get; set; } = new();

    /// <summary>Campo trampa invisible: si viene con texto, lo completó un bot.</summary>
    [BindProperty]
    public string? Web { get; set; }

    public bool Enviado { get; private set; }

    public void OnGet(string? sector)
    {
        if (sector is not null && SiteContent.BuscarSector(sector) is not null)
            Solicitud.Sector = sector;
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!string.IsNullOrEmpty(Web))
        {
            Enviado = true;
            return Page();
        }

        if (!ModelState.IsValid)
            return Page();

        await leads.GuardarAsync(new Lead(
            DateTimeOffset.Now,
            Solicitud.Nombre.Trim(),
            Solicitud.Empresa.Trim(),
            Solicitud.Email.Trim(),
            Solicitud.Telefono?.Trim() ?? "",
            Solicitud.Sector ?? "",
            Solicitud.Mensaje.Trim()));

        Enviado = true;
        return Page();
    }
}

public class SolicitudDiagnostico
{
    [Required(ErrorMessage = "Contanos tu nombre.")]
    [StringLength(100)]
    public string Nombre { get; set; } = "";

    [Required(ErrorMessage = "Indicá el nombre de tu empresa.")]
    [StringLength(120)]
    public string Empresa { get; set; } = "";

    [Required(ErrorMessage = "Necesitamos un correo para responderte.")]
    [EmailAddress(ErrorMessage = "Ese correo no parece válido.")]
    [StringLength(160)]
    public string Email { get; set; } = "";

    [Phone(ErrorMessage = "Ese teléfono no parece válido.")]
    [StringLength(30)]
    public string? Telefono { get; set; }

    public string? Sector { get; set; }

    [Required(ErrorMessage = "Contanos brevemente qué tarea te gustaría automatizar.")]
    [StringLength(2000)]
    public string Mensaje { get; set; } = "";
}
