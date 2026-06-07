import type {Metadata} from 'next';
import { Cormorant_Garamond, Hind } from 'next/font/google';
import './globals.css'; // Global styles

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

const hind = Hind({
  subsets: ['latin', 'devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Shree Chhatrapali Tirthadevi Secondary School | श्री छत्रपाली तीर्थादेवी माध्यमिक विद्यालय',
  description: 'Bilingual (English & Nepali) official portal of Shree Chhatrapali Tirthadevi Secondary School, Pakadi, Kapilvastu, Nepal.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${hind.variable} scroll-smooth`}>
      <body className="font-sans bg-[#f9f7f2] text-[#2d2d2d] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
