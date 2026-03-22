import Link from 'next/link'
import Image from 'next/image'

export const rooms = [
  {
    slug: 'studio',
    name: 'Studio',
    description: 'Cozy and bright studio with kitchenette, sofa bed, A/C and a private balcony with direct sea views.',
    max_guests: 2,
    price_per_night: 60,
    amenities: ['Sea View Balcony', 'Kitchenette', 'A/C', 'Free Wi-Fi', 'Private Bathroom', 'Towels Included'],
    images: ['/images/1.jpg', '/images/1bed.jpg', '/images/1katw.jpg', '/images/1kouzina.jpg'],
  },
  {
    slug: 'double',
    name: 'Double Room',
    description: 'Elegant double room featuring a signature stone wall, floating bed with LED lighting and sea-view balcony.',
    max_guests: 2,
    price_per_night: 70,
    amenities: ['Sea View Balcony', 'Double Bed', 'Stone Wall Feature', 'A/C', 'Free Wi-Fi', 'Private Bathroom'],
    images: ['/images/2.jpg', '/images/2bed.jpg', '/images/2bath.jpg'],
  },
  {
    slug: 'superior-suite-1',
    name: 'Superior Suite 1',
    description: 'Spacious suite with wooden ceiling, stone walls, premium rain shower, full kitchen and large sea-view terrace.',
    max_guests: 2,
    price_per_night: 90,
    amenities: ['Sea View Terrace', 'Rain Shower', 'Full Kitchen', 'Wooden Ceiling', 'A/C', 'Free Wi-Fi', 'Ceiling Fan'],
    images: ['/images/sof1.jpg', '/images/sof1s.jpg', '/images/sof1sa.jpg', '/images/sof1sal.jpg', '/images/sof1sal2.jpg', '/images/sof1sal3.jpg', '/images/sof1ver.jpg', '/images/sof1bed.jpg', '/images/sof1bath.jpg', '/images/sof1bath1.jpg', '/images/sof1kou.jpg', '/images/sof1b.jpg'],
  },
  {
    slug: 'superior-suite-2',
    name: 'Superior Suite 2',
    description: 'Elegant suite with sea views, premium furnishings, full bathroom and private outdoor space.',
    max_guests: 2,
    price_per_night: 90,
    amenities: ['Sea View', 'Full Bathroom', 'Full Kitchen', 'A/C', 'Free Wi-Fi', 'Private Balcony'],
    images: ['/images/sof2b.jpg', '/images/sof2ba.jpg', '/images/sof2bed.jpg', '/images/sof2s.jpg'],
  },
  {
    slug: 'family',
    name: 'Family Room',
    description: 'Comfortable family room with two single beds, stone wall décor and balcony — perfect for families or friends.',
    max_guests: 4,
    price_per_night: 85,
    amenities: ['Two Single Beds', 'Balcony', 'Stone Wall Feature', 'A/C', 'Free Wi-Fi', 'Private Bathroom'],
    images: ['/images/3.jpg'],
  },
]

export default function RoomsPage() {
  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 py-12">

      {/* Page Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 border border-blue-100 bg-blue-50 rounded-full px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-isalos-blue mb-5">
          📍 Velika · Pagasetic Gulf
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-isalos-dark mb-4">
          Our Rooms
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          All rooms include sea or garden views, private bathroom, A/C and free Wi-Fi.
          Sunbeds and umbrellas are always included.
        </p>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rooms.map(room => (
          <div key={room.slug}
            className="bg-white rounded-3xl shadow-sm hover:shadow-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 border border-gray-100">

            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <Image
                src={room.images[0]}
                alt={room.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Price badge */}
              <div className="absolute top-4 right-4">
                <div
                  style={{ background: 'linear-gradient(135deg, #2B6CB0, #1A365D)' }}
                  className="text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  €{room.price_per_night} / night
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-serif text-2xl font-bold text-isalos-dark">{room.name}</h2>
                <span className="text-sm text-gray-400 mt-1 whitespace-nowrap ml-3">
                  👥 Up to {room.max_guests}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{room.description}</p>

              {/* Amenity tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {room.amenities.map(a => (
                  <span key={a}
                    className="bg-isalos-sand text-isalos-stone text-xs px-3 py-1.5 rounded-full font-medium">
                    ✓ {a}
                  </span>
                ))}
              </div>

              {/* CTA Button — modern gradient pill */}
              <Link
                href={`/rooms/${room.slug}`}
                style={{ background: 'linear-gradient(135deg, #2B6CB0, #1A365D)', color: 'white' }}
                className="block text-center font-bold py-3.5 rounded-full text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                View Room &amp; Book →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
