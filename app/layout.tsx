import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local"
import "./globals.css"

const _nunito = Nunito({ subsets: ["latin"],
  variable: "--font-nunito",
 })

const _lazydog = localFont({ src: "./fonts/LazyDog-Regular.ttf",
  variable: "--font-lazydog",
  display: "swap",
 })

export const metadata: Metadata = {
  title: "Whisk'd - Order Online",
  description: "Cheesecakes, Puddings, and More - Order Your Favorites Online!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_nunito.className} ${_lazydog.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
