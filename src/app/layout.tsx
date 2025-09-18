import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils"

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo'
})

export const metadata: Metadata = {
  title: 'AzizSys - نظام متكامل للأعمال الذكية',
  description: 'منصة شاملة تجمع بين الأتمتة المرئية والذكاء الاصطناعي وإدارة العملاء',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={cn(
          "min-h-screen bg-background font-arabic antialiased",
          inter.variable,
          cairo.variable
        )}>
        {children}
      </body>
    </html>
  )
}
