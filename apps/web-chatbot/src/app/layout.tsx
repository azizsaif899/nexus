import './globals.css';

export const metadata = {
  title: 'AzizSys AI Assistant',
  description: 'مساعد ذكي متقدم',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}