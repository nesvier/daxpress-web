namespace Daxpress.Web.Content;

/// <summary>Datos de contacto y URL pública, configurables en appsettings.json ("Site").</summary>
public class SiteOptions
{
    public string BaseUrl { get; set; } = "https://daxpress.com.uy";
    public string Email { get; set; } = "";
    /// <summary>Número en formato internacional sin "+" ni espacios, p. ej. 59899123456. Vacío oculta el botón.</summary>
    public string WhatsApp { get; set; } = "";
    public string Ciudad { get; set; } = "Montevideo";

    /// <summary>
    /// Solo el dominio oficial se deja indexar; direcciones provisorias (onrender.com, localhost)
    /// quedan fuera de Google para no duplicar contenido.
    /// </summary>
    public bool EsDominioOficial(HttpRequest request) =>
        string.Equals(request.Host.Host, new Uri(BaseUrl).Host, StringComparison.OrdinalIgnoreCase);

    public string WhatsAppUrl(string mensaje = "Hola Daxpress, quiero agendar un diagnóstico sin costo.") =>
        $"https://wa.me/{WhatsApp}?text={Uri.EscapeDataString(mensaje)}";
}
