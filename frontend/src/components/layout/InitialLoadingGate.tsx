"use client";

import { useEffect, useState, type ReactNode } from "react";
import InitialLoadingScreen from "@/components/layout/InitialLoadingScreen";

type InitialLoadingGateProps = {
  children: ReactNode;
};

/** Shows the centered logo once on first app open, then keeps the app mounted across navigations. */
export default function InitialLoadingGate({ children }: InitialLoadingGateProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!ready) {
    return <InitialLoadingScreen />;
  }

  return children;
}
