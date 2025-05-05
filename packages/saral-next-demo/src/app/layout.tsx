import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saral Toolkit Demo",
  description: "A demo for Saral Toolkit components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-primary text-white py-6 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                <Link href="/">Saral Toolkit Demo</Link>
              </h1>
              <nav>
                <ul className="flex gap-6">
                  <li>
                    <Link 
                      href="/core-demo" 
                      className="text-white hover:text-white/80 transition"
                    >
                      Core Demo
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/parser-demo" 
                      className="text-white hover:text-white/80 transition"
                    >
                      Parser UI Demo
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}