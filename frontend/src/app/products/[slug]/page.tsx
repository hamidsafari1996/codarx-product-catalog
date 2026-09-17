import ProductDetail from "@/components/products/ProductDetail";

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;

  return <ProductDetail slug={slug} />;
}
