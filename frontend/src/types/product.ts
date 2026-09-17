export type ProductImage = {
  url: string;
  alt: string;
};

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  available: boolean;
  image: ProductImage | null;
  category: ProductCategory | null;
};

export type ProductPagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type ProductsResponse = {
  items: Product[];
  pagination: ProductPagination;
};
