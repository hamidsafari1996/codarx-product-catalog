"use client";

import type { CatalogSearchParams } from "@/lib/catalog-params";
import { CATALOG_PATH } from "@/lib/catalog-params";
import ClientOnly from "@/components/forms/ClientOnly";
import HydrationSafeInput from "@/components/forms/HydrationSafeInput";
import PriceRangeFilter from "@/components/filters/PriceRangeFilter";

type SidebarFiltersProps = {
  filters: CatalogSearchParams;
};

function FiltersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 7h10M14 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM4 17h6M10 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM20 17h-6M20 7h-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SidebarFiltersSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
      aria-hidden="true"
    >
      <div className="mb-6 h-6 w-24 rounded bg-muted-bg" />
      <div className="mb-6 space-y-3">
        <div className="h-4 w-32 rounded bg-muted-bg" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 rounded-xl bg-muted-bg" />
          <div className="h-10 rounded-xl bg-muted-bg" />
        </div>
      </div>
      <div className="mb-6 h-24 rounded bg-muted-bg" />
      <div className="h-11 rounded-xl bg-muted-bg" />
    </div>
  );
}

function SidebarFiltersForm({ filters }: SidebarFiltersProps) {
  return (
    <form
      action={CATALOG_PATH}
      method="get"
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      {filters.search ? (
        <HydrationSafeInput type="hidden" name="search" value={filters.search} />
      ) : null}
      {filters.orderby ? (
        <HydrationSafeInput type="hidden" name="orderby" value={filters.orderby} />
      ) : null}
      {filters.order ? (
        <HydrationSafeInput type="hidden" name="order" value={filters.order} />
      ) : null}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand">Filters</h2>
        <span className="text-brand">
          <FiltersIcon />
        </span>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Filter by Price
        </h3>
        <PriceRangeFilter
          initialMin={filters.min_price}
          initialMax={filters.max_price}
        />
      </div>

      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-semibold text-foreground">
          Availability
        </legend>
        <div className="space-y-3">
          {[
            { value: "all", label: "All Products" },
            { value: "true", label: "In Stock" },
            { value: "false", label: "Out of Stock" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"
            >
              <HydrationSafeInput
                type="radio"
                name="available"
                value={option.value}
                defaultChecked={
                  option.value === "all"
                    ? !filters.available || filters.available === "all"
                    : filters.available === option.value
                }
                className="size-4 accent-brand"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        Apply Filters
      </button>

      <a
        href={CATALOG_PATH}
        className="mt-3 block text-center text-sm text-muted transition-colors hover:text-brand"
      >
        Reset Filters
      </a>
    </form>
  );
}

export default function SidebarFilters({ filters }: SidebarFiltersProps) {
  return (
    <ClientOnly fallback={<SidebarFiltersSkeleton />}>
      <SidebarFiltersForm filters={filters} />
    </ClientOnly>
  );
}
