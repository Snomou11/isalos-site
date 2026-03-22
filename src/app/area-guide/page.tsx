import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore the Region | Isalos Apartments — Velika, Pelion',
  description: 'Discover the beaches, mountain villages, hiking trails, local tavernas and activities near Isalos Apartments on Velika beach, Thessaly, Greece.',
}

const beaches = [
  {
    name: 'Velika Beach',
    distance: '📍 On your doorstep',
    description:
      'The beach right in front of Isalos — awarded with the Blue Flag for water quality, Velika is a long stretch of sand and fine pebbles with crystal clear water. Relatively uncrowded even in peak season, it is the perfect base for a relaxed beach holiday. Sunbeds and umbrellas are included with your stay at Isalos.',
  },
  {
    name: 'Rakopotamos Beach',
    distance: '🚗 ~15 min',
    description:
      'One of the most spectacular beaches in the region and a true hidden gem. Rakopotamos sits at the mouth of a river gorge where freshwater meets the sea, surrounded by lush green cliffs and exotic vegetation. The area is popular with kayakers and hikers who follow sea trails leading to waterfalls up to 30 metres high. It feels like a small slice of the tropics — completely unspoilt and unforgettable.',
  },
  {
    name: 'Psarolakas Beach',
    distance: '🚗 ~20 min',
    description:
      'A peaceful and largely undiscovered beach nestled between Kokkino Nero and Stomio, Psarolakas is one of the largest of the smaller beaches in the northern Larissa coastline. Beautifully clear water, fine pebbles and a magical natural setting — accessible only via a short 10-minute footpath shaded by plane trees, which keeps the crowds away. Perfect for those who enjoy a quiet escape with nature all around.',
  },
  {
    name: 'Vrachakia Beach',
    distance: '🚗 ~5 min',
    description:
      'Located at the far end of Velika on the road towards Paliouri, Vrachakia offers a completely different scenery — raw, rocky and dramatic. The landscape here is wilder and more rugged than the sandy stretches nearby, making it a great spot for snorkeling, exploring rock pools and enjoying a more secluded atmosphere away from the sunbeds.',
  },
]

const hiking = [
  {
    name: 'Mountain Villages of Mavrovouni',
    description:
      'The slopes of Mavrovouni rising directly behind Velika hide a string of small, traditional mountain settlements that feel completely untouched by modern tourism. A short drive or a scenic hike up brings you into a different world of stone-built houses, cobbled paths and panoramic views over the Aegean.',
  },
  {
    name: 'Kissavos (Mount Ossa)',
    description:
      'The imposing bulk of Kissavos (also known as Mount Ossa) rises to the north. Its forested slopes are criss-crossed with hiking trails passing through chestnut and oak forests, traditional villages and ancient stone paths. The views from the higher ridges stretch from the Aegean all the way to Mount Olympus.',
  },
  {
    name: 'Lower Olympus & Ambelakia',
    description:
      'To the northwest lies the foothills of Lower Olympus and the legendary village of Ambelakia — one of the most remarkable villages in Greece, historically famous for its silk trade and cooperative society. Nearby villages worth visiting include Metaxochori, Agia, Karitsa, Skiti, Rapsani and Melivia. Each has its own character, local products and traditional architecture. Along the way you will find local wine from Rapsani, honey, herbs and homemade food to taste.',
  },
]

const food = [
  {
    name: 'Velika Village Centre',
    description:
      'The centre of Velika itself has several tavernas catering to all tastes — fresh grilled fish straight from the sea, traditional Greek mezedes, local meat dishes and homemade desserts. Most are family-run, the atmosphere is relaxed and the prices are very reasonable.',
  },
  {
    name: 'Nearby Village Tavernas',
    description:
      'Within a short drive you will find a number of charming villages each with their own tavernas and local character. Whether it is fresh seafood by the water at Kokkino Nero, traditional roasted meat in a mountain village, or local wine paired with cheese at a small kafeneio — the area rewards those who explore. Ask us at Isalos and we will happily point you to our favourite spots.',
  },
  {
    name: 'Local Products',
    description:
      'The region is known for excellent local produce — Rapsani PDO wine from the slopes of Olympus, thyme honey, fresh olive oil, herbs and local cheeses. Many small shops and roadside stalls sell directly from the producer. A great way to take a piece of the region home with you.',
  },
]

const activities = [
  { icon: '🏊', name: 'Swimming & Snorkeling',  desc: 'Crystal clear water at Velika and nearby beaches. Equipment available at Isalos.' },
  { icon: '🛶', name: 'Kayaking',               desc: 'Explore the coastline by sea kayak, available at the beach.' },
  { icon: '🚴', name: 'Cycling',                desc: 'Flat coastal roads and mountain trails for all levels.' },
  { icon: '🥾', name: 'Hiking',                 desc: 'Trails through Mavrovouni, Kissavos and Lower Olympus forests.' },
  { icon: '🍷', name: 'Wine Tasting',           desc: 'Visit the Rapsani vineyards on the slopes of Olympus — just 30 minutes away.' },
  { icon: '🏛️', name: 'Culture & History',      desc: 'Visit Ambelakia, Larissa, ancient Dion and the Vale of Tempi.' },
]

export default function AreaGuidePage() {
  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase text-isalos-blue mb-5">
          🗺️ Discover the Area
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-isalos-dark mb-4">
          Explore the Region
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Velika sits on a stretch of coastline where the Aegean meets the green foothills
          of Mavrovouni, Kissavos and Lower Olympus. The area is rich in unspoilt beaches,
          mountain villages, hiking trails, excellent food and local culture — most of it
          completely off the tourist radar.
        </p>
      </div>

      {/* BEACHES */}
      <section className="mb-20">
        <h2 className="font-serif text-3xl font-bold text-isalos-dark mb-8 flex items-center gap-3">
          🏖️ Beaches Nearby
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beaches.map(b => (
            <div key={b.name}
              className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-isalos-dark">{b.name}</h3>
                <span className="text-xs text-gray-400 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap ml-3 font-medium">
                  {b.distance}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HIKING */}
      <section className="mb-20">
        <h2 className="font-serif text-3xl font-bold text-isalos-dark mb-8 flex items-center gap-3">
          🥾 Hiking & Nature
        </h2>
        <p className="text-gray-500 mb-6 leading-relaxed max-w-3xl">
          The mountains behind Velika are a hiker's paradise. Following the trails you will
          discover small mountain settlements tucked into the slopes of Mavrovouni, Kissavos
          and Lower Olympus — villages where time seems to have stood still, with stone houses,
          traditional kafeneions and sweeping views down to the sea.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hiking.map(h => (
            <div key={h.name}
              className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h3 className="font-bold text-lg text-isalos-dark mb-3">{h.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="mb-20 py-16 px-8 rounded-3xl" style={{ backgroundColor: '#EEF4FB' }}>
        <h2 className="font-serif text-3xl font-bold text-isalos-dark mb-8 flex items-center gap-3">
          ⚡ Activities
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {activities.map(a => (
            <div key={a.name}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl mb-3">{a.icon}</div>
              <h3 className="font-bold text-sm text-isalos-dark mb-1">{a.name}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOD */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-isalos-dark mb-8 flex items-center gap-3">
          🍽️ Tavernas & Local Food
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {food.map(f => (
            <div key={f.name}
              className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <h3 className="font-bold text-lg text-isalos-dark mb-3">{f.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-12 rounded-3xl border border-blue-100 bg-blue-50">
        <h2 className="font-serif text-2xl font-bold text-isalos-dark mb-3">
          Ready to explore it all?
        </h2>
        <p className="text-gray-500 mb-7 max-w-md mx-auto">
          Book your stay at Isalos and use it as your base to discover this
          beautiful and largely undiscovered corner of Greece.
        </p>
        <a href="/rooms"
          style={{ background: 'linear-gradient(135deg, #2B6CB0, #1A365D)', color: 'white' }}
          className="inline-block font-bold px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-base">
          View Our Rooms →
        </a>
      </div>

    </div>
  )
}
