import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "LearnNest India",
  description: "Indian Early Learning & Kindergarten Platform",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}