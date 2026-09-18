# Codarx Product Catalog

A headless product catalog built with **WordPress** as the CMS/API backend and a **Next.js** storefront frontend.

Editors manage products in WordPress. The Next.js app fetches catalog data from a custom REST API and renders a searchable, filterable product list and product detail pages.

## Features

- Custom WordPress **Product** post type (title, description, featured image, price, stock)
- **Product Category** taxonomy
- Public REST API with pagination, title search, category and availability filters, and price sorting
- Next.js catalog UI with sidebar filters, sorting, pagination, and single-product pages
- Server-rendered product listing for SEO
- Loading states and clear error messaging when the API is unavailable

## Stack

| Layer | Technology |
| --- | --- |
| CMS / API | WordPress + custom `codarx-products` plugin |
| Database | MySQL 8 (Docker) |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Local infra | Docker Compose (WordPress, MySQL, phpMyAdmin) |

## Prerequisites

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose)
- [Node.js](https://nodejs.org/) 20+ and npm

## Download the project

Clone the repository:

```bash
git clone https://github.com/hamidsafari1996/codarx-product-catalog.git
cd codarx-product-catalog
```

Or download the ZIP from GitHub and extract it, then open the project folder in your terminal.

## Configure environment variables

### 1. Docker / WordPress (repo root)

Copy the example env file and adjust passwords if you want:

```bash
cp .env.example .env
```

Example values:

```env
WORDPRESS_DB_NAME=codarx
WORDPRESS_DB_USER=wp
WORDPRESS_DB_PASSWORD=your_password_here
MYSQL_ROOT_PASSWORD=your_root_password_here
```

### 2. Next.js frontend

Create `frontend/.env.local`:

```env
WP_API_URL=http://localhost:8080
NEXT_PUBLIC_WP_API_URL=http://localhost:8080
```

These point the frontend at the local WordPress container.

## Run WordPress (backend)

From the repository root:

```bash
docker compose up -d
```

Services:

| Service | URL |
| --- | --- |
| WordPress | http://localhost:8080 |
| phpMyAdmin | http://localhost:8081 |

### First-time WordPress setup

1. Open http://localhost:8080 and complete the WordPress installation wizard.
2. In **Plugins**, activate **Codarx Products**.
3. Go to **Settings → Permalinks**, choose **Post name** (or any non-Plain option), and click **Save**.
4. Create products under **Products** (title, description, featured image, price, stock, category).

### Useful API endpoints

With pretty permalinks enabled:

```text
GET http://localhost:8080/wp-json/codarx/v1/products
GET http://localhost:8080/wp-json/codarx/v1/products/{slug}
GET http://localhost:8080/wp-json/codarx/v1/categories
```

If permalinks are still Plain, use:

```text
http://localhost:8080/?rest_route=/codarx/v1/products
```

Query examples:

```text
/wp-json/codarx/v1/products?search=bitumen&category=bitumen&available=true&orderby=price&order=asc&page=1&per_page=12
```

## Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to the catalog at http://localhost:3000/products.

### Production build (optional)

```bash
cd frontend
npm run build
npm start
```

## Project structure

```text
codarx-product-catalog/
├── docker-compose.yml          # WordPress, MySQL, phpMyAdmin
├── .env.example                # Docker env template
├── wordpress/wp-content/       # Mounted into the WP container
│   └── plugins/codarx-products/
└── frontend/                   # Next.js app
    ├── src/app/                # Routes (products list + detail)
    ├── src/components/         # UI (header, sidebar, cards, etc.)
    └── src/lib/api/            # WordPress API client
```

## Stopping local services

```bash
docker compose down
```

To also remove the MySQL volume:

```bash
docker compose down -v
```

## Troubleshooting

- **API 404 / theme “nothing found” page**  
  Save permalinks again (**Settings → Permalinks → Save**). Prefer **Post name** over **Plain**.

- **Frontend shows “Catalog temporarily unavailable”**  
  Confirm Docker is running (`docker compose ps`) and WordPress responds at http://localhost:8080. Check `frontend/.env.local`.

- **Images not loading**  
  Ensure product featured images were uploaded in WordPress and that `NEXT_PUBLIC_WP_API_URL` matches your WordPress origin (`http://localhost:8080`).
