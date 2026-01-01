import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	content: ["./src/**/*.tsx"],
	darkMode: ["class"],
	theme: {
		container: {
			center: true,
			padding: "1.5rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
				serif: ["var(--font-serif)", "Playfair Display", ...fontFamily.serif],
			},
			colors: {
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
				// Extended botanical palette
				sage: "hsl(var(--sage))",
				blush: "hsl(var(--blush))",
				cream: "hsl(var(--cream))",
				ink: "hsl(var(--ink))",
				// Premium effect colors
				glow: "hsl(var(--glow))",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				// Organic curves
				"2xl": "1rem",
				"3xl": "1.5rem",
				"4xl": "2rem",
				organic: "2rem",
				"organic-sm": "1.5rem",
				"organic-lg": "3rem",
			},
			boxShadow: {
				bloom: "0 8px 32px hsl(var(--primary) / 0.08), 0 4px 16px hsl(var(--primary) / 0.04)",
				"bloom-lg": "0 16px 48px hsl(var(--primary) / 0.12), 0 8px 24px hsl(var(--primary) / 0.06)",
				glow: "0 0 40px hsl(var(--primary) / 0.15), 0 0 80px hsl(var(--primary) / 0.08)",
				premium: "0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 8px rgba(0, 0, 0, 0.03), 0 12px 24px rgba(0, 0, 0, 0.04), 0 24px 48px rgba(0, 0, 0, 0.03)",
				"premium-lg": "0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.04), 0 24px 48px rgba(0, 0, 0, 0.06)",
			},
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-in-up": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-in-down": {
					"0%": { opacity: "0", transform: "translateY(-20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"slide-in-left": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"scale-in": {
					"0%": { opacity: "0", transform: "scale(0.95)" },
					"100%": { opacity: "1", transform: "scale(1)" },
				},
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				shimmer: {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"float-gentle": {
					"0%, 100%": { transform: "translateY(0) rotate(0deg)" },
					"25%": { transform: "translateY(-6px) rotate(1deg)" },
					"75%": { transform: "translateY(-3px) rotate(-1deg)" },
				},
				bloom: {
					"0%": { opacity: "0", transform: "scale(0.8)" },
					"50%": { transform: "scale(1.02)" },
					"100%": { opacity: "1", transform: "scale(1)" },
				},
				"glow-pulse": {
					"0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.2)" },
					"50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.35)" },
				},
				"slide-up-fade": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				"fade-in": "fade-in 0.5s ease-out forwards",
				"fade-in-up": "fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
				"fade-in-down": "fade-in-down 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
				"slide-in-right": "slide-in-right 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
				"slide-in-left": "slide-in-left 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
				"scale-in": "scale-in 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				shimmer: "shimmer 2s infinite linear",
				float: "float 6s ease-in-out infinite",
				"float-gentle": "float-gentle 8s ease-in-out infinite",
				bloom: "bloom 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
				"glow-pulse": "glow-pulse 2s ease-in-out infinite",
				"slide-up-fade": "slide-up-fade 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
			},
			spacing: {
				"18": "4.5rem",
				"88": "22rem",
				"128": "32rem",
			},
			transitionTimingFunction: {
				premium: "cubic-bezier(0.22, 1, 0.36, 1)",
				"out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
			},
			transitionDuration: {
				"400": "400ms",
				"600": "600ms",
				"800": "800ms",
			},
			backdropBlur: {
				glass: "40px",
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: "65ch",
						color: "hsl(var(--foreground))",
						a: {
							color: "hsl(var(--primary))",
							"&:hover": {
								color: "hsl(var(--primary))",
							},
						},
					},
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
