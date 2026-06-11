import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/store";

export function TestimonialsSection() {
  return (
    <section className="bg-soluna-nude/35 py-20">
      <div className="container-page">
        <SectionHeading align="center" eyebrow="Reseñas" title="Regalos que llegan con emoción" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.author} className="rounded-lg bg-white p-6 shadow-soft">
              <div className="mb-4 flex text-soluna-champagne">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="text-lg leading-8">“{testimonial.text}”</p>
              <p className="mt-5 text-sm font-semibold text-soluna-charcoal/60">{testimonial.author}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
