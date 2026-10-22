export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  stock: number;
  rating: number;
  brand?: string;
  description: string;
  thumbnail: string;
  warrantyInformation?: string;
  shippingInformation?: string;
cartId: string;
};

export type itemCart = Product & {cartId: string};

export type ApiResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
