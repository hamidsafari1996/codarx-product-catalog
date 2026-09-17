import Link from "next/link";

function CheckBadgeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 12.2 10.8 14.5 15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3 5 6.5v5.2c0 4.4 2.9 7.5 7 8.8 4.1-1.3 7-4.4 7-8.8V6.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const legalLinks = [
  { href: "#", label: "Compliance" },
  { href: "#", label: "Terms of Sale" },
  { href: "#", label: "Privacy Shield" },
] as const;

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[#f3f4f6]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 text-xs text-[#4b5563] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-3.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2">
          <p>© 2025 Nexus Industrial Solutions Inc. All rights reserved.</p>

          <span className="hidden text-[#d1d5db] sm:inline" aria-hidden="true">
            |
          </span>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-accent-teal">
                <CheckBadgeIcon />
              </span>
              ISO 9001:2015 Certified
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="text-accent-teal">
                <ShieldIcon />
              </span>
              RoHS / REACH Compliant
            </span>
          </div>
        </div>

        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
