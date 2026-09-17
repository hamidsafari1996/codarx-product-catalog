import Link from "next/link";
import type { ProductPagination } from "@/types/product";
import type { CatalogSearchParams } from "@/lib/catalog-params";
import { buildCatalogHref } from "@/lib/catalog-params";

type ProductPaginationProps = {
  pagination: ProductPagination;
  filters: CatalogSearchParams;
};

export default function ProductPaginationNav({
  pagination,
  filters,
}: ProductPaginationProps) {
  if (pagination.total_pages <= 1) {
    return null;
  }

  const pages = Array.from({ length: pagination.total_pages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex justify-center"
    >
      <div className="inline-flex items-center overflow-hidden rounded-full border border-border bg-surface">
        {pagination.page > 1 ? (
          <Link
            href={buildCatalogHref(filters, {
              page: String(pagination.page - 1),
            })}
            className="px-4 py-2 text-sm text-muted transition-colors hover:text-brand"
          >
            &lt; Prev
          </Link>
        ) : (
          <span className="px-4 py-2 text-sm text-border">&lt; Prev</span>
        )}

        {pages.map((page) => {
          const isActive = page === pagination.page;

          return (
            <Link
              key={page}
              href={buildCatalogHref(filters, { page: String(page) })}
              className={
                isActive
                  ? "mx-1 flex size-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
                  : "mx-1 flex size-8 items-center justify-center rounded-full text-sm text-muted transition-colors hover:text-brand"
              }
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}

        {pagination.page < pagination.total_pages ? (
          <Link
            href={buildCatalogHref(filters, {
              page: String(pagination.page + 1),
            })}
            className="px-4 py-2 text-sm text-muted transition-colors hover:text-brand"
          >
            Next &gt;
          </Link>
        ) : (
          <span className="px-4 py-2 text-sm text-border">Next &gt;</span>
        )}
      </div>
    </nav>
  );
}
