"use client";

import { useEffect } from "react";
import ApiErrorMessage from "@/components/layout/ApiErrorMessage";

type ProductsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductsError({ error, reset }: ProductsErrorProps) {
  useEffect(() => {
    console.error("[products error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <ApiErrorMessage
        title="Something went wrong"
        message="An unexpected error occurred while loading the catalog. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
