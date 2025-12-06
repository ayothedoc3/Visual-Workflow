import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        canvas: "var(--canvas)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        issue: "var(--issue)",
        action: "var(--action)",
        resource: "var(--resource)",
        deliverable: "var(--deliverable)",
      },
    },
  },
  plugins: [],
} satisfies Config;
