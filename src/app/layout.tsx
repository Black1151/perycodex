import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "../styles/fonts.css";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

// Dynamically set the title based on environment
const isDev = process.env.NODE_ENV === "development";
export const metadata: Metadata = {
  title: isDev
    ? "Perygon - Development / UAT"
    : "Perygon - Your Business Growth Toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel={"icon"} href={"/images/perygonPinkCheck.ico"} />
        <link
          rel="apple-touch-icon"
          href="/apple-icon.png"
          type="image/png"
          sizes="180x180"
        />
      </head>

      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
