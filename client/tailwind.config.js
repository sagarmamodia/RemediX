/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284c7', // Sky 600 - Trustworthy, professional blue
          hover: '#0369a1',   // Sky 700
          light: '#e0f2fe',   // Sky 100
        },
        secondary: {
          DEFAULT: '#64748b', // Slate 500 - Neutral secondary
          hover: '#475569',   // Slate 600
        },
        background: {
          DEFAULT: '#f8fafc', // Slate 50 - Very light grey for main background
          paper: '#ffffff',   // White for cards/surfaces
        },
        text: {
          main: '#0f172a',    // Slate 900 - High contrast text
          muted: '#64748b',   // Slate 500 - Secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
