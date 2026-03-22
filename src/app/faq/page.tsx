'use client'
import { useState } from 'react'
import type { Metadata } from 'next'

const faqs = [
  {
    category: '🏨 The Apartments',
    items: [
      { q: 'What is included in the room rate?', a: 'All rooms include A/C, free Wi-Fi, private bathroom, fully equipped kitchen or kitchenette, bed linen and towels. Sunbeds and umbrellas on the beach are also complimentary.' },
      { q: 'Is breakfast included?', a: 'We do not offer breakfast, but all apartments have a fully equipped kitchen so you can prepare your own meals at any time.' },
      { q: 'Are pets allowed?', a: 'We welcome small pets. Please let us know in advance when making your reservation so we can prepare accordingly.' },
      { q: 'Is there parking available?', a: 'Yes, free private parking is available on site for all guests.' },
    ],
  },
  {
    category: '📅 Reservations & Pricing',
    items: [
      { q: 'What is the minimum stay?', a: 'We require a minimum of 2 nights. During July and August the minimum stay is 3 nights.' },
      { q: 'How do I confirm my reservation?', a: 'After submitting your reservation request, we will contact you within 24 hours by email or phone to confirm availability and arrange payment.' },
      { q: 'What payment methods do you accept?', a: 'We accept bank transfer and cash on arrival. Card payments can be arranged — please ask us when confirming your booking.' },
      { q: 'What is your cancellation policy?', a: 'Free cancellation up to 7 days before arrival. Cancellations within 7 days of arrival are subject to a one-night charge. No-shows are charged the full amount.' },
      { q: 'Are prices higher in summer?', a: 'Yes, peak season rates apply during July and August. Prices are lower in June, September and outside the summer season. Contact us directly for the best available rate.' },
    ],
  },
  {
    category: '📍 Location & Getting Here',
    items: [
      { q: 'Where exactly are you located?', a: 'We are directly on Velika beach, in the village of Velika, Larisa, Thessaly. The beach is literally steps from your room.' },
      { q: 'How far is the nearest supermarket?', a: 'There is a small mini-market in Velika village, approximately 5 minutes on foot. A larger supermarket is available in Stomio, about 10 minutes by car.' },
      { q: 'How far is the nearest town?', a: 'Larisa city centre is approximately 35–40 minutes by car. Volos is about 1 hour.' },
      { q: 'Is a car necessary?', a: 'For exploring the wider area — beaches, mountain villages and attractions — a car is strongly recommended. The beach itself is right in front of the apartments.' },
    ],
  },
  {
    category: '🌊 The Beach & Activities',
    items: [
      { q: 'How is the beach at Velika?', a: 'Velika beach is a long stretch of sand and fine pebbles with very clean, calm and clear water. It holds the Blue Flag award for water quality.' },
      { q: 'What activities are available nearby?', a: 'Kayaking, snorkeling, cycling, hiking in the mountains, wine tasting at Rapsani, and exploring traditional mountain villages are all within easy reach.' },
      { q: 'Is the sea safe for children?', a: 'Yes — the water at Velika is calm and shallow near the shore, making it very safe for children and non-swimmers.' },
    ],
  },
]

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4 py-16">

      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase text-isalos-blue mb-5">
          ❓ FAQ
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-isalos-dark mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Everything you need to know before your stay. Can't find your answer?{' '}
          <a href="/contact" style={{ color: '#2B6CB0' }} className="font-semibold hover:underline">
            Contact us directly.
          </a>
        </p>
      </div>

      <div className="space-y-10">
        {faqs.map(section => (
          <div key={section.category}>
            <h2 className="font-serif text-xl font-bold text-isalos-dark mb-4">{section.category}</h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.q}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpen(open === item.q ? null : item.q)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <span
                    className="text-xl flex-shrink-0 transition-transform duration-200"
                    style={{ color: '#2B6CB0', transform: open === item.q ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    +
                    </span>
                  </button>
                  {open === item.q && (
                    <div className="px-6 pb-5">
                      <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
