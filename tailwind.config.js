/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EF5A3D",
        background: "#FFFCF9",
        chocolate: "#4A2C2A",
        accent: {
          yellow: "#FFF5D6",
          blue: "#E3F2FD",
          pink: "#FFEBEE",
          gray: "#E5E7EB",
        }
      },
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        alimama: ["Alimama", "sans-serif"],
        muyao: ["Muyao", "cursive"],
        genjyuu: ["GenJyuu", "sans-serif"],
        sans: ["Fredoka", "GenJyuu", "PingFang SC", "Microsoft YaHei", "sans-serif"],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
