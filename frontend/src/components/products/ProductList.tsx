import type { Product, ProductPagination } from "@/types/product";
import type { CatalogSearchParams } from "@/lib/catalog-params";
import ProductCard from "@/components/products/ProductCard";
import ProductPaginationNav from "@/components/products/ProductPagination";
import SortSelect from "@/components/products/SortSelect";

type ProductListProps = {
  products: Product[];
  pagination: ProductPagination;
  filters: CatalogSearchParams;
};

export default function ProductList({
  products,
  pagination,
  filters,
}: ProductListProps) {
  const countLabel =
    pagination.total === 1
      ? "Showing 1 verified enterprise component"
      : `Showing ${pagination.total} verified enterprise components`;

  return (
    <section className="min-w-0 flex-1">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Catalog Products
          </h1>
          <p className="mt-2 text-sm text-muted">{countLabel}</p>
        </div>
        <SortSelect filters={filters} />
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center text-muted">
          No products matched your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <ProductPaginationNav pagination={pagination} filters={filters} />
    </section>
  );
}
