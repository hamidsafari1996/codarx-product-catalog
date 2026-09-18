import NexusLogo from "@/components/layout/NexusLogo";

/** Full-viewport splash with centered brand mark for the first app open. */
export default function InitialLoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading Nexus B2B"
    >
      <NexusLogo size={56} showWordmark />
    </div>
  );
}
