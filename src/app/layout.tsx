import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Insightly — Business analytics, made clear",
  description: "Understand your business with live performance metrics and AI-generated reports.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}
