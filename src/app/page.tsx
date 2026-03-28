import Link from 'next/link'
import Image from 'next/image'



const features = [
  { icon: '🌊', title: 'Beachfront Location', desc: 'Sea in front, mountains behind — Velika beach is your backyard.' },
  { icon: '🏡', title: 'Home Comforts',        desc: 'Fully equipped kitchens, private bathrooms, A/C and free Wi-Fi.' },
  { icon: '🛶', title: 'Activities',           desc: 'Kayak, cycle, snorkel, hike — endless ways to explore the area.' },
  { icon: '⭐', title: '9.1 Guest Rating',     desc: 'Consistently rated excellent by guests on Booking.com.' },
]

const roomPreviews = [
  { slug: 'studio',            name: 'Studio',            img: '/images/1.webp',     guests: 2, price: 60 },
  { slug: 'double',            name: 'Double Room',       img: '/images/2.webp',     guests: 2, price: 70 },
  { slug: 'superior-suite-1',  name: 'Superior Suite 1',  img: '/images/sof1.webp',  guests: 2, price: 90 },
  { slug: 'superior-suite-2',  name: 'Superior Suite 2',  img: '/images/sof2b.webp', guests: 2, price: 90 },
  { slug: 'family',            name: 'Family Room',       img: '/images/3.webp',     guests: 4, price: 85 },
]

const reviews = [
  {
    name: 'Maria K.',
    country: '🇬🇷 Greece',
    score: 10,
    text: 'You have everything you need — the room was new, beautiful and clean. Wide terrace, beautiful yard, private parking. The beach is endless with sunbeds included.',
  },
  {
    name: 'Thomas R.',
    country: '🇩🇪 Germany',
    score: 9,
    text: 'Excellent location just steps from the beach. The room was spotless and the balcony view was stunning. Would absolutely stay again — highly recommended!',
  },
  {
    name: 'Eleni P.',
    country: '🇬🇷 Greece',
    score: 10,
    text: 'A hidden gem at the foot of Pelion. Waking up to the sound of the sea every morning was magical. The owners are incredibly warm and welcoming.',
  },
  {
    name: 'Dimitris A.',
    country: '🇨🇾 Cyprus',
    score: 9,
    text: 'The Superior Suite was beautiful — wooden ceilings, stone walls, rain shower and a huge terrace. One of the best places we have stayed in Greece.',
  },
  {
    name: 'Sophie L.',
    country: '🇫🇷 France',
    score: 10,
    text: 'Perfect family stay. The beach right in front, the mountains behind, the rooms immaculate. Felt completely at home from the first moment.',
  },
  {
    name: 'Nikos M.',
    country: '🇬🇷 Greece',
    score: 9,
    text: 'Peaceful, clean, great value. The sunbeds and umbrellas are a wonderful bonus. Velika is such a beautiful unspoilt beach — we will be back next summer!',
  },
]

export default function HomePage() {
  return (
    <>
{/* ── HERO ── CENTER/RIGHT IMAGES ONLY + NO SCROLL */}
{/* ── HERO ── EXACT RED DOT POSITIONS + beach3 */}
<section className="relative h-screen pt-[90px] overflow-hidden font-['Times_New_Roman']">
  
  {/* Light beige background */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5DC] via-[#FAF0E6] to-[#FDF6E3]" />
  
  {/* Images - EXACT screenshot positions */}
  <div className="absolute inset-0 pointer-events-none">
    
    {/* Position 1: Top-right (red dot 1) */}
    <div className="absolute top-20 right-20 w-52 h-40 lg:w-72 lg:h-52 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-white/60 z-10">
      <Image src="/images/mprosta.webp" alt="Exterior" fill className="object-cover" sizes="20vw" />
    </div>
    
    {/* Position 2: Center-right (red dot 2) */}
    <div className="absolute top-[45%] right-8 lg:right-16 w-56 h-48 lg:w-72 lg:h-56 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-white/50 z-20">
      <Image src="/images/sof1.webp" alt="Suite" fill className="object-cover" sizes="20vw" />
    </div>
    
    {/* Position 3: Center (red dot 3) */}
    <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-64 h-48 lg:w-80 lg:h-56 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-white/40 z-30">
      <Image src="/images/1.webp" priority alt="Studio" fill className="object-cover" sizes="22vw" />
    </div>
    
    {/* Position 4: Bottom-right (red dot 4) */}
    <div className="absolute bottom-28 right-8 lg:right-90 w-48 h-36 lg:w-60 lg:h-44 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-white/30 z-15">
      <Image src="/images/beach3.webp" alt="Beach3" fill className="object-cover" sizes="18vw" />
    </div>
    
    {/* Position 5: Right-middle */}
    <div className="absolute top-[25%] left-300 lg:right-8 w-44 h-36 lg:w-56 lg:h-44 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-white/35 z-25">
      <Image src="/images/beach2.webp" alt="Beach" fill className="object-cover" sizes="16vw" />
    </div>
    
  </div>

  {/* Slogan */}
  <div className="relative z-40 flex flex-col items-start justify-center h-full px-8 lg:px-16 xl:px-32 max-w-3xl ml-0 lg:ml-16">
    <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.85] mb-8 drop-shadow-2xl"
        style={{ color: '#2C1810' }}>
      ISALOS
    </h1>
    <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal mb-16 opacity-80 drop-shadow-xl"
        style={{ color: '#3C2F2F' }}>
      Beachfront Apartments
    </h2>
  </div>

</section>





      
    </>
  
  )
}


      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A365D' }}>
            Why stay at Isalos?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A family-run complex directly on Velika beach, at the foot of Mount Pelion.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title}
              className="text-center p-8 rounded-3xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#1A365D' }}>{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROOMS PREVIEW ── */}
      <section className="py-24" style={{ backgroundColor: '#EEF4FB' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A365D' }}>
              Our Rooms
            </h2>
            <p className="text-gray-500">Every room has sea or garden views, A/C and free Wi-Fi.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomPreviews.map(r => (
              <Link key={r.slug} href={`/rooms/${r.slug}`}
                className="group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-52 overflow-hidden">
                  <Image src={r.img} alt={r.name} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
                </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg" style={{ color: '#1A365D' }}>{r.name}</h3>
                      <span className="text-sm font-bold" style={{ color: '#2B6CB0' }}>From €{r.price}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Up to {r.guests} guests</p>
                    <div style={{ background: 'linear-gradient(135deg, #2B6CB0, #1A365D)', color: 'white' }}
                      className="text-center text-sm font-bold py-3 rounded-full tracking-wide group-hover:opacity-90 transition-all shadow-md">
                      View Room →
                    </div>
                  </div>

              </Link>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link href="/rooms"
              style={{ background: 'linear-gradient(135deg, #2B6CB0, #1A365D)', color: 'white' }}
              className="inline-block font-bold px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-base">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* ── GUEST REVIEWS ── */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase text-yellow-700 mb-5">
            ⭐ Verified Guest Reviews
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A365D' }}>
            What our guests say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Rated <strong>9.1 / 10</strong> on Booking.com based on verified guest reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
              {/* Reviewer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1A365D' }}>{r.name}</p>
                  <p className="text-xs text-gray-400">{r.country}</p>
                </div>
                <div
                  style={{ background: 'linear-gradient(135deg, #2B6CB0, #1A365D)' }}
                  className="text-white text-sm font-bold px-3 py-1 rounded-full">
                  {r.score} / 10
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking.com link */}
        <div className="text-center mt-10">
          <a href="https://www.booking.com/hotel/gr/isalos-velika.html"
            target="_blank" rel="noopener noreferrer"
            style={{ border: '2px solid #2B6CB0', color: '#2B6CB0' }}
            className="inline-block font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-all duration-200 text-sm">
            Read all reviews on Booking.com →
          </a>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=90"
          alt="Calm sea at early morning"
          fill
          className="object-cover object-center"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center px-4">
          <p className="text-white/50 text-xs font-semibold tracking-[0.35em] uppercase mb-4">Every single day</p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-xl">
            Wake up to this.
          </h2>
          <p className="text-white/60 text-base mb-10 max-w-md mx-auto">
            Your home on Velika beach — where every morning starts with the sound of the sea.
          </p>
          <Link href="/rooms"
            style={{ backgroundColor: 'white', color: '#1A365D' }}
            className="font-bold px-12 py-4 rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-300 text-base">
            Book Your Stay →
          </Link>
        </div>
      </section>

