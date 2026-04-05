import { createSystem, defaultConfig } from "@chakra-ui/react";

export const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#e9f6f1" },
          100: { value: "#d3eee4" },
          200: { value: "#a7ddc9" },
          300: { value: "#7accae" },
          400: { value: "#4ebb93" },
          500: { value: "#2f8f6b" },
          600: { value: "#267558" },
          700: { value: "#1f5e48" },
          800: { value: "#174635" },
          900: { value: "#0f2d22" },
          950: { value: "#071712" },
        },
      },
      fonts: {
        heading: { value: "'Montserrat', sans-serif" },
        body: { value: "'Montserrat', sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        "primary-subtle": { value: "{colors.primary.50}" },
        "primary-base": { value: "{colors.primary.500}" },
        "primary-bold": { value: "{colors.primary.700}" },
        "primary-hover": { value: "{colors.primary.600}" },
        "primary-active": { value: "{colors.primary.700}" },
        "on-primary-subtle": { value: "{colors.neutral.900}" },
        "on-primary-base": { value: "white" },
        "on-primary-bold": { value: "white" },
      },
    },
  },
});
