import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-soluna-ivory px-4 py-16 text-soluna-charcoal">
      <section className="w-full max-w-xl rounded-lg border border-soluna-nude bg-white p-8 text-center shadow-soft">
        <p className="font-display text-5xl">Soluna</p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-soluna-champagne">404</p>
        <h1 className="mt-3 font-display text-4xl">Pagina no encontrada</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-soluna-charcoal/65">
          La pagina que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="focus-ring mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-soluna-champagne px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-[#b79558]"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
