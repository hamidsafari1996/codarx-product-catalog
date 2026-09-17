import Link from "next/link";
import type { Product } from "@/types/product";
import { excerpt, formatPrice, productSku } from "@/lib/format";
import ProductThumbnail from "./ProductThumbnail";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image?.url;
  const imageAlt = product.image?.alt || product.title;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="relative aspect-[4/3] bg-muted-bg">
        {imageUrl ? (
          <ProductThumbnail src={imageUrl} alt={imageAlt} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image
          </div>
        )}

        {product.available ? (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-stock-bg px-2.5 py-1 text-xs font-medium text-stock">
            <span className="size-1.5 rounded-full bg-stock" />
            In Stock
          </span>
        ) : (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-muted">
            <span className="size-1.5 rounded-full bg-muted" />
            Out of Stock
          </span>
        )}

        <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white">
          SKU: {productSku(product.id)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {product.category ? (
          <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
            {product.category.name}
          </p>
        ) : null}

        <h3 className="mb-2 text-lg leading-snug font-bold text-brand">
          <Link
            href={`/products/${product.slug}`}
            className="transition-opacity hover:opacity-80"
          >
            {product.title}
          </Link>
        </h3>

        <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {excerpt(product.description) || "No description available."}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-brand">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-muted">/ unit</p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-hover"
          >
            Quick Quote
          </Link>
        </div>
      </div>
    </article>
  );
}
