export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  brand?: string;
description: string;  
 thumbnail: string; 
};

export type ApiResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};