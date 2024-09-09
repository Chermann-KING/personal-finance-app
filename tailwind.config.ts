import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          500: "#98908B",
          100: "#F8F4F0",
        },
        grey: {
          900: "#201F24",
          500: "#696868",
          300: "#B3B3B3",
          100: "#F2F2F2",
        },
        green: "#277C78",
        yellow: "#F2CDAC",
        cyan: "#82C9D7",
        navy: "#626070",
        red: "#C94736",
        purple: "#826CB0",
        purpleAlt: "#AF81BA",
        turquoise: "#597C7C",
        brown: "#93674F",
        magenta: "#934F6F",
        blue: "#3F82B2",
        navyGrey: "#97A0AC",
        armyGreen: "#7F9161",
        gold: "#CAB361",
        orange: "#BE6C49",
        white: "#FFFFFF",
      },
      boxShadow: {
        custom: "0px 0px 14px 1px rgba(0, 0, 0, 0.10)",
      },
      fontFamily: {
        sans: ["Public Sans", "sans-serif"],
      },
      fontSize: {
        "preset-1": ["2rem", { lineHeight: "120%", letterSpacing: "0px" }],
        "preset-2": ["1.25rem", { lineHeight: "120%", letterSpacing: "0px" }],
        "preset-3": ["1rem", { lineHeight: "150%", letterSpacing: "0px" }],
        "preset-4": ["0.875rem", { lineHeight: "150%", letterSpacing: "0px" }],
        "preset-5": ["0.75rem", { lineHeight: "150%", letterSpacing: "0px" }],
      },
      fontWeight: {
        bold: "700",
        regular: "400",
      },
      spacing: {
        500: "40px",
        400: "32px",
        300: "24px",
        250: "20px",
        200: "16px",
        150: "12px",
        100: "8px",
        50: "4px",
      },
    },
  },
  plugins: [],
};
export default config;
