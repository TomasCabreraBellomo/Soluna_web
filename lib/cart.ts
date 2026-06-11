import type { Product } from "@/data/store";
import { WHATSAPP_NUMBER } from "@/lib/config";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  sku?: string;
};

export function productToCartItem(product: Product, quantity = 1): CartItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    quantity,
    image: product.images[0],
    category: product.category,
    sku: product.sku
  };
}

export function getCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function formatWhatsAppPrice(value: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}

export function generateWhatsAppMessage(items: CartItem[]) {
  const lines = [
    "Hola Soluna",
    "Quiero realizar un pedido con estos productos:",
    "",
    ...items.flatMap((item, index) => [
      `${index + 1}. ${item.name}`,
      `Cantidad: ${item.quantity}`,
      `Precio unitario: ${formatWhatsAppPrice(item.price)}`,
      `Subtotal: ${formatWhatsAppPrice(item.price * item.quantity)}`,
      ""
    ]),
    `Total del pedido: ${formatWhatsAppPrice(getCartTotal(items))}`,
    "",
    "Mi nombre:",
    "Forma de entrega:",
    "Forma de pago:",
    "",
    "Gracias"
  ];

  return lines.join("\n");
}

export function getCheckoutUrl(items: CartItem[]) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(generateWhatsAppMessage(items))}`;
}

export function getProductWhatsAppUrl(product: Product) {
  const message = [
    "Hola Soluna",
    "Quiero consultar por este producto:",
    "",
    `Producto: ${product.name}`,
    `Precio: ${formatWhatsAppPrice(product.price)}`,
    `SKU: ${product.sku}`,
    "",
    "Gracias"
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
