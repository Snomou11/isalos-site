import type { Metadata } from 'next'

import { Inter, Playfair_Display, Cormorant_Garamond  } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.isalosapartments.com'),
  title: 'Isalos Apartments | Seaside on Velika Beach, Larisa',
  description: 'Family-run Seaside apartments on Velika beach, Larisa, Greece. Sea views, private balconies, sunbeds included. Book direct.',
  keywords: ['Isalos', 'Velika', 'Larisa', 'Seaside apartments', 'Greece', 'Thessaly', 'isalos apartments', 'isalos velika', 'isalosapartments.com', 'velika beach accommodation'],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'Isalos Apartments — Velika, Larisa',
    description: 'Seaside apartments on Velika beach at the foot of Mount Olympos.',
    url: 'https://www.isalosapartments.com',
    siteName: 'Isalos Apartments',
    images: [{ url: 'https://www.isalosapartments.com/images/mprosta1.webp', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Isalos Apartments — Velika, Larisa',
    description: 'Seaside apartments directly on Velika beach, Greece.',
    images: ['https://www.isalosapartments.com/images/mprosta1.webp'],
  },
  alternates: {
    canonical: 'https://www.isalosapartments.com',
  },
}

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cormorant',
})

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${cormorant.variable} ${playfair.variable} font-sans bg-isalos-white text-isalos-dark`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
