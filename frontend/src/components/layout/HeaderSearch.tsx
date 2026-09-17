"use client";

import { useSearchParams } from "next/navigation";
import HydrationSafeInput from "@/components/forms/HydrationSafeInput";

export default function HeaderSearch() {
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get("search") ?? "";

  return (
    <form action="/" method="get" className="mx-auto w-full max-w-2xl">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <div className="flex items-center gap-2.5 rounded-full bg-muted-bg px-4 py-2.5">
        <span className="text-muted" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21l-4.3-4.3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <HydrationSafeInput
          id="product-search"
          name="search"
          type="search"
          placeholder="Search products..."
          defaultValue={defaultValue}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />
      </div>
    </form>
  );
}
