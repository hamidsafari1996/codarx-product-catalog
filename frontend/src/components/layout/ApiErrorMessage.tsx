import Link from "next/link";
import RetryButton from "@/components/layout/RetryButton";
import { CATALOG_PATH } from "@/lib/catalog-params";

type ApiErrorMessageProps = {
  title?: string;
  message?: string;
  showCatalogLink?: boolean;
  onRetry?: () => void;
};

function AlertIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 9v4.5M12 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ApiErrorMessage({
  title = "Catalog temporarily unavailable",
  message = "We could not load the catalog right now. Please try again in a moment.",
  showCatalogLink = false,
  onRetry,
}: ApiErrorMessageProps) {
  return (
    <section
      className="flex min-h-[50vh] flex-1 flex-col items-center justify-center px-4 py-10 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface px-6 py-10 shadow-sm sm:px-8">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertIcon />
        </div>
        <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">
          {title}
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted sm:text-base">
          {message}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <RetryButton onRetry={onRetry} />
          {showCatalogLink ? (
            <Link
              href={CATALOG_PATH}
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted-bg"
            >
              Back to catalog
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
