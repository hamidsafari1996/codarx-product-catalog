import Link from "next/link";
import { CATALOG_PATH } from "@/lib/catalog-params";

type ApiErrorMessageProps = {
  title?: string;
  message?: string;
  retryHref?: string;
};

export default function ApiErrorMessage({
  title = "Unable to load products",
  message = "We could not reach the product catalog API. Check that WordPress is running and try again.",
  retryHref,
}: ApiErrorMessageProps) {
  return (
    <section className="flex min-h-[50vh] flex-1 flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-2xl border border-border bg-surface px-6 py-10 shadow-sm">
        <h2 className="mb-3 text-xl font-bold text-brand">{title}</h2>
        <p className="mb-6 text-sm leading-relaxed text-muted">{message}</p>
        <Link
          href={retryHref ?? CATALOG_PATH}
          className="inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Try again
        </Link>
      </div>
    </section>
  );
}
