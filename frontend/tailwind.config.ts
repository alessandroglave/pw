import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/domain/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "3xs": "10px",
        "2xs": "0.7rem",
        md: "0.925rem",
        base: ["0.975rem", "1.5rem"],
        "1.5xl": "1.4rem",
        "2xl": ["1.5rem", "2.25rem"],
        "2.5xl": ["1.75rem", "2.1rem"],
        "3.5xl": ["2rem", "2.5rem"],
        "5.5xl": ["3.375rem", "4.05rem"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          "50": "#f3f7fc",
          "100": "#e6f0f8",
          "200": "#c8dfef",
          "300": "#98c4e1",
          "400": "#60a5d0",
          "500": "#3c8abb",
          "600": "#2b6e9e",
          "700": "#245880",
          "800": "#214b6b",
          "900": "#20405a",
          "950": "#16293b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
