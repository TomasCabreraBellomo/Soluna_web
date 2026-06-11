import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmotionalSection() {
  return (
    <section className="bg-soluna-rose/28 py-20">
      <div className="container-page grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex rounded-full bg-white p-3 text-soluna-champagne shadow-soft">
            <Sparkles />
          </div>
          <h2 className="font-display text-4xl md:text-6xl">Cada charm cuenta una historia</h2>
          <p className="mt-5 text-lg leading-8 text-soluna-charcoal/72">
            Creá una pulsera única con los momentos y personajes que más amás.
          </p>
        </div>
        <Button href="/charms-disney">Ver colección Disney</Button>
      </div>
    </section>
  );
}
