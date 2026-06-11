import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = ["Elegí tu pulsera", "Elegí tus charms", "Creá una historia única", "Recibila en tu casa"];

export function BraceletBuilderSection() {
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Próximo configurador" title="Armá tu pulsera" text="Una experiencia preparada para evolucionar hacia un diseñador interactivo: elegí la base, combiná charms y visualizá una historia completa antes de comprar." />
            <Button href="/arma-tu-pulsera" className="mt-8">Diseñar mi pulsera</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <BuilderStepCard key={step} index={index + 1} title={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BuilderStepCard({ index, title }: { index: number; title: string }) {
  return (
    <article className="rounded-lg border border-soluna-nude bg-soluna-ivory p-6">
      <div className="mb-8 flex items-center justify-between">
        <span className="font-display text-5xl text-soluna-rose">0{index}</span>
        <CheckCircle2 className="text-soluna-champagne" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-soluna-charcoal/65">Un paso simple para acercarte a una pieza con significado propio.</p>
    </article>
  );
}
