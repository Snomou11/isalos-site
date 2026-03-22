import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About Us | Isalos Apartments — Velika, Pelion',
  description: 'Learn about Isalos, a family-run beachfront apartment complex on Velika beach at the foot of Mount Pelion, Greece.',
}

export default function AboutPage() {
  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase text-isalos-blue mb-5">
          Our Story
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-isalos-dark mb-4">
          About Isalos
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          A family story, a love for the sea, and a beautiful corner of Pelion.
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg">
          <Image src="/images/mprosta1.jpg" alt="Isalos Apartments exterior" fill className="object-cover" />
        </div>
        <div className="space-y-5 text-gray-600 leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-isalos-dark">
            Where Pelion meets the sea
          </h2>
          <p>
            Isalos sits right on Velika beach, one of the most unspoilt stretches of coastline
            on the Pelion peninsula. With the dense green forests of Mount Pelion rising
            behind you and the calm blue waters of the Aegean stretching ahead, it is a place
            unlike anywhere else in Greece.
          </p>
          <p>
            We are a family-run complex, built and operated with care and a deep love for
            this land. Every apartment has been designed to feel like a real home — warm,
            comfortable and full of character, with stone walls, wooden ceilings and
            sea-view balconies.
          </p>
          <p>
            Our guests are not just visitors — they become part of the Isalos family.
            Many return year after year, and that is the greatest compliment we could ever receive.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
        {[
          { icon: '🌿', title: 'Nature & Tranquility', desc: 'Surrounded by the lush forests of Pelion and the calm Aegean sea — far from the crowds.' },
          { icon: '❤️', title: 'Family Hospitality',   desc: 'We treat every guest as a friend. Personal attention and genuine warmth from arrival to departure.' },
          { icon: '🏖️', title: 'Beach Life Included',  desc: 'Sunbeds, umbrellas, kayaks and snorkeling equipment — the beach experience is part of your stay.' },
        ].map(v => (
          <div key={v.title} className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="text-4xl mb-4">{v.icon}</div>
            <h3 className="font-bold text-lg mb-2 text-isalos-dark">{v.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-isalos-dark mb-4">
          Ready to experience it yourself?
        </h2>
        <Link href="/rooms"
          style={{ background: 'linear-gradient(135deg, #2B6CB0, #1A365D)', color: 'white' }}
          className="inline-block font-bold px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-base">
          View Our Rooms →
        </Link>
      </div>
    </div>
  )
}
