/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          bg: "#090d16",
          panel: "#0f172a",
          card: "#1e293b",
          border: "#334155",
          accent: "#0284c7",
          cyan: "#06b6d4",
          amber: "#f59e0b",
          green: "#10b981",
          red: "#ef4444",
          yellow: "#eab308"
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
