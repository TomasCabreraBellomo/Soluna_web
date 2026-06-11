import { Heart, PackageCheck, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";

const accountSections: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "Perfil", text: "Datos personales y WhatsApp.", icon: UserRound },
  { title: "Pedidos", text: "Seguimiento y estado de compras.", icon: PackageCheck },
  { title: "Favoritos", text: "Piezas guardadas para más tarde.", icon: Heart }
];

export default function AccountPage() {
  return (
    <PublicLayout>
      <section className="container-page py-14">
        <h1 className="font-display text-5xl">Mi cuenta</h1>
        <p className="mt-4 max-w-2xl text-soluna-charcoal/65">Portal preparado para login, historial de pedidos, direcciones, favoritos y datos personales.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {accountSections.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-soluna-nude bg-white p-6 shadow-soft">
              <Icon className="mb-5 text-soluna-champagne" />
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-soluna-charcoal/65">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
