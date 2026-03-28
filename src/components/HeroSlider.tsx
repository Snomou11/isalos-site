'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    image: '/images/mprosta.jpg',
    title: 'Isalos Apartments',
    subtitle: 'Directly on the seafront · Naxos, Greece',
    cta: 'Explore Rooms',
    href: '/rooms',
  },
  {
    image: '/images/Beach1.jpg',
    title: 'Wake Up to the Sea',
    subtitle: 'Uninterrupted Aegean views from every room',
    cta: 'Book Your Stay',
    href: '/rooms',
  },
  {
    image: '/images/1.jpg',
    title: 'Your Home in Naxos',
    subtitle: 'Comfort, privacy and the sound of the waves',
    cta: 'See Availability',
    href: '/rooms',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(true)

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length)
        setAnimating(true)
      }, 100)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index: number) => {
    setAnimating(false)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(true)
    }, 100)
  }

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Images — crossfade */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Text — slides up + fades in on each change */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <div
          key={current}
          className={`transition-all duration-700 ${
            animating
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Location badge */}
          <span className="inline-block text-white/70 text-sm font-medium tracking-widest uppercase mb-4">
            📍 Naxos, Greece
          </span>

          {/* Main title */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
            {slides[current].title}
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl mx-auto">
            {slides[current].subtitle}
          </p>

          {/* CTA Button */}
          <Link
            href={slides[current].href}
            className="inline-block bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-full hover:bg-white/90 transition shadow-lg text-base"
          >
            {slides[current].cta} →
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-white w-8 h-2'
                : 'bg-white/40 w-2 h-2 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Left / Right arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition backdrop-blur-sm"
      >
        ‹
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition backdrop-blur-sm"
      >
        ›
      </button>
    </section>
  )
}