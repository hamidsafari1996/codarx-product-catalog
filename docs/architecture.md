# Architecture & Technical Decisions

## Overview

This project is a **headless product catalog**: WordPress is the CMS and HTTP API, and a Next.js App Router storefront consumes that API. The split keeps content work in the familiar WordPress admin (products, categories, media) while the frontend owns layout, filtering UX, and SEO-friendly HTML. Editors do not depend on theme templates; the Next app does not embed business content in static files.

## WordPress plugin decisions

### Custom plugin instead of ACF

The brief required **no ACF dependency**. The `codarx-products` plugin owns:

- Custom post type `codarx_product` (title, editor/description, featured image)
- Taxonomy `codarx_product_category`
- A custom meta box for **price** and **stock**, with shared sanitization in `Codarx_Products_Sanitize`
- Modular classes wired through a small `Codarx_Products_Registrable` contract and a singleton bootstrap

That keeps the solution self-contained, versionable with the repo, and free of paid plugins.

### Stock storage and “available”

Stock is stored as **numeric** post meta `_codarx_product_stock`, not a separate boolean field. The admin UI presents In Stock / Out of Stock radios; values are sanitized to `1` or `0`. Availability is always derived as **`stock > 0`**:

- In the meta box UI (`(int) $stock > 0`)
- In the public API payload (`available` boolean from the transformer)
- In the collection filter (`available=true` → meta query on `_codarx_product_stock` with `compare => '>'`)

Numeric storage keeps filter logic simple and remains compatible with any older quantity-style values still in the database.

### Hand-shaped REST responses

The public surface is **`GET /wp-json/codarx/v1/products`** (plus `/{slug}` and `/categories`), not the default `wp/v2` post schema. A dedicated transformer maps each product to a small contract: `id`, `title`, `slug`, `description`, `price`, `available`, `image`, `category`, plus a `pagination` object on the collection. That avoids leaking editor-only WordPress fields (`guid`, raw `meta`, capabilities, etc.) to the storefront.

### Query validation and sanitization

Collection query args (`page`, `per_page`, `search`, `category`, `available`, `min_price`, `max_price`, `orderby`, `order`) use WordPress REST **`validate_callback` / `sanitize_callback`** pairs (e.g. `rest_validate_request_arg` + `absint` / `sanitize_text_field`).

**Bug found in testing:** registering `type` / `minimum` alone was not enough. Without `validate_callback => 'rest_validate_request_arg'`, invalid `page` values were sanitized (e.g. via `absint`) and the request still returned **200**. After adding the validate callback (and `minimum => 1` on `page`), invalid paging correctly returns **400** — covered by PHPUnit.

## Next.js frontend decisions

### Server Component catalog page

`app/products/page.tsx` is an **async Server Component**. It reads `searchParams`, calls `getProducts()` / `getCategories()` with `fetch()` on the server (`cache: "no-store"`), and renders the list in the response HTML. There is no `useEffect` for the initial product load, so crawlers and users with JS limited still see product content in the first document.

### Interactive filters via the URL

Sidebar filters, header search, and sort controls are **Client Components**. They update **URL query params** (form GET or `router.push`), which triggers a new server render of `/products`. Persisting state in the URL makes filters shareable, bookmarkable, and back-button friendly, while the data fetch stays server-side.

### Loading, empty, and error states

| State | Behavior |
| --- | --- |
| First app open | Full-page splash with centered brand logo |
| In-app navigation | Centered spinner via route `loading.tsx` files |
| Empty results | “No products matched your filters.” |
| API failure | Generic user-facing alert + retry |

User-visible errors stay **non-technical** (no “WordPress”, Docker, or stack details). The API client throws clearer messages server-side; the Next route error boundary can log them — they never reach the UI copy.

### API base URL

All product/category fetches go through a single **`getApiBaseUrl()`** helper in `src/lib/api/products.ts`, reading `WP_API_URL` then `NEXT_PUBLIC_WP_API_URL` (with a local fallback). No page hardcodes the WordPress host.

## Testing

PHPUnit (via `wp-phpunit/wp-phpunit`) targets the **REST API** inside the WordPress Docker container against a separate `codarx_test` database. Coverage includes:

- Category filter
- Availability filter (stock meta `> 0`)
- Price sort order
- Invalid `page` → 400
- Pagination totals

The API is the contract between CMS and storefront; locking it with integration tests catches regressions that would break both admin-driven content and the Next app. Frontend automated tests were deprioritized relative to that boundary.

## Trade-offs / deferred work

Given take-home time limits, the following were intentionally skipped or kept minimal:

- No automated frontend tests (Playwright/Jest/RTL)
- No CI pipeline (GitHub Actions, etc.)
- No dedicated image CDN/optimization pipeline beyond serving WordPress media URLs (catalog cards use plain `<img>` to avoid local HTTP optimizer friction)
- No authentication/authorization on the public read API (catalog is intentionally public)
- No cart/checkout or quote submission backend (CTA is contact-oriented)
- Stock admin UX is a simple availability control rather than a full inventory system

These are reasonable next steps if the project moved beyond a take-home scope.
