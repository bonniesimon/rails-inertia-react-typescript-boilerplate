"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { customTheme } from "@/theme";
import { Toaster } from "./toaster";
import { useInertiaToasts } from "@/hooks/useInertiaToast";

export type ColorModeProviderProps = ThemeProviderProps;

function InnerProvider({ children }: { children: React.ReactNode }) {
  useInertiaToasts();
  return <>{children}</>;
}

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={customTheme}>
      <Toaster />
      <ThemeProvider attribute="class" disableTransitionOnChange {...props}>
        <InnerProvider>{props.children}</InnerProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
