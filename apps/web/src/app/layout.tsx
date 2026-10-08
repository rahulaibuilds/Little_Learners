import "./globals.css";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Provider } from "@learnnest/ui";
import { SessionProvider } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import { parsePathname } from "next/navigation";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL?: string;
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_APP_NAME?: string;
    }
  }
}

const prisma = new PrismaClient()

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