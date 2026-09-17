const DEFAULT_WP_ORIGIN = "http://localhost:8080";

export function getWordPressOrigin() {
  const raw =
    process.env.NEXT_PUBLIC_WP_API_URL ??
    process.env.WP_API_URL ??
    DEFAULT_WP_ORIGIN;

  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_WP_ORIGIN;
  }
}

/** Ensures product image URLs resolve in the browser and in Next image config. */
export function normalizeProductImageUrl(url: string | undefined | null) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const wpOrigin = getWordPressOrigin();

    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return new URL(parsed.pathname + parsed.search, wpOrigin).toString();
    }

    return parsed.toString();
  } catch {
    return null;
  }
}
