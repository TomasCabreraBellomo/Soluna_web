import {
  Banknote,
  Box,
  ChartNoAxesCombined,
  Gift,
  Heart,
  ReceiptText,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProductCategory =
  | "charms-disney"
  | "charms-plata-925"
  | "pulseras"
  | "collares"
  | "aritos"
  | "joyeros"
  | "sets";
export type ProductStatus = "ACTIVE" | "INACTIVE" | "DRAFT" | "OUT_OF_STOCK";

export type Product = {
  id: string;
  sku: string;
  internalCode: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  subcategory: string;
  collection: string;
  cuotas: string;
  costPrice: number;
  price: number;
  margin: number;
  images: string[];
  weight: string;
  material: string;
  tipo: string;
  stock: number;
  minStock: number;
  status: ProductStatus;
  badge?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  name: string;
  slug: ProductCategory | "colecciones";
  description: string;
  image: string;
};

export type Collection = {
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
};

export type Testimonial = {
  author: string;
  text: string;
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);

const CHARM_PRICE = 35000;
const BRACELET_PRICE = 30000;
const NECKLACE_PRICE = 15000;
const JEWELRY_BOX_PRICE = 60000;

export const products: Product[] = [
  {
    id: "prod-ch-stitch-925",
    sku: "CH-STITCH-925",
    internalCode: "CH-DIS-STI",
    name: "Charm Stitch Plata 925",
    slug: "charm-stitch-plata-925",
    description: "Cada charm cuenta una historia: Stitch suma ternura, color y un recuerdo feliz a tu pulsera.",
    category: "charms-disney",
    subcategory: "Charms Disney",
    collection: "Stitch",
    cuotas: "3 cuotas sin interes",
    costPrice: 18500,
    price: CHARM_PRICE,
    margin: 47,
    images: ["/images/MILES.jpeg", "/images/charms disponibles.jpeg"],
    weight: "5 g",
    material: "Plata 925",
    tipo: "Charm estilo Pandora",
    stock: 7,
    minStock: 5,
    status: "ACTIVE",
    badge: "Favorito",
    isBestSeller: true,
    isFavorite: true,
    createdAt: "2026-05-05",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-ch-mickey-925",
    sku: "CH-MICKEY-925",
    internalCode: "CH-DIS-MIC",
    name: "Charm Mickey Plata 925",
    slug: "charm-mickey-plata-925",
    description: "Un clasico coleccionable para llevar un pequeno brillo de magia todos los dias.",
    category: "charms-disney",
    subcategory: "Charms Disney",
    collection: "Mickey & Minnie",
    cuotas: "3 cuotas sin interes",
    costPrice: 18500,
    price: CHARM_PRICE,
    margin: 47,
    images: ["/images/charms disponibles2.jpeg", "/images/charm hello kitty.jpeg"],
    weight: "4 g",
    material: "Plata 925",
    tipo: "Charm estilo Pandora",
    stock: 11,
    minStock: 4,
    status: "ACTIVE",
    badge: "Nuevo",
    isNew: true,
    createdAt: "2026-05-16",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-ch-minnie-925",
    sku: "CH-MINNIE-925",
    internalCode: "CH-DIS-MIN",
    name: "Charm Minnie Plata 925",
    slug: "charm-minnie-plata-925",
    description: "Delicado, femenino y pensado para regalar: un detalle que transforma cualquier pulsera.",
    category: "charms-disney",
    subcategory: "Charms Disney",
    collection: "Mickey & Minnie",
    cuotas: "3 cuotas sin interes",
    costPrice: 18500,
    price: CHARM_PRICE,
    margin: 47,
    images: ["/images/charms disponibles.jpeg", "/images/charms disponibles2.jpeg"],
    weight: "4 g",
    material: "Plata 925",
    tipo: "Charm estilo Pandora",
    stock: 6,
    minStock: 4,
    status: "ACTIVE",
    isFavorite: true,
    createdAt: "2026-05-18",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-ch-castillo-925",
    sku: "CH-CASTILLO-925",
    internalCode: "CH-DIS-CAST",
    name: "Charm Castillo Magico Plata 925",
    slug: "charm-castillo-magico-plata-925",
    description: "Un charm de plata 925 inspirado en esos recuerdos que parecen de cuento.",
    category: "charms-disney",
    subcategory: "Charms Disney",
    collection: "Princesas",
    cuotas: "3 cuotas sin interes",
    costPrice: 18500,
    price: CHARM_PRICE,
    margin: 47,
    images: ["/images/charms disponibles.jpeg", "/images/gato alicia.jpeg"],
    weight: "4 g",
    material: "Plata 925",
    tipo: "Charm Disney",
    stock: 12,
    minStock: 4,
    status: "ACTIVE",
    badge: "Mas vendido",
    isBestSeller: true,
    createdAt: "2026-05-01",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-ch-princesa-925",
    sku: "CH-PRINCESA-925",
    internalCode: "CH-DIS-PRI",
    name: "Charm Princesa Plata 925",
    slug: "charm-princesa-plata-925",
    description: "Pequenos brillos, grandes recuerdos: una pieza romantica para pulseras unicas.",
    category: "charms-plata-925",
    subcategory: "Charms plata 925",
    collection: "Princesas",
    cuotas: "3 cuotas sin interes",
    costPrice: 18500,
    price: CHARM_PRICE,
    margin: 47,
    images: ["/images/gato alicia.jpeg", "/images/charms disponibles2.jpeg"],
    weight: "5 g",
    material: "Plata 925",
    tipo: "Charm estilo Pandora",
    stock: 4,
    minStock: 5,
    status: "ACTIVE",
    badge: "Stock bajo",
    isNew: true,
    createdAt: "2026-05-21",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-pu-pandora-plata",
    sku: "PU-PANDORA-PLATA",
    internalCode: "PU-TIPO-PAN",
    name: "Pulsera Banada en Plata Tipo Pandora",
    slug: "pulsera-banada-en-plata-tipo-pandora",
    description: "Crea una pulsera tan unica como vos con una base delicada para charms y recuerdos.",
    category: "pulseras",
    subcategory: "Pulseras tipo Pandora",
    collection: "Moments",
    cuotas: "3 cuotas sin interes",
    costPrice: 15500,
    price: BRACELET_PRICE,
    margin: 48,
    images: ["/images/pandora.jpeg", "/images/pulseras varias.jpeg"],
    weight: "18 g",
    material: "Banada en plata, tipo Pandora",
    tipo: "Pulsera",
    stock: 15,
    minStock: 5,
    status: "ACTIVE",
    badge: "Nuevo",
    isNew: true,
    createdAt: "2026-05-12",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-co-luna-soluna",
    sku: "CO-LUNA-SOLUNA",
    internalCode: "CO-LUN-001",
    name: "Collar Luna Soluna",
    slug: "collar-luna-soluna",
    description: "Joyas que guardan recuerdos: un collar suave y luminoso para usar todos los dias.",
    category: "collares",
    subcategory: "Collares delicados",
    collection: "Luna",
    cuotas: "3 cuotas sin interes",
    costPrice: 7200,
    price: NECKLACE_PRICE,
    margin: 52,
    images: ["/images/collar rosa .jpeg", "/images/rosaformacollar.jpeg"],
    weight: "6 g",
    material: "Acero con bano dorado champagne",
    tipo: "Collar",
    stock: 9,
    minStock: 4,
    status: "ACTIVE",
    isBestSeller: true,
    createdAt: "2026-05-10",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-co-corazon-soluna",
    sku: "CO-CORAZON-SOLUNA",
    internalCode: "CO-COR-001",
    name: "Collar Corazon Soluna",
    slug: "collar-corazon-soluna",
    description: "Regalos delicados para momentos especiales, con un brillo sutil y muy femenino.",
    category: "collares",
    subcategory: "Collares delicados",
    collection: "San Valentin",
    cuotas: "3 cuotas sin interes",
    costPrice: 7200,
    price: NECKLACE_PRICE,
    margin: 52,
    images: ["/images/rosa blanca collar.jpeg", "/images/collares varios mate.jpeg"],
    weight: "6 g",
    material: "Acero con bano dorado champagne",
    tipo: "Collar",
    stock: 13,
    minStock: 4,
    status: "ACTIVE",
    isFavorite: true,
    createdAt: "2026-05-17",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-ar-estrella-plata",
    sku: "AR-ESTRELLA-PLATA",
    internalCode: "AR-EST-925",
    name: "Aritos Estrella Plata",
    slug: "aritos-estrella-plata",
    description: "Destellos pequenos para completar cualquier look con un detalle delicado.",
    category: "aritos",
    subcategory: "Aritos pequenos",
    collection: "Estrellas",
    cuotas: "3 cuotas sin interes",
    costPrice: 8200,
    price: 18000,
    margin: 54,
    images: ["/images/WhatsApp Image 2026-05-16 at 11.49.39.jpeg"],
    weight: "2 g",
    material: "Plata 925",
    tipo: "Aritos",
    stock: 3,
    minStock: 6,
    status: "ACTIVE",
    badge: "Stock bajo",
    createdAt: "2026-05-14",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-jo-pandora-rosa",
    sku: "JO-PANDORA-ROSA",
    internalCode: "JO-PAN-ROS",
    name: "Joyero Pandora Original Rosa",
    slug: "joyero-pandora-original-rosa",
    description: "Joyero Pandora Original en tono rosa, pensado para regalar, guardar y coleccionar.",
    category: "joyeros",
    subcategory: "Joyeros Pandora Original",
    collection: "Gift Box",
    cuotas: "3 cuotas sin interes",
    costPrice: 36000,
    price: JEWELRY_BOX_PRICE,
    margin: 40,
    images: ["/images/Captura de pantalla 2026-05-24 204642.jpg", "/images/WhatsApp Image 2026-05-24 at 20.58.03.jpeg"],
    weight: "190 g",
    material: "Pandora Original",
    tipo: "Joyero",
    stock: 18,
    minStock: 6,
    status: "ACTIVE",
    isNew: true,
    createdAt: "2026-05-22",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-jo-pandora-blanco",
    sku: "JO-PANDORA-BLANCO",
    internalCode: "JO-PAN-BLA",
    name: "Joyero Pandora Original Blanco",
    slug: "joyero-pandora-original-blanco",
    description: "Un joyero Pandora Original blanco, elegante y listo para acompanar un regalo especial.",
    category: "joyeros",
    subcategory: "Joyeros Pandora Original",
    collection: "Gift Box",
    cuotas: "3 cuotas sin interes",
    costPrice: 36000,
    price: JEWELRY_BOX_PRICE,
    margin: 40,
    images: ["/images/WhatsApp Image 2026-05-24 at 20.58.03.jpeg", "/images/rose gold pandora.jpeg"],
    weight: "190 g",
    material: "Pandora Original",
    tipo: "Joyero",
    stock: 8,
    minStock: 5,
    status: "ACTIVE",
    createdAt: "2026-05-24",
    updatedAt: "2026-06-10"
  },
  {
    id: "prod-set-charm-pulsera",
    sku: "SET-CHARM-PULSERA",
    internalCode: "SET-REG-001",
    name: "Set Regalo Charm + Pulsera",
    slug: "set-regalo-charm-pulsera",
    description: "Colecciones pensadas para regalar y coleccionar: pulsera tipo Pandora y charm plata 925.",
    category: "sets",
    subcategory: "Sets para regalar",
    collection: "Dia de la Madre",
    cuotas: "3 cuotas sin interes",
    costPrice: 34000,
    price: 65000,
    margin: 48,
    images: ["/images/rose gold pandora.jpeg", "/images/pandora.jpeg"],
    weight: "24 g",
    material: "Pulsera banada en plata + charm plata 925",
    tipo: "Set de regalo",
    stock: 5,
    minStock: 3,
    status: "ACTIVE",
    badge: "Gift box",
    isBestSeller: true,
    createdAt: "2026-05-30",
    updatedAt: "2026-06-10"
  }
];

export const categories: Category[] = [
  { name: "Charms Disney", slug: "charms-disney", description: "Personajes, simbolos y recuerdos en plata 925.", image: "/images/charms disponibles2.jpeg" },
  { name: "Charms plata 925", slug: "charms-plata-925", description: "Piezas coleccionables para contar tu historia.", image: "/images/charms disponibles.jpeg" },
  { name: "Pulseras", slug: "pulseras", description: "Bases delicadas tipo Pandora para sumar charms.", image: "/images/pandora.jpeg" },
  { name: "Collares", slug: "collares", description: "Piezas sutiles para todos los dias.", image: "/images/collares varios mate.jpeg" },
  { name: "Aritos", slug: "aritos", description: "Brillos pequenos con presencia elegante.", image: "/images/WhatsApp Image 2026-05-16 at 11.49.39.jpeg" },
  { name: "Joyeros", slug: "joyeros", description: "Pandora Original para guardar y regalar con intencion.", image: "/images/Captura de pantalla 2026-05-24 204642.jpg" },
  { name: "Sets para regalar", slug: "sets", description: "Gift boxes listas para sorprender.", image: "/images/rose gold pandora.jpeg" }
];

export const collections: Collection[] = [
  { name: "Disney", slug: "disney", description: "Charms inspirados en historias favoritas.", image: "/images/charms disponibles.jpeg", active: true },
  { name: "Stitch", slug: "stitch", description: "Piezas tiernas, divertidas y coleccionables.", image: "/images/MILES.jpeg", active: true },
  { name: "Princesas", slug: "princesas", description: "Detalles romanticos para pulseras unicas.", image: "/images/gato alicia.jpeg", active: true },
  { name: "Mickey & Minnie", slug: "mickey-minnie", description: "Clasicos que siempre vuelven.", image: "/images/charm hello kitty.jpeg", active: true },
  { name: "San Valentin", slug: "san-valentin", description: "Regalos delicados para celebrar el amor.", image: "/images/rosa blanca collar.jpeg", active: true },
  { name: "Dia de la Madre", slug: "dia-de-la-madre", description: "Joyas con memoria afectiva.", image: "/images/collar rosa .jpeg", active: true },
  { name: "Navidad", slug: "navidad", description: "Brillos para una temporada especial.", image: "/images/rose gold pandora.jpeg", active: false }
];

export const testimonials: Testimonial[] = [
  { author: "Camila R.", text: "El charm llego hermoso y el packaging parecia de joyeria boutique." },
  { author: "Micaela P.", text: "Compre un set para regalar y fue delicado de principio a fin." },
  { author: "Lucia F.", text: "El joyero Pandora Original es precioso, se siente premium y cuidado." }
];

export const instagramPosts = [
  "/images/charms disponibles.jpeg",
  "/images/pandora.jpeg",
  "/images/collar rosa .jpeg",
  "/images/rose gold pandora.jpeg",
  "/images/rosa blanca collar.jpeg",
  "/images/charms disponibles2.jpeg"
];

export const benefits: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "Plata 925", text: "Charms seleccionados con materiales nobles.", icon: ShieldCheck },
  { title: "Envios a todo Argentina", text: "Preparacion cuidada y seguimiento del pedido.", icon: Truck },
  { title: "Packaging para regalo", text: "Listo para sorprender sin sumar nada mas.", icon: Gift },
  { title: "Garantia y cambios", text: "Acompanamiento claro despues de la compra.", icon: PackageCheck },
  { title: "Cuotas sin interes", text: "Opciones de pago pensadas para cada compra.", icon: Banknote }
];

export const adminNavigation = [
  { label: "Dashboard", href: "/admin/dashboard", icon: ChartNoAxesCombined },
  { label: "Productos", href: "/admin/productos", icon: ShoppingBag },
  { label: "Stock", href: "/admin/stock", icon: Box },
  { label: "Ventas", href: "/admin/ventas", icon: ReceiptText },
  { label: "Pedidos", href: "/admin/pedidos", icon: PackageCheck },
  { label: "Clientes", href: "/admin/clientes", icon: Heart },
  { label: "Reportes", href: "/admin/reportes", icon: Star }
];

export const orders = [
  { id: "SOL-1028", customer: "Camila Ruiz", total: 100000, status: "Preparando", payment: "Mercado Pago", date: "2026-06-09" },
  { id: "SOL-1027", customer: "Micaela Perez", total: 35000, status: "Pagado", payment: "Transferencia", date: "2026-06-09" },
  { id: "SOL-1026", customer: "Lucia Ferrer", total: 65000, status: "Enviado", payment: "Mercado Pago", date: "2026-06-08" }
];

export const customers = [
  { name: "Camila Ruiz", email: "camila@example.com", whatsapp: "+54 9 11 5555-1200", birthday: "12/08", orders: 5, favoriteProducts: 8, registeredAt: "2026-03-14" },
  { name: "Micaela Perez", email: "mica@example.com", whatsapp: "+54 9 351 555-0921", birthday: "03/11", orders: 3, favoriteProducts: 4, registeredAt: "2026-04-02" },
  { name: "Lucia Ferrer", email: "lucia@example.com", whatsapp: "+54 9 221 555-7710", birthday: "27/05", orders: 7, favoriteProducts: 12, registeredAt: "2026-02-20" }
];

export const stockMovements = [
  { product: "Charm Castillo Magico Plata 925", sku: "CH-CASTILLO-925", type: "Entrada", quantity: 10, reason: "Reposicion", user: "Admin Soluna", date: "2026-06-08", notes: "Proveedor principal" },
  { product: "Aritos Estrella Plata", sku: "AR-ESTRELLA-PLATA", type: "Venta", quantity: -2, reason: "Pedido SOL-1028", user: "Vendedora", date: "2026-06-09", notes: "Stock bajo" },
  { product: "Joyero Pandora Original Rosa", sku: "JO-PANDORA-ROSA", type: "Ajuste positivo", quantity: 3, reason: "Conteo fisico", user: "Deposito", date: "2026-06-07", notes: "Caja encontrada" },
  { product: "Pulsera Banada en Plata Tipo Pandora", sku: "PU-PANDORA-PLATA", type: "Salida", quantity: -1, reason: "Muestra showroom", user: "Deposito", date: "2026-06-06", notes: "Pendiente de devolucion" },
  { product: "Charm Stitch Plata 925", sku: "CH-STITCH-925", type: "Devolucion", quantity: 1, reason: "Cambio de producto", user: "Vendedora", date: "2026-06-05", notes: "Reingresa a stock" }
];

export const cashMovements = [
  { type: "Ingreso", amount: 100000, method: "Mercado Pago", user: "Vendedora", date: "2026-06-09", notes: "Pedido SOL-1028" },
  { type: "Ingreso", amount: 35000, method: "Transferencia", user: "Vendedora", date: "2026-06-09", notes: "Pedido SOL-1027" },
  { type: "Egreso", amount: 12000, method: "Efectivo", user: "Admin Soluna", date: "2026-06-09", notes: "Insumos packaging" }
];
