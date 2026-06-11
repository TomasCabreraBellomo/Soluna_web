import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-[linear-gradient(135deg,#FAF8F5_0%,#FFFFFF_45%,#E8D9D7_100%)]">
      <div className="container-page grid min-h-[calc(100vh-80px)] items-center gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-soluna-champagne">Plata 925 · Charms · Regalos</p>
          <h1 className="font-display text-5xl leading-[0.98] text-soluna-charcoal md:text-7xl">
            Coleccioná recuerdos que brillan para siempre
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-soluna-charcoal/72">
            Joyas de plata 925 inspiradas en tus historias favoritas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/catalogo">Ver catálogo</Button>
            <Button href="/charms-disney" variant="secondary">
              Charms Disney
            </Button>
          </div>
        </div>
        <div className="relative min-h-[420px]">
          <div className="absolute inset-x-8 bottom-0 top-8 rounded-[36px] bg-white shadow-glow" />
          <div className="absolute left-0 top-0 h-32 w-32 rounded-full border border-soluna-champagne/30" />
          <Image
            src="/images/rose gold pandora.jpeg"
            alt="Pulsera delicada con charms estilo Pandora"
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="rounded-[30px] object-cover p-5"
          />
          <div className="absolute bottom-8 left-6 max-w-xs rounded-lg bg-white/88 p-5 shadow-soft backdrop-blur">
            <p className="font-display text-2xl">Cada joya cuenta una historia</p>
            <p className="mt-2 text-sm text-soluna-charcoal/65">Elegí charms, completá colecciones y regalá recuerdos.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
