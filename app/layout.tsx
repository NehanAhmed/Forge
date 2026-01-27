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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className={hanken.variable} >
      <head>
        <meta name="google-site-verification" content="aH5TsPkodTITeW3eq8pwVvahhPx0T_r-o369HejehVA" />
      </head>
      <body
        className={`${hanken.variable} ${space_grotesk.variable} antialiased`}

      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="top-right" closeButton expand />
          {children}

        </ThemeProvider>
      </body>
    </html>
  );
}
