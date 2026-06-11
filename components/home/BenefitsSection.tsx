import { benefits } from "@/data/store";

export function BenefitsSection() {
  return (
    <section className="container-page grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-5">
      {benefits.map(({ title, text, icon: Icon }) => (
        <article key={title} className="rounded-lg border border-soluna-nude bg-white p-5 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-soluna-nude/45 text-soluna-champagne">
            <Icon size={22} />
          </div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-2 text-xs leading-5 text-soluna-charcoal/60">{text}</p>
        </article>
      ))}
    </section>
  );
}
