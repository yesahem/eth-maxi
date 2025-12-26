import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ETHMumbai Maxi Checker ❤️‍🔥",
  description: "Check how big of an ETHMumbai fan you are and generate your Maxi Card!",
  openGraph: {
    title: "ETHMumbai Maxi Checker",
    description: "Are you a true Ethereum enthusiast? Take the quiz and flex your Maxi score.",
    images: ["/og-image.png"], // Optional: could add an OG image later
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased selection:bg-accent selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
