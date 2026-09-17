import type { ProductsQuery } from "@/lib/api/products";

export type CatalogSearchParams = {
  page?: string;
  search?: string;
  available?: string;
  min_price?: string;
  max_price?: string;
  orderby?: string;
  order?: string;
  category?: string;
};

export function parseCatalogSearchParams(
  params: CatalogSearchParams,
): ProductsQuery {
  const page = Number(params.page ?? "1");
  const minPrice = params.min_price ? Number(params.min_price) : undefined;
  const maxPrice = params.max_price ? Number(params.max_price) : undefined;

  let available: boolean | undefined;
  if (params.available === "true") available = true;
  if (params.available === "false") available = false;

  const orderby =
    params.orderby === "price" || params.orderby === "date"
      ? params.orderby
      : "date";
  const order =
    params.order === "asc" || params.order === "desc" ? params.order : "desc";

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    per_page: 4,
    search: params.search?.trim() || undefined,
    category: params.category?.trim() || undefined,
    available,
    min_price:
      typeof minPrice === "number" && Number.isFinite(minPrice)
        ? minPrice
        : undefined,
    max_price:
      typeof maxPrice === "number" && Number.isFinite(maxPrice)
        ? maxPrice
        : undefined,
    orderby,
    order,
  };
}

export function buildCatalogHref(
  current: CatalogSearchParams,
  updates: Partial<CatalogSearchParams>,
) {
  const next = { ...current, ...updates };
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(next)) {
    if (key === "available" && (value === "all" || value === "")) {
      continue;
    }
    if (value !== undefined && value !== "") {
      query.set(key, value);
    }
  }

  const qs = query.toString();
  return qs ? `/?${qs}` : "/";
}
