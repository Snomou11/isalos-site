'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navLinks = [
  { href: '/',            label: 'Home',       el: 'Αρχική'    },
  { href: '/rooms',       label: 'Rooms',      el: 'Δωμάτια'   },
  { href: '/gallery',     label: 'Gallery',    el: 'Γκαλερί'   },
  { href: '/area-guide',  label: 'Area Guide', el: 'Περιοχή'   },
  { href: '/contact',     label: 'Contact',    el: 'Επικοινωνία'},
]

export default function Navbar() {
  const [open, setOpen]   = useState(false)
  const [lang, setLang]   = useState<'en' | 'el'>('en')

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
{/* Logo */}
<div className="flex items-center gap-8">
  <Link href="/" className="font-serif text-2xl font-bold text-isalos-blue tracking-wide">
    ISALOS
  </Link>
</div>


{/* Desktop links */}
<div className="hidden md:flex items-center gap-8">
  {navLinks.map(l => (
    <Link
      key={l.href}
      href={l.href}
      className="text-sm font-medium text-isalos-dark hover:text-isalos-blue transition-colors"
    >
      {lang === 'en' ? l.label : l.el}
    </Link>
  ))}

  {/* Language switcher */}
  <button
    onClick={() => setLang(lang === 'en' ? 'el' : 'en')}
    style={{
      backgroundColor: '#1A365D',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: '9999px',
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem',
      fontWeight: 'bold',
    }}
    className="hover:bg-[#2B6CB0] transition-colors"
  >
    {lang === 'en' ? 'ΕΛ' : 'EN'}
  </button>

  {/* Book Now */}
  <Link
    href="/rooms"
    style={{
      backgroundColor: '#2B6CB0',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: '9999px',
      padding: '0.5rem 1.25rem',
      fontSize: '0.875rem',
      fontWeight: 'bold',
    }}
    className="hover:bg-[#1A365D] transition-colors"
  >
    {lang === 'en' ? 'Book Now' : 'Κράτηση'}
  </Link>
</div>



        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          {navLinks.map(l => (
          <Link
            href="/rooms"
            onClick={() => setOpen(false)}
            className="mt-2 inline-block text-center bg-isalos-blue text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-isalos-dark transition-colors"
          >
            {lang === 'en' ? 'Book Now' : 'Κράτηση'}
          </Link>
          ))}
          <button onClick={() => setLang(lang === 'en' ? 'el' : 'en')}
            className="self-start text-xs font-bold border border-isalos-blue text-isalos-blue px-3 py-1 rounded-full">
            {lang === 'en' ? 'ΕΛ' : 'EN'}
          </button>
        </div>
        
      )}
    </nav>
  )
}
