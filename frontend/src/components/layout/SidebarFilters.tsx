"use client";

import type { CatalogSearchParams } from "@/lib/catalog-params";
import HydrationSafeInput from "@/components/forms/HydrationSafeInput";

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

export default function SidebarFilters({ filters }: SidebarFiltersProps) {
  return (
    <form
      action="/"
      method="get"
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
      {filters.search ? (
        <input type="hidden" name="search" value={filters.search} />
      ) : null}
      {filters.orderby ? (
        <input type="hidden" name="orderby" value={filters.orderby} />
      ) : null}
      {filters.order ? (
        <input type="hidden" name="order" value={filters.order} />
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
        <div className="mb-3 grid grid-cols-2 gap-2">
          <label className="sr-only" htmlFor="min_price">
            Minimum price
          </label>
          <div className="flex items-center gap-1 rounded-xl bg-muted-bg px-3 py-2.5 text-sm text-muted">
            <span>$</span>
            <HydrationSafeInput
              id="min_price"
              name="min_price"
              type="number"
              min="0"
              step="1"
              placeholder="200"
              defaultValue={filters.min_price ?? ""}
              className="w-full bg-transparent text-foreground outline-none placeholder:text-muted"
            />
          </div>
          <label className="sr-only" htmlFor="max_price">
            Maximum price
          </label>
          <div className="flex items-center gap-1 rounded-xl bg-muted-bg px-3 py-2.5 text-sm text-muted">
            <span>$</span>
            <HydrationSafeInput
              id="max_price"
              name="max_price"
              type="number"
              min="0"
              step="1"
              placeholder="3500"
              defaultValue={filters.max_price ?? ""}
              className="w-full bg-transparent text-foreground outline-none placeholder:text-muted"
            />
          </div>
        </div>
        <div className="px-1">
          <div className="relative h-1.5 rounded-full bg-border">
            <div className="absolute inset-y-0 left-[8%] right-[12%] rounded-full bg-brand" />
            <span className="absolute top-1/2 left-[8%] size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-white" />
            <span className="absolute top-1/2 right-[12%] size-3.5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-white" />
          </div>
        </div>
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
        href="/"
        className="mt-3 block text-center text-sm text-muted transition-colors hover:text-brand"
      >
        Reset Filters
      </a>
    </form>
  );
}
