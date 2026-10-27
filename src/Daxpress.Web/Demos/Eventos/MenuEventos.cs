namespace Daxpress.Web.Demos.Eventos;

/// <summary>
/// Plato de la demo. Precios por unidad en pesos uruguayos; <see cref="Pack"/> = de a cuántas unidades se vende.
/// </summary>
public record PlatoDemo(
    string Id,
    string Nombre,
    string Descripcion,
    string Categoria,
    decimal Costo,
    decimal Precio,
    int Pack);

/// <summary>
/// Platos de ejemplo con los que arranca la demo. Lo que el cliente crea o edita se guarda en su navegador.
/// </summary>
public static class MenuEventos
{
    public static readonly IReadOnlyList<PlatoDemo> PlatosEjemplo =
    [
        new("ent-mixtos", "Sándwiches mixtos", "Jamón y queso en pan de miga.", "entradas", 22, 45, 25),
        new("ent-brusquetas", "Brusquetas de tomate y albahaca", "Pan de campo tostado, tomate fresco y oliva.", "entradas", 20, 40, 12),
        new("ent-empanaditas", "Empanaditas de carne", "Carne cortada a cuchillo, horneadas.", "entradas", 28, 55, 12),
        new("ent-ceviche", "Ceviche en cucharita", "Pescado blanco, cítricos y cebolla morada.", "entradas", 45, 90, 12),
        new("ent-caprese", "Brochette caprese", "Tomate cherry, mozzarella y albahaca.", "entradas", 25, 50, 12),
        new("ent-tabla", "Tabla de quesos y fiambres", "Rinde 10 personas.", "entradas", 950, 1800, 1),

        new("cal-hamburguesas", "Mini hamburguesas", "Pan brioche, cheddar y cebolla caramelizada.", "calientes", 55, 110, 12),
        new("cal-pollo", "Brochettes de pollo", "Pollo marinado con vegetales grillados.", "calientes", 48, 95, 12),
        new("cal-chorizo", "Mini choripán", "Chorizo a la parrilla con chimichurri.", "calientes", 50, 100, 12),
        new("cal-pizzetas", "Mini pizzetas", "Muzzarella, tomate y orégano.", "calientes", 30, 60, 12),
        new("cal-arancini", "Arancini de hongos", "Bocados de risotto rellenos de queso.", "calientes", 40, 80, 12),
        new("cal-provoleta", "Provoleta en cazuelita", "Provolone gratinado con orégano.", "calientes", 70, 140, 6),

        new("pri-lomo", "Lomo a la mostaza", "Con papas rústicas al romero.", "principales", 420, 850, 1),
        new("pri-pollo", "Pollo relleno", "Espinaca y queso, con puré de calabaza.", "principales", 260, 560, 1),
        new("pri-bondiola", "Bondiola braseada", "Cocción lenta, con gratén de papas.", "principales", 300, 620, 1),
        new("pri-salmon", "Salmón grillado", "Con vegetales de estación.", "principales", 480, 950, 1),
        new("pri-risotto", "Risotto de hongos", "Hongos de pino, parmesano y perejil.", "principales", 240, 520, 1),
    ];
}
