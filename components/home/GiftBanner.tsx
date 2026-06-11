import { Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function GiftBanner() {
  return (
    <section className="container-page py-20">
      <div className="grid items-center gap-8 rounded-lg bg-soluna-charcoal p-8 text-white shadow-glow md:grid-cols-[1fr_auto] md:p-12">
        <div>
          <div className="mb-4 inline-flex rounded-full bg-white/10 p-3 text-soluna-champagne">
            <Gift />
          </div>
          <h2 className="font-display text-4xl md:text-5xl">¿Buscando el regalo perfecto?</h2>
          <p className="mt-4 max-w-2xl text-white/72">Descubrí sets, gift boxes y joyas listas para sorprender.</p>
        </div>
        <Button href="/colecciones" variant="secondary" className="bg-white">
          Ver sets y gift box
        </Button>
      </div>
    </section>
  );
}
