import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ApiErrorMessage from "@/components/layout/ApiErrorMessage";
import ProductDetail from "@/components/products/ProductDetail";
import { getProductBySlug } from "@/lib/api/products";
import { stripHtml } from "@/lib/format";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        title: "Product not found | Codarx Product Catalog",
      };
    }

    return {
      title: `${product.title} | Codarx Product Catalog`,
      description: stripHtml(product.description).slice(0, 160),
    };
  } catch {
    return {
      title: "Catalog unavailable | Codarx Product Catalog",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      notFound();
    }

    return <ProductDetail product={product} />;
  } catch {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <ApiErrorMessage
          title="Unable to load this product"
          message="We couldn't load this product right now. Please try again in a moment."
          showCatalogLink
        />
      </div>
    );
  }
}
