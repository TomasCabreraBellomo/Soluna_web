import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories } from "@/data/store";

export function FeaturedCategories() {
  return (
    <section className="container-page py-20">
      <SectionHeading eyebrow="Colecciones para empezar" title="Elegí el brillo de tu próxima historia" text="Categorías pensadas para regalar, coleccionar o armar una pulsera con significado propio." />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.slug} href={`/${category.slug}`} className="group relative min-h-80 overflow-hidden rounded-lg bg-white shadow-soft">
            <Image src={category.image} alt={category.name} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-soluna-charcoal/65 via-soluna-charcoal/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div className="mb-3 inline-flex rounded-full bg-white/18 p-2 backdrop-blur">
                <ArrowUpRight size={18} />
              </div>
              <h3 className="font-display text-3xl">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/82">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
