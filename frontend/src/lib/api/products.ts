import type {
  Product,
  ProductCategory,
  ProductsResponse,
} from "@/types/product";

export type CategoriesResponse = {
  items: ProductCategory[];
};

export type ProductsQuery = {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  available?: boolean;
  min_price?: number;
  max_price?: number;
  orderby?: "date" | "price";
  order?: "asc" | "desc";
};

function getApiBaseUrl() {
  return (
    process.env.WP_API_URL ??
    process.env.NEXT_PUBLIC_WP_API_URL ??
    "http://localhost:8080"
  ).replace(/\/$/, "");
}

function buildProductsUrl(query: ProductsQuery = {}) {
  const url = new URL(`${getApiBaseUrl()}/wp-json/codarx/v1/products`);

  if (query.page) url.searchParams.set("page", String(query.page));
  if (query.per_page) url.searchParams.set("per_page", String(query.per_page));
  if (query.search) url.searchParams.set("search", query.search);
  if (query.category) url.searchParams.set("category", query.category);
  if (typeof query.available === "boolean") {
    url.searchParams.set("available", String(query.available));
  }
  if (typeof query.min_price === "number") {
    url.searchParams.set("min_price", String(query.min_price));
  }
  if (typeof query.max_price === "number") {
    url.searchParams.set("max_price", String(query.max_price));
  }
  if (query.orderby) url.searchParams.set("orderby", query.orderby);
  if (query.order) url.searchParams.set("order", query.order);

  return url.toString();
}

export async function getProducts(
  query: ProductsQuery = {},
): Promise<ProductsResponse> {
  const response = await fetch(buildProductsUrl(query), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`);
  }

  return response.json() as Promise<ProductsResponse>;
}

export async function getCategories(): Promise<ProductCategory[]> {
  const url = new URL(`${getApiBaseUrl()}/wp-json/codarx/v1/categories`);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories (${response.status})`);
  }

  const data = (await response.json()) as CategoriesResponse;
  return data.items ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const url = new URL(
    `${getApiBaseUrl()}/wp-json/codarx/v1/products/${encodeURIComponent(slug)}`,
  );

  const response = await fetch(url.toString(), {
    next: { revalidate: 30 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product (${response.status})`);
  }

  return response.json() as Promise<Product>;
}
