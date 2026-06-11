import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--tw-primary) / <alpha-value>)",
          foreground: "#ffffff",
          50: "#EEF3FB",
          100: "#D4E2F5",
          200: "#A9C5EB",
          300: "#7EA8E1",
          400: "#538BD7",
          500: "#2A6EC0",
          600: "rgb(var(--tw-primary) / <alpha-value>)",
          700: "#0B2E6A",
          800: "#071F48",
          900: "#040F26",
        },
        green: {
          DEFAULT: "rgb(var(--tw-green) / <alpha-value>)",
          50: "#E8F8EE",
          100: "#C6EDD6",
          200: "#8DDBAD",
          300: "#54C984",
          400: "#2BB56A",
          500: "rgb(var(--tw-green) / <alpha-value>)",
          600: "#187D44",
          700: "#125D33",
          800: "#0C3E22",
          900: "#061F11",
        },
        gold: {
          DEFAULT: "rgb(var(--tw-gold) / <alpha-value>)",
          50: "#FEF8E6",
          100: "#FCEEBE",
          200: "#F9DD7E",
          300: "#F7CC3E",
          400: "rgb(var(--tw-gold) / <alpha-value>)",
          500: "#C49000",
          600: "#946C00",
          700: "#644800",
          800: "#342400",
          900: "#1A1200",
        },
        dark: "rgb(var(--tw-dark) / <alpha-value>)",
        background: "#F8FAFC",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.6s ease-out",
        bounce: "bounce 2s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0F3D8C 0%, #1F9D55 100%)",
        "hero-overlay":
          "linear-gradient(to bottom, rgba(15,61,140,0.8) 0%, rgba(31,157,85,0.7) 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #F4B400 0%, #f97316 100%)",
        "blue-gradient":
          "linear-gradient(135deg, #0F3D8C 0%, #2A6EC0 100%)",
        "green-gradient":
          "linear-gradient(135deg, #1F9D55 0%, #2BB56A 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(15, 61, 140, 0.08)",
        "card-hover": "0 8px 40px rgba(15, 61, 140, 0.16)",
        gold: "0 4px 24px rgba(244, 180, 0, 0.3)",
        blue: "0 4px 24px rgba(15, 61, 140, 0.3)",
        green: "0 4px 24px rgba(31, 157, 85, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
