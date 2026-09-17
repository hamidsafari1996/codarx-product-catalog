import Sidebar from "@/components/layout/Sidebar";
import ProductList from "@/components/products/ProductList";
import { getProducts } from "@/lib/api/products";
import {
  parseCatalogSearchParams,
  type CatalogSearchParams,
} from "@/lib/catalog-params";

type HomePageProps = {
  searchParams: Promise<CatalogSearchParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = parseCatalogSearchParams(params);

  let products;
  try {
    products = await getProducts(query);
  } catch {
    products = {
      items: [],
      pagination: {
        page: 1,
        per_page: query.per_page ?? 4,
        total: 0,
        total_pages: 0,
      },
    };
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-start lg:px-8">
      <Sidebar filters={params} />
      <ProductList
        products={products.items}
        pagination={products.pagination}
        filters={params}
      />
    </div>
  );
}
