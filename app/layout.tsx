import type { Metadata } from "next";
import "./globals.css";
import { DemoProvider } from "@/components/demo-provider";

const productName = process.env.NEXT_PUBLIC_PRODUCT_NAME || "ChalkEvo";

export const metadata: Metadata = {
  title: `${productName} · Teaching that learns`,
  description: "Turn today's teaching into tomorrow's understanding.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><DemoProvider>{children}</DemoProvider></body>
    </html>
  );
}
