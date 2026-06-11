import type { UserRole } from "@/lib/permissions";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DRAFT";

export type StockMovementType =
  | "INITIAL_ENTRY"
  | "ENTRY"
  | "EXIT"
  | "SALE"
  | "ADJUSTMENT_IN"
  | "ADJUSTMENT_OUT"
  | "RETURN";

export type PaymentMethod = "CASH" | "TRANSFER" | "MERCADO_PAGO";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AdminProduct = {
  id: string;
  sku: string;
  internalCode: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  collection?: string;
  costPrice: number;
  salePrice: number;
  margin: number;
  stock: number;
  minStock: number;
  material?: string;
  weight?: string;
  image?: string;
  status: ProductStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  userId: string;
  userName: string;
  notes?: string;
  createdAt: string;
};

export type SaleItem = {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Sale = {
  id: string;
  customerName?: string;
  customerWhatsapp?: string;
  items: SaleItem[];
  paymentMethod: PaymentMethod;
  total: number;
  notes?: string;
  userId: string;
  userName: string;
  createdAt: string;
};

export type StockStatus = "Disponible" | "Stock bajo" | "Sin stock";
