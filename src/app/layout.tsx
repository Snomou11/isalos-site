import type { Metadata } from 'next'

import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.isalos-velika.gr'), // ← add this line
  title: 'Isalos Apartments | Beachfront on Velika Beach, Pelion',
  description: 'Family-run beachfront apartments on Velika beach, Pelion, Greece. Sea views, private balconies, sunbeds included. Book direct.',
  keywords: ['Isalos', 'Velika', 'Pelion', 'beachfront apartments', 'Greece', 'Thessaly'],
  openGraph: {
    title: 'Isalos Apartments — Velika, Pelion',
    description: 'Beachfront apartments on Velika beach at the foot of Mount Pelion.',
    url: 'https://www.isalos-velika.gr',
    siteName: 'Isalos Apartments',
    images: [{ url: '/images/mprosta1.webp', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
}



const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-isalos-white text-isalos-dark`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
