namespace Daxpress.Web.Content;

public record Servicio(
    string Slug,
    string Nombre,
    string Resumen,
    string Precio,
    string Plazo,
    string TituloSeo,
    string DescripcionSeo,
    string Intro,
    string[] Incluye,
    string[] Ejemplos);

public record Sector(
    string Slug,
    string Nombre,
    string TituloSeo,
    string DescripcionSeo,
    string Titular,
    string Intro,
    string[] Problemas,
    string[] Soluciones,
    string ServicioSugerido);

public record Caso(
    string Slug,
    string Titulo,
    string Sector,
    string Problema,
    string Solucion,
    string[] Funciones);

public record ArticuloBlog(string Slug, string Titulo, string Resumen, DateOnly Fecha);

/// <summary>
/// Contenido del sitio. Vive en código para que cada página se renderice en el
/// servidor sin base de datos; cuando el blog crezca se puede mover a archivos Markdown.
/// </summary>
public static class SiteContent
{
    public static readonly IReadOnlyList<Servicio> Servicios =
    [
        new(
            Slug: "diagnostico-gratuito",
            Nombre: "Diagnóstico sin costo",
            Resumen: "Relevamos tus procesos y te decimos cuántas horas por semana podés ahorrar.",
            Precio: "Sin costo",
            Plazo: "1 semana",
            TituloSeo: "Diagnóstico gratuito de procesos para pymes en Montevideo",
            DescripcionSeo: "Reunión de 1–2 horas e informe con las tareas que tu pyme puede automatizar, las horas ahorrables y el costo estimado. Sin compromiso.",
            Intro: "Antes de escribir una línea de código entendemos cómo trabaja tu equipo. En una reunión de 1 a 2 horas recorremos tus procesos y, en una semana, te entregamos un informe claro.",
            Incluye:
            [
                "Reunión de relevamiento de 1–2 horas (presencial en Montevideo o por videollamada)",
                "Mapa de las tareas repetitivas de tu equipo",
                "Estimación de horas ahorrables por semana",
                "Propuesta de solución con costo y plazo estimados",
            ],
            Ejemplos:
            [
                "Detectar que el cierre de caja diario lleva 40 minutos de planilla",
                "Encontrar pedidos a proveedores que se arman copiando datos a mano",
            ]),
        new(
            Slug: "automatizacion-rapida",
            Nombre: "Automatización rápida",
            Resumen: "Resolvemos una tarea puntual que hoy hacés a mano todas las semanas.",
            Precio: "USD 300 – 800",
            Plazo: "1–2 semanas",
            TituloSeo: "Automatización de tareas administrativas para pymes en Uruguay",
            DescripcionSeo: "Reportes automáticos, recordatorios, alertas de stock y carga de formularios a planillas. Automatizaciones puntuales en 1–2 semanas desde USD 300.",
            Intro: "Ideal cuando hay una tarea concreta que le roba horas a tu equipo. La automatizamos rápido, con precio cerrado, y empezás a ahorrar tiempo desde la primera semana.",
            Incluye:
            [
                "Una tarea o flujo automatizado de punta a punta",
                "Pruebas con tus datos reales",
                "Instructivo de uso",
                "30 días de garantía de corrección de errores",
            ],
            Ejemplos:
            [
                "Reporte de ventas que llega solo por correo cada lunes",
                "Recordatorios automáticos de turnos por WhatsApp o correo",
                "Formularios web que se cargan directo en una planilla",
                "Alertas cuando un producto baja del stock mínimo",
            ]),
        new(
            Slug: "app-de-gestion",
            Nombre: "App de gestión estándar",
            Resumen: "Inventario, reservas, clientes o cobros en una aplicación web hecha para tu negocio.",
            Precio: "USD 1.500 – 4.000",
            Plazo: "3–6 semanas",
            TituloSeo: "Sistema de stock, reservas y clientes para pymes en Uruguay",
            DescripcionSeo: "Aplicación web de gestión para tu pyme: inventario, reservas, clientes o cobros, con usuarios, reportes y capacitación. Entrega en 3–6 semanas.",
            Intro: "Una aplicación web propia para ordenar el corazón de tu negocio. Partimos de soluciones que ya construimos y las adaptamos a tu forma de trabajar.",
            Incluye:
            [
                "Módulo principal: inventario, reservas, clientes o cobros",
                "Usuarios con distintos permisos",
                "Reportes y exportación a Excel",
                "Funciona en computadora, tablet y celular",
                "Capacitación para tu equipo",
            ],
            Ejemplos:
            [
                "Sistema de stock con entradas, salidas y pedidos a proveedores",
                "Agenda online de reservas para una clínica o spa",
                "Cuenta corriente de clientes con cobros pendientes",
            ]),
        new(
            Slug: "software-a-medida",
            Nombre: "Solución a medida",
            Resumen: "Varios procesos integrados entre sí y con la facturación electrónica.",
            Precio: "Desde USD 4.000",
            Plazo: "Según alcance",
            TituloSeo: "Software a medida en Montevideo con integración a e-factura",
            DescripcionSeo: "Desarrollo de software a medida para pymes en Montevideo: varios procesos integrados, conexión con facturación electrónica (CFE) y otros sistemas.",
            Intro: "Cuando tu operación tiene varias piezas que tienen que hablar entre sí, diseñamos una solución completa: ventas, stock, cobros y comprobantes conectados.",
            Incluye:
            [
                "Análisis y diseño de los procesos a integrar",
                "Integración con facturación electrónica",
                "Conexión con otros sistemas que ya uses",
                "Avances semanales para que veas y opines",
                "Capacitación y puesta en marcha",
            ],
            Ejemplos:
            [
                "Venta que descuenta stock y emite el comprobante electrónico",
                "Portal para que tus clientes vean pedidos y saldos",
            ]),
        new(
            Slug: "soporte-mensual",
            Nombre: "Soporte mensual",
            Resumen: "Tu aplicación funcionando, respaldada y mejorando cada mes.",
            Precio: "USD 80 – 300 / mes",
            Plazo: "Mensual",
            TituloSeo: "Soporte y mantenimiento de software para pymes",
            DescripcionSeo: "Hosting, respaldos automáticos, corrección de errores y horas mensuales de mejoras. Atención por correo o WhatsApp en horario laboral.",
            Intro: "Mantenemos tu aplicación funcionando y mejorando sin que tengas que preocuparte. Se cancela con 30 días de aviso.",
            Incluye:
            [
                "Hosting y respaldos automáticos",
                "Corrección de errores",
                "Horas mensuales para ajustes y mejoras",
                "Atención por correo o WhatsApp en horario laboral",
            ],
            Ejemplos: []),
    ];

    public static readonly IReadOnlyList<Sector> Sectores =
    [
        new(
            Slug: "comercios-y-distribuidoras",
            Nombre: "Comercios y distribuidoras",
            TituloSeo: "Sistema de stock para pymes en Uruguay",
            DescripcionSeo: "Sistema de stock e inventario para comercios y distribuidoras en Uruguay: entradas, salidas, alertas, pedidos a proveedores y facturación electrónica.",
            Titular: "Sistema de stock para comercios y distribuidoras",
            Intro: "Si tu stock vive en una planilla que nadie actualiza a tiempo, perdés ventas y plata. Te ayudamos a saber qué tenés, qué se mueve y qué pedir.",
            Problemas:
            [
                "El stock de la planilla no coincide con el del depósito",
                "Los pedidos a proveedores se arman a ojo",
                "Nadie sabe qué productos dejan más margen",
                "Facturar y descontar stock son dos tareas separadas",
            ],
            Soluciones:
            [
                "Inventario en tiempo real con entradas y salidas",
                "Alertas de stock mínimo y sugerencia de pedidos",
                "Reportes de rotación y margen por producto",
                "Integración con facturación electrónica",
            ],
            ServicioSugerido: "app-de-gestion"),
        new(
            Slug: "clinicas-y-spas",
            Nombre: "Clínicas, consultorios y spas",
            TituloSeo: "Sistema de reservas para clínicas y spas en Montevideo",
            DescripcionSeo: "Agenda online y sistema de reservas para clínicas, consultorios y spas: turnos por profesional y sala, recordatorios automáticos y cobros.",
            Titular: "Sistema de reservas para clínicas, consultorios y spas",
            Intro: "Menos tiempo al teléfono y menos turnos perdidos. Tus clientes reservan online y tu equipo ve la agenda completa en un solo lugar.",
            Problemas:
            [
                "Los turnos se coordinan por WhatsApp uno por uno",
                "Clientes que no vienen y no avisan",
                "Agenda de profesionales y salas en distintos lugares",
                "Paquetes de sesiones y pagos difíciles de seguir",
            ],
            Soluciones:
            [
                "Reservas online por servicio, profesional y sala",
                "Recordatorios automáticos antes de cada turno",
                "Calendario mensual con horario comercial",
                "Control de paquetes de sesiones y pagos",
            ],
            ServicioSugerido: "app-de-gestion"),
        new(
            Slug: "talleres-y-servicios",
            Nombre: "Talleres y empresas de servicios",
            TituloSeo: "Software de gestión para talleres en Montevideo",
            DescripcionSeo: "Órdenes de trabajo, agenda, presupuestos y seguimiento de clientes para talleres y empresas de servicios en Montevideo.",
            Titular: "Gestión de órdenes y turnos para talleres",
            Intro: "Ordená las órdenes de trabajo, los presupuestos y los avisos a clientes sin depender del cuaderno o de la memoria de nadie.",
            Problemas:
            [
                "Órdenes de trabajo en papel que se pierden",
                "Presupuestos que se arman desde cero cada vez",
                "Clientes que llaman para preguntar si ya está listo",
            ],
            Soluciones:
            [
                "Órdenes de trabajo con estado y responsable",
                "Presupuestos a partir de plantillas",
                "Aviso automático al cliente cuando el trabajo está listo",
            ],
            ServicioSugerido: "automatizacion-rapida"),
    ];

    public static readonly IReadOnlyList<Caso> Casos =
    [
        new(
            Slug: "plataforma-de-reservas-centro-de-bienestar",
            Titulo: "Plataforma de reservas para un centro de bienestar",
            Sector: "clinicas-y-spas",
            Problema: "Un centro de estética y bienestar con varias líneas de servicio y consultorios para alquilar coordinaba la agenda a mano.",
            Solucion: "Construimos una plataforma web con catálogo de servicios, reservas online y administración de consultorios.",
            Funciones:
            [
                "Catálogo de servicios por categoría, administrable",
                "Calendario mensual de disponibilidad con horario comercial",
                "Reserva y alquiler de consultorios",
                "Opciones de precio, créditos de sesiones y pagos",
            ]),
        new(
            Slug: "app-de-inventario",
            Titulo: "App de inventario para control de stock",
            Sector: "comercios-y-distribuidoras",
            Problema: "El control de stock dependía de planillas desactualizadas.",
            Solucion: "Desarrollamos una aplicación de inventario para registrar movimientos y conocer el stock real en todo momento.",
            Funciones:
            [
                "Registro de entradas y salidas",
                "Stock actualizado en tiempo real",
                "Reportes de movimientos",
            ]),
    ];

    public static readonly IReadOnlyList<ArticuloBlog> Blog = [];

    public static Servicio? BuscarServicio(string slug) =>
        Servicios.FirstOrDefault(s => s.Slug == slug);

    public static Sector? BuscarSector(string slug) =>
        Sectores.FirstOrDefault(s => s.Slug == slug);
}
