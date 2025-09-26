import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateColumns: {
        '3': 'repeat(3, minmax(0, 1fr))',
      },
      colors: {
        // Legacy semantic colors (maintained for backward compatibility)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // OneView Design System Color Palette
        // Brand Blue Scale
        blue: {
          50: "var(--blue-50)",
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
          400: "var(--blue-400)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          800: "var(--blue-800)",
          900: "var(--blue-900)",
        },

        // Neutral Gray Scale
        gray: {
          '00': "var(--gray-00)",
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
        },

        // Semantic Green Scale
        green: {
          50: "var(--green-50)",
          100: "var(--green-100)",
          200: "var(--green-200)",
          300: "var(--green-300)",
          400: "var(--green-400)",
          500: "var(--green-500)",
          600: "var(--green-600)",
          700: "var(--green-700)",
          800: "var(--green-800)",
          900: "var(--green-900)",
        },

        // Semantic Orange Scale
        orange: {
          50: "var(--orange-50)",
          100: "var(--orange-100)",
          200: "var(--orange-200)",
          300: "var(--orange-300)",
          400: "var(--orange-400)",
          500: "var(--orange-500)",
          600: "var(--orange-600)",
          700: "var(--orange-700)",
          800: "var(--orange-800)",
          900: "var(--orange-900)",
        },

        // Semantic Red Scale
        red: {
          50: "var(--red-50)",
          100: "var(--red-100)",
          200: "var(--red-200)",
          300: "var(--red-300)",
          400: "var(--red-400)",
          500: "var(--red-500)",
          600: "var(--red-600)",
          700: "var(--red-700)",
          800: "var(--red-800)",
          900: "var(--red-900)",
        },

        // Semantic Color Mappings (for direct use)
        text: {
          body: "var(--text-body)",
          "body-reversed": "var(--text-body-reversed)",
          secondary: "var(--text-secondary)",
          "secondary-reversed": "var(--text-secondary-reversed)",
          disabled: "var(--text-disabled)",
          hyperlink: "var(--text-hyperlink)",
          "link-hover": "var(--text-link-hover)",
          "link-reversed": "var(--text-link-reversed)",
          "reversed-link-hover": "var(--text-reversed-link-hover)",
          notice: "var(--text-notice)",
          warning: "var(--text-warning)",
          alert: "var(--text-alert)",
        },

        icon: {
          default: "var(--icon-default)",
          hover: "var(--icon-hover)",
          selected: "var(--icon-selected)",
          disabled: "var(--icon-disabled)",
          reversed: "var(--icon-reversed)",
          "reversed-hover": "var(--icon-reversed-hover)",
          "reversed-selected": "var(--icon-reversed-selected)",
          "active-reversed": "var(--icon-active-reversed)",
          "accent-reversed": "var(--icon-accent-reversed)",
        },

        button: {
          primary: "var(--button-primary)",
          "primary-hover": "var(--button-primary-hover)",
          secondary: "var(--button-secondary)",
          "secondary-hover": "var(--button-secondary-hover)",
          "secondary-reversed": "var(--button-secondary-reversed)",
          "secondary-reversed-hover": "var(--button-secondary-reversed-hover)",
          add: "var(--button-add)",
          "add-hover": "var(--button-add-hover)",
          disabled: "var(--button-disabled)",
          reversed: "var(--button-reversed)",
          warning: "var(--button-warning)",
          alert: "var(--button-alert)",
          light: "var(--button-light)",
          "light-blue": "var(--button-light-blue)",
        },

        bg: {
          default: "var(--background-default)",
          light: "var(--background-light)",
          "light-blue": "var(--background-light-blue)",
          med: "var(--background-med)",
          "med-blue": "var(--background-med-blue)",
          dark: "var(--background-dark)",
          darkest: "var(--background-darkest)",
          notice: "var(--background-notice)",
          success: "var(--background-success)",
          error: "var(--background-error)",
          "div-item-hover": "var(--background-div-item-hover)",
          "div-item-selected": "var(--background-div-item-selected)",
        },

        stroke: {
          dark: "var(--stroke-dark)",
          med: "var(--stroke-med)",
          focused: "var(--stroke-focused)",
          error: "var(--stroke-error)",
        },

        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          error: "var(--status-error)",
          info: "var(--status-info)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
} satisfies Config;
