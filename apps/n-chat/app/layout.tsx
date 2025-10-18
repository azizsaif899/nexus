import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../src/components/providers/theme-provider'

export { viewport } from './viewport'

export const metadata: Metadata = {
  title: 'FlowCanvasAI - منصة الأتمتة والذكاء الاصطناعي',
  description: 'منصة احترافية للأتمتة والذكاء الاصطناعي مع واجهة محادثة ذكية',
  keywords: ['FlowCanvasAI', 'AI', 'automation', 'chat', 'Arabic', 'AI platform'],
  authors: [{ name: 'FlowCanvasAI Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-arabic antialiased transition-colors duration-300">
        <ThemeProvider
          defaultTheme="dark"
          storageKey="flowcanvas-theme"
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}