import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Candy Shop | Artisan Sweets",
  description: "Premium handcrafted candies and chocolates for every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="font-poppins min-h-full flex flex-col antialiased bg-white">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
