using System.Text.Json;

namespace Daxpress.Web.Content;

public record Lead(
    DateTimeOffset Fecha,
    string Nombre,
    string Empresa,
    string Email,
    string Telefono,
    string Sector,
    string Mensaje);

/// <summary>
/// Guarda las solicitudes de diagnóstico en App_Data/leads.jsonl (una por línea).
/// Alcanza para empezar; después se puede sumar aviso por correo o un CRM.
/// </summary>
public class LeadStore(IWebHostEnvironment env, ILogger<LeadStore> logger)
{
    private static readonly SemaphoreSlim Lock = new(1, 1);
    private readonly string _path = Path.Combine(env.ContentRootPath, "App_Data", "leads.jsonl");

    public async Task GuardarAsync(Lead lead)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(_path)!);
        var linea = JsonSerializer.Serialize(lead) + Environment.NewLine;

        await Lock.WaitAsync();
        try
        {
            await File.AppendAllTextAsync(_path, linea);
        }
        finally
        {
            Lock.Release();
        }

        logger.LogInformation("Nueva solicitud de diagnóstico de {Empresa} ({Email})", lead.Empresa, lead.Email);
    }
}
