import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BFF Service",
  description: "Backend-for-frontend layer for the React client",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
