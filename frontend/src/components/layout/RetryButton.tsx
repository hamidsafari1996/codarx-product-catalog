"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type RetryButtonProps = {
  label?: string;
  onRetry?: () => void;
};

export default function RetryButton({
  label = "Try again",
  onRetry,
}: RetryButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          if (onRetry) {
            onRetry();
            return;
          }
          router.refresh();
        });
      }}
      className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isPending ? "Retrying…" : label}
    </button>
  );
}
