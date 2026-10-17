import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#c2410c',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen flex flex-col bg-cream-50 text-stone-900">
        {children}
      </body>
    </html>
  );
}
