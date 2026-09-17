import { normalizeProductImageUrl } from "@/lib/images";

type ProductThumbnailProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Plain img avoids Next optimizer issues with local WordPress over HTTP. */
export default function ProductThumbnail({
  src,
  alt,
  className = "absolute inset-0 h-full w-full object-cover",
}: ProductThumbnailProps) {
  const normalizedSrc = normalizeProductImageUrl(src);

  if (!normalizedSrc) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- WordPress dev URLs are not reliably optimized.
    <img src={normalizedSrc} alt={alt} className={className} loading="lazy" />
  );
}
