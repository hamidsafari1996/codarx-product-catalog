type ProductDetailProps = {
  slug: string;
};

export default function ProductDetail({ slug }: ProductDetailProps) {
  return (
    <article>
      <h1>Product</h1>
      <p>Single product placeholder for: {slug}</p>
    </article>
  );
}
