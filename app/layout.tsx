import type { Metadata } from "next";
import { Geist, Geist_Mono, Hanken_Grotesk, Inter, Josefin_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken-grotesk' });

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: "--font-space-grotesk"
})
export const metadata: Metadata = {
  title: "Forge - AI Powered Project Planning.",
  description: "Forge transforms vague project ideas into structured, actionable plans with tech stack recommendations, database schemas, risk analysis, and development roadmaps—generated in seconds using AI.",
};

/**
 * Root layout component that wraps application pages with global fonts, theme management, and a toast container.
 *
 * @param children - The page content to render inside the layout.
 * @returns The top-level HTML structure (html > body) containing font classes, ThemeProvider, and a configured Toaster.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className={hanken.variable} >
      <body
        className={`${hanken.variable} ${space_grotesk.variable} antialiased`}

      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="top-right" closeButton expand  />
          {children}

        </ThemeProvider>
      </body>
    </html>
  );
}