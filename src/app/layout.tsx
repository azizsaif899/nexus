import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const cairo = Cairo({ 
  subsets: ['arabic'],
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
      <body className={`${inter.variable} ${cairo.variable} font-arabic antialiased`}>
        <div className="min-h-screen bg-slate-950 text-white">
          {children}
        </div>
      </body>
    </html>
  )
}