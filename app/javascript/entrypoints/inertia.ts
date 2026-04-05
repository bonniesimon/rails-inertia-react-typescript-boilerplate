import { createInertiaApp } from "@inertiajs/react";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/components/ui/provider";

type ResolvedComponent = { default: React.ComponentType };

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob<ResolvedComponent>("../pages/**/*.tsx", { eager: true });
    return pages[`../pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      createElement(Provider, { forcedTheme: "light" }, createElement(App, props)),
    );
  },
});
