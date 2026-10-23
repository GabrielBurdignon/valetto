import localFont from "next/font/local";

/** Derived only by restricting the approved, OFL-licensed Latin file's weight axis. */
export const inter = localFont({
  src: "../assets/fonts/inter-latin-400-600.woff2",
  variable: "--font-valetto-sans",
  weight: "400 600",
  style: "normal",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  fallback: ["Valetto Inter Fallback", "Arial", "Helvetica", "sans-serif"],
});
