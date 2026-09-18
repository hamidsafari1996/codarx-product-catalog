import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import ApiErrorMessage from "@/components/layout/ApiErrorMessage";
import ProductList from "@/components/products/ProductList";
import { getCategories, getProducts } from "@/lib/api/products";
import {
  parseCatalogSearchParams,
  type CatalogSearchParams,
} from "@/lib/catalog-params";
import type { ProductCategory } from "@/types/product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalog Products | Codarx Product Catalog",
  description: "Browse verified enterprise products with filters, search, and sorting.",
};

type ProductsPageProps = {
  searchParams: Promise<CatalogSearchParams>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = parseCatalogSearchParams(params);

  let categories: ProductCategory[] = [];
  let categoriesFailed = false;

  try {
    categories = await getCategories();
  } catch {
    categoriesFailed = true;
    categories = [];
  }

  try {
    const products = await getProducts(query);

    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-start lg:px-8">
        <Sidebar filters={params} categories={categories} />
        <ProductList
          products={products.items}
          pagination={products.pagination}
          filters={params}
        />
      </div>
    );
  } catch {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <ApiErrorMessage
          title="Unable to load products"
          message={
            categoriesFailed
              ? "The WordPress product API appears to be offline or unreachable. Start the WordPress container and refresh this page."
              : "We could not load products from the catalog API. Check that WordPress is running, then try again."
          }
        />
      </div>
    );
  }
}
