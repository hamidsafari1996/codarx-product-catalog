type LoadingSpinnerProps = {
  label?: string;
};

/** Centered spinner used for in-app route transitions. */
export default function LoadingSpinner({
  label = "Loading",
}: LoadingSpinnerProps) {
  return (
    <div
      className="flex min-h-[60vh] w-full flex-col items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="size-10 animate-spin rounded-full border-4 border-muted-bg border-t-brand" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
