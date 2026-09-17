import Link from "next/link";

function NexusLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="6" fill="currentColor" />
      <path
        d="M8 20V8h3.1l5.2 7.4V8H20v12h-3.1l-5.2-7.4V20H8Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 21l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-brand transition-opacity hover:opacity-80"
          >
            <NexusLogo />
            <span className="text-sm font-bold tracking-wide uppercase sm:text-[15px]">
              Nexus B2B
            </span>
          </Link>
        </div>

        <div className="min-w-0 flex-1">
          <form action="/" method="get" className="mx-auto w-full max-w-2xl">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <div className="flex items-center gap-2.5 rounded-full bg-muted-bg px-4 py-2.5">
              <span className="text-muted">
                <SearchIcon />
              </span>
              <input
                id="product-search"
                name="search"
                type="search"
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              />
            </div>
          </form>
        </div>

        <div className="shrink-0">
          <a
            href="mailto:contact@nexusb2b.com"
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-hover sm:px-5"
          >
            Contact Us
          </a>
        </div>
      </div>
    </header>
  );
}
