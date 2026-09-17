import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-brand">Product not found</h1>
      <p className="text-muted">
        The product you are looking for does not exist or is no longer available.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        Back to catalog
      </Link>
    </div>
  );
}
