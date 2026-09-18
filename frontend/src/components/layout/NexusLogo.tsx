type NexusLogoProps = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
};

export default function NexusLogo({
  size = 28,
  showWordmark = false,
  className = "",
}: NexusLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 text-brand ${className}`}>
      <svg
        width={size}
        height={size}
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
      {showWordmark ? (
        <span className="text-sm font-bold tracking-wide uppercase sm:text-[15px]">
          Nexus B2B
        </span>
      ) : null}
    </div>
  );
}
