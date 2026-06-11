import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { CommerceProvider } from "@/components/providers/CommerceProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Soluna | Joyas de plata 925, charms y regalos especiales",
  description:
    "Descubrí charms de plata 925, pulseras, collares, aros y joyeros en Soluna. Creá una historia única con joyas delicadas y coleccionables.",
  metadataBase: new URL("https://soluna.local"),
  openGraph: {
    title: "Soluna | Joyas de plata 925, charms y regalos especiales",
    description:
      "Joyas delicadas, charms coleccionables y regalos especiales para crear historias que brillan.",
    siteName: "Soluna",
    locale: "es_AR",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <CommerceProvider>{children}</CommerceProvider>
      </body>
    </html>
  );
}
