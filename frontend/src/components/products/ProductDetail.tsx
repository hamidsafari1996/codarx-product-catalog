import Link from "next/link";
import type { Product } from "@/types/product";
import ProductThumbnail from "@/components/products/ProductThumbnail";
import { formatPrice, stripHtml } from "@/lib/format";

type ProductDetailProps = {
  product: Product;
};

function HomeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 12.5 9.5 17 19 7.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const imageUrl = product.image?.url;
  const imageAlt = product.image?.alt || product.title;
  const description = stripHtml(product.description);
  const shortTitle =
    product.title.split(/\s+/).slice(0, 2).join(" ") || product.title;

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <li className="inline-flex items-center gap-1.5">
            <HomeIcon />
            <Link href="/" className="transition-colors hover:text-brand">
              Home
            </Link>
          </li>
          {product.category ? (
            <>
              <li aria-hidden="true">&gt;</li>
              <li>
                <Link
                  href={`/?category=${encodeURIComponent(product.category.slug)}`}
                  className="transition-colors hover:text-brand"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden="true">&gt;</li>
          <li className="font-semibold text-foreground" aria-current="page">
            {shortTitle}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted-bg">
          <div className="relative aspect-[4/3] w-full">
            {imageUrl ? (
              <ProductThumbnail
                src={imageUrl}
                alt={imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {product.category ? (
            <span className="mb-4 inline-flex w-fit rounded-full bg-category-bg px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-category uppercase">
              {product.category.name}
            </span>
          ) : null}

          <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
            {product.title}
          </h1>

          {product.available ? (
            <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-stock-bg px-3 py-1.5 text-sm font-medium text-stock">
              <CheckIcon />
              In Stock
            </span>
          ) : (
            <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-muted-bg px-3 py-1.5 text-sm font-medium text-muted">
              Out of Stock
            </span>
          )}

          <div className="mb-5 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-brand sm:text-4xl">
              {formatPrice(product.price)}
            </span>
            <span className="text-base text-muted">/ unit</span>
          </div>

          <p className="mb-8 max-w-xl text-base leading-relaxed text-muted">
            {description || "No description available for this product."}
          </p>

          <a
            href={`mailto:contact@nexusb2b.com?subject=${encodeURIComponent(
              `Order inquiry: ${product.title}`,
            )}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover sm:w-auto sm:min-w-[240px]"
          >
            <MailIcon />
            Contact for Order
          </a>
        </div>
      </div>
    </article>
  );
}
