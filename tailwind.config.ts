import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        heat: "var(--heat)",
        canvas: "var(--canvas)",
        line: "var(--line)",
      },
      boxShadow: { quiet: "var(--shadow)" },
    },
  },
  plugins: [],
} satisfies Config;
