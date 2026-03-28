'use client'

import Image from 'next/image'
import { useEffect } from 'react'

const images = [
  { src: '/images/beach2.webp', alt: 'Velika beach sunset' },
  { src: '/images/Beach1.webp', alt: 'Beach umbrellas at sunset' },
  { src: '/images/beach3.webp', alt: 'Golden hour at Velika' },
  { src: '/images/mprosta.webp', alt: 'Isalos complex exterior' },
  { src: '/images/mprosta1.webp', alt: 'Complex front view' },
  { src: '/images/sof1.webp', alt: 'Superior Suite 1' },
  { src: '/images/sof1s.webp', alt: 'Superior Suite 1 living' },
  { src: '/images/sof1sa.webp', alt: 'Superior Suite 1 seating' },
  { src: '/images/sof1sal.webp', alt: 'Superior Suite 1 salon' },
  { src: '/images/sof1sal2.webp', alt: 'Superior Suite 1 salon view' },
  { src: '/images/sof1sal3.webp', alt: 'Superior Suite 1 detail' },
  { src: '/images/sof1ver.webp', alt: 'Superior Suite 1 veranda' },
  { src: '/images/sof1bed.webp', alt: 'Superior Suite 1 bedroom' },
  { src: '/images/sof1bath.webp', alt: 'Superior Suite 1 bathroom' },
  { src: '/images/sof1bath1.webp', alt: 'Superior Suite 1 shower' },
  { src: '/images/sof1kou.webp', alt: 'Superior Suite 1 kitchen' },
  { src: '/images/sof1b.webp', alt: 'Superior Suite 1 balcony' },
  { src: '/images/sof2b.webp', alt: 'Superior Suite 2 balcony' },
  { src: '/images/sof2ba.webp', alt: 'Superior Suite 2 bathroom' },
  { src: '/images/sof2bed.webp', alt: 'Superior Suite 2 bedroom' },
  { src: '/images/sof2s.webp', alt: 'Superior Suite 2' },
  { src: '/images/1.webp', alt: 'Studio with sea view' },
  { src: '/images/1bed.webp', alt: 'Studio bedroom' },
  { src: '/images/1katw.webp', alt: 'Studio lower level' },
  { src: '/images/1kouzina.webp', alt: 'Studio kitchen' },
  { src: '/images/2.webp', alt: 'Double room' },
  { src: '/images/2bed.webp', alt: 'Double room bed' },
  { src: '/images/2bath.webp', alt: 'Double room bathroom' },
  { src: '/images/3.webp', alt: 'Family room' },
]

export default function GalleryPage() {
  useEffect(() => {
    const items = document.querySelectorAll('.gallery-reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.12 }
    )

    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-isalos-dark text-center mb-4">
        Gallery
      </h1>
      <p className="text-center text-gray-500 mb-12">
        A glimpse of life at Isalos — rooms, sunsets and the sea.
      </p>

      <style jsx>{`
        .gallery-reveal {
          opacity: 0;
          transform: translateX(-60px);
          transition: opacity 0.8s ease, transform 0.8s ease;
          will-change: transform, opacity;
        }

        .gallery-reveal.is-visible {
          opacity: 1;
          transform: translateX(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-reveal,
          .gallery-reveal.is-visible {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="gallery-reveal break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            style={{ transitionDelay: `${(i % 6) * 80}ms` }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={600}
              height={400}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}