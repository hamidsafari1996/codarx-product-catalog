"use client";

type HydrationSafeInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Tolerates browser extensions that mutate input attributes before hydration. */
export default function HydrationSafeInput(props: HydrationSafeInputProps) {
  return <input {...props} suppressHydrationWarning />;
}
