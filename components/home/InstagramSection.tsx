import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { instagramPosts } from "@/data/store";

export function InstagramSection() {
  return (
    <section className="container-page py-20">
      <SectionHeading align="center" eyebrow="Comunidad" title="Brillando con Soluna ✨" text="Inspiración de clientas, detalles de producto y packaging listo para regalar." />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {instagramPosts.map((post, index) => (
          <div key={post} className="relative aspect-square overflow-hidden rounded-lg bg-soluna-nude">
            <Image src={post} alt={`Inspiración Soluna ${index + 1}`} fill sizes="(min-width:1024px) 16vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
