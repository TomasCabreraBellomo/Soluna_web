import Link from "next/link";

const columns = [
  {
    title: "Soluna",
    links: [
      ["Nosotros", "#"],
      ["Preguntas frecuentes", "#"],
      ["Cambios y devoluciones", "#"],
      ["Seguimiento de pedidos", "#"],
      ["Acceso interno", "/admin"]
    ]
  },
  {
    title: "Categorias",
    links: [
      ["Charms Disney", "/charms-disney"],
      ["Charms plata 925", "/charms-plata-925"],
      ["Pulseras", "/pulseras"],
      ["Collares", "/collares"],
      ["Joyeros", "/joyeros"]
    ]
  },
  {
    title: "Redes sociales",
    links: [
      ["Instagram", "#"],
      ["WhatsApp", "#"],
      ["TikTok", "#"]
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-soluna-nude bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="font-display text-4xl">
            Soluna
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-soluna-charcoal/70">
            Joyas delicadas para coleccionar momentos, regalar historias y volver a elegir brillo todos los dias.
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-soluna-champagne">Plata 925 | Gift boxes | Cuotas</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-soluna-charcoal">{column.title}</h3>
              <ul className="grid gap-3 text-sm text-soluna-charcoal/65">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-soluna-champagne">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-soluna-nude/70 py-5 text-center text-xs text-soluna-charcoal/55">
        (c) 2026 Soluna. Joyas que cuentan historias.
      </div>
    </footer>
  );
}
