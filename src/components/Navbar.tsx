'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

const navLinks = [
  { href: '/',          label: 'Home',       el: 'Αρχική'    },
  { href: '/rooms',     label: 'Rooms',      el: 'Δωμάτια'   },
  { href: '/gallery',   label: 'Gallery',    el: 'Γκαλερί'   },
  { href: '/area-guide',label: 'Area Guide', el: 'Περιοχή'   },
  { href: '/contact',   label: 'Contact',    el: 'Επικοινωνία'},
]

export default function Navbar() {
  const [open, setOpen]   = useState(false)
  const [lang, setLang]   = useState<'en' | 'el'>('en')

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-24 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-serif text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
          ISALOS
        </Link>

        {/* Desktop menu - WHITE TEXT */}
{/* Only change the desktop menu section in your navbar */}
<div className="hidden lg:flex items-center gap-12">
  {navLinks.map(l => (
    <Link key={l.href} href={l.href} className="text-lg font-semibold text-white/90 hover:text-white transition-all duration-300 py-2 hover:scale-105">
      {lang === 'en' ? l.label : l.el}
    </Link>
  ))}
  
  {/* Language + Book Now + Contacts (NEW ORDER) */}
  <div className="flex items-center gap-3 ml-8">
    <button onClick={() => setLang(lang === 'en' ? 'el' : 'en')}
      className="px-3 py-2 text-sm font-bold text-white/80 bg-black/50 hover:bg-white/10 border border-white/30 rounded-full transition-all shadow-lg hover:shadow-xl">
      {lang === 'en' ? 'ΕΛ' : 'EN'}
    </button>
    
    {/* BOOK NOW + Phone/Email RIGHT */}
    <Link href="/rooms" className="px-8 py-3 font-bold text-sm bg-white text-black rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 tracking-wide">
      {lang === 'en' ? 'Book Now' : 'Κράτηση'}
    </Link>
    
    <Link href="contact" className="p-3 hover:bg-white/10 rounded-full transition-all shadow-lg hover:shadow-xl">
      <PhoneIcon className="w-6 h-6 text-white" />
    </Link>

    <Link href="/contact" className="p-3 hover:bg-white/10 rounded-full transition-all shadow-lg hover:shadow-xl">
      <EnvelopeIcon className="w-6 h-6 text-white" />
    </Link>
  </div>
</div>

        {/* Mobile */}
        <button className="lg:hidden p-2 text-white" onClick={() => setOpen(!open)}>
          {open ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/20 px-6 py-8 space-y-4">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-xl font-semibold text-white/90 hover:text-white py-4 hover:bg-white/10 px-6 rounded-2xl transition-all">
              {lang === 'en' ? l.label : l.el}
            </Link>
          ))}
          <div className="pt-6 border-t border-white/20 flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'el' : 'en')}
              className="text-sm font-bold px-4 py-2 bg-white/10 text-white border border-white/30 rounded-full hover:bg-white/20">
              {lang === 'en' ? 'ΕΛ' : 'EN'}
            </button>
            <Link href="/rooms" onClick={() => setOpen(false)}
              className="flex-1 font-bold text-center py-3 bg-white text-black rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              {lang === 'en' ? 'Book Now' : 'Κράτηση'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
