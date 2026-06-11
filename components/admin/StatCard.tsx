import type { LucideIcon } from "lucide-react";

export function StatCard({ title, value, detail, icon: Icon }: { title: string; value: string; detail: string; icon: LucideIcon }) {
  return (
    <article className="rounded-lg border border-soluna-nude bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div className="rounded-full bg-soluna-nude/45 p-3 text-soluna-champagne">
          <Icon size={20} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-soluna-charcoal/45">Hoy</span>
      </div>
      <p className="text-sm text-soluna-charcoal/60">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-xs text-soluna-charcoal/50">{detail}</p>
    </article>
  );
}
