import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { GlobalSearch } from "@/components/GlobalSearch";

export const metadata: Metadata = {
  title: "Visual Workflow Builder",
  description: "Rapidly assemble business process workflows with pre-built templates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
        <GlobalSearch />
      </body>
    </html>
  );
}
