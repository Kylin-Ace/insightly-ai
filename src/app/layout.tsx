import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Insightly — Business analytics, made clear",
  description: "Explore sample business metrics, export CSV data, and generate AI reports.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}
