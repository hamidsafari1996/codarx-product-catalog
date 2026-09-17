"use client";

import { useRouter } from "next/navigation";
import type { CatalogSearchParams } from "@/lib/catalog-params";
import { buildCatalogHref } from "@/lib/catalog-params";

type SortSelectProps = {
  filters: CatalogSearchParams;
};

function SortIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h10M4 17h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SortSelect({ filters }: SortSelectProps) {
  const router = useRouter();

  const current =
    filters.orderby === "price" && filters.order === "asc"
      ? "price-asc"
      : filters.orderby === "price" && filters.order === "desc"
        ? "price-desc"
        : "newest";

  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="font-medium">Sort:</span>
      <span className="relative inline-flex items-center">
        <select
          value={current}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "price-asc") {
              router.push(
                buildCatalogHref(filters, {
                  orderby: "price",
                  order: "asc",
                  page: "1",
                }),
              );
              return;
            }
            if (value === "price-desc") {
              router.push(
                buildCatalogHref(filters, {
                  orderby: "price",
                  order: "desc",
                  page: "1",
                }),
              );
              return;
            }
            router.push(
              buildCatalogHref(filters, {
                orderby: "date",
                order: "desc",
                page: "1",
              }),
            );
          }}
          className="appearance-none rounded-lg border border-border bg-surface py-2 pr-8 pl-3 font-medium text-foreground outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <span className="pointer-events-none absolute right-2 text-muted">
          <SortIcon />
        </span>
      </span>
    </label>
  );
}
