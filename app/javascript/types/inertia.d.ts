import type { PageProps } from "@inertiajs/core";

declare global {
  interface Flash {
    notice?: string | null;
    alert?: string | null;
  }

  interface InertiaSharedProps extends PageProps {
    flash: Flash;
    env: "production" | "development" | "test";
  }
}

export {};
