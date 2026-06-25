"use client";

import { useCallback } from "react";

export function useSmoothScroll() {
  const scrollTo = useCallback((elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return scrollTo;
}
