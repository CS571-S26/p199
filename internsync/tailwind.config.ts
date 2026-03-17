import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 25px -15px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config

