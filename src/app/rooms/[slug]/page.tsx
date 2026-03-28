'use client'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { rooms } from '../page'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DayPicker } from 'react-day-picker'
import { differenceInCalendarDays, format, isSameDay } from 'date-fns'
import 'react-day-picker/dist/style.css'
import { supabase } from '@/lib/supabase'

const schema = z.object({
  guest_name:   z.string().min(2, 'Name required'),
  guest_email:  z.string().email('Valid email required'),
  guest_phone:  z.string().optional(),
  guests_count: z.coerce.number().min(1).max(6),
  message:      z.string().optional(),
})

type FormData = {
  guest_name: string
  guest_email: string
  guest_phone?: string
  guests_count: number
  message?: string
}

// Returns seasonal price based on current month
function getSeasonalPrice(basePrice: number): number {
  const month = new Date().getMonth() + 1 // 1–12
  if (month >= 7 && month <= 8) return Math.round(basePrice * 1.4)  // July–August: +40%
  if (month === 6 || month === 9) return Math.round(basePrice * 1.2) // June & September: +20%
  return basePrice                                                     // Off-season: base price
}

function getSeasonLabel(basePrice: number): string | null {
  const month = new Date().getMonth() + 1
  if (month >= 7 && month <= 8) return 'Peak season rate'
  if (month === 6 || month === 9) return 'High season rate'
  return null
}

export default function RoomPage() {
  const { slug } = useParams()
  const room = rooms.find(r => r.slug === slug)
  const [activeImg, setActiveImg] = useState(0)
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({})
  const [pricePerNight, setPricePerNight] = useState(
    room ? getSeasonalPrice(room.price_per_night) : 0
  )

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { guests_count: 1 },
  })

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      // Fetch price from rooms table
      const { data: roomData } = await supabase
        .from('rooms').select('price_per_night').eq('slug', slug).single()
      if (roomData) setPricePerNight(getSeasonalPrice(roomData.price_per_night))

      // Fetch blocked ranges from availability table (what admin sets)
      const { data: blocked } = await supabase
        .from('availability')
        .select('date_from, date_to')
        .eq('room_slug', slug)
        .eq('is_blocked', true)

      if (blocked) {
        const allDates: Date[] = []
        blocked.forEach(row => {
          const start = new Date(row.date_from)
          const end = new Date(row.date_to)
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            allDates.push(new Date(d))
          }
        })
        setBlockedDates(allDates)
      }

      // Also fetch confirmed reservations and block those too
      const { data: reservations } = await supabase
        .from('reservations')
        .select('check_in, check_out')
        .eq('room_id', slug)
        .eq('status', 'confirmed')

      if (reservations) {
        const resDates: Date[] = []
        reservations.forEach(r => {
          const start = new Date(r.check_in)
          const end = new Date(r.check_out)
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            resDates.push(new Date(d))
          }
        })
        setBlockedDates(prev => [...prev, ...resDates])
      }
    }
    load()
  }, [slug])

  const nights = range.from && range.to
    ? differenceInCalendarDays(range.to, range.from) : 0
  const totalPrice = nights * pricePerNight

  const isDateBlocked = (date: Date) =>
    blockedDates.some(b => isSameDay(b, date)) || date < new Date()

  if (!room) return (
    <div className="pt-32 text-center text-gray-500">Room not found.</div>
  )

  const seasonLabel = getSeasonLabel(room.price_per_night)

  const onSubmit = async (data: FormData) => {
    if (!range.from || !range.to) {
      alert('Please select check-in and check-out dates.')
      return
    }
    setStatus('loading')
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        room_id:     room.slug,
        room_name:   room.name,
        check_in:    format(range.from, 'yyyy-MM-dd'),
        check_out:   format(range.to,   'yyyy-MM-dd'),
        total_price: totalPrice,
        nights,
      }),
    })
    if (res.ok) { setStatus('success'); reset(); setRange({}) }
    else setStatus('error')
  }

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 py-12">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-isalos-dark mb-2">{room.name}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-gray-500 text-base">
            Up to {room.max_guests} guests &nbsp;·&nbsp;
            <span style={{ color: '#2B6CB0' }} className="font-semibold">
              €{pricePerNight} / night
            </span>
          </p>
          {seasonLabel && (
            <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold">
              🌞 {seasonLabel}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT — Images + Amenities */}
        <div>
          <div className="relative h-96 rounded-3xl overflow-hidden mb-3 shadow-md">
            <Image src={room.images[activeImg]} alt={room.name} fill className="object-cover" 
            sizes="(max-width: 1024px) 100vw, 50vw"/>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {room.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200
                  ${i === activeImg ? 'border-isalos-blue scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <Image src={img} alt="" fill className="object-cover"
                sizes="80px" />
              </button>
            ))}
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <h3 className="font-semibold text-isalos-dark text-lg mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map(a => (
                <span key={a}
                  className="bg-isalos-sand text-isalos-stone text-sm px-4 py-2 rounded-full font-medium">
                  ✓ {a}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed">{room.description}</p>
        </div>

        {/* RIGHT — Booking Form */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h2 className="font-serif text-2xl font-bold text-isalos-dark mb-1">
            Request a Reservation
          </h2>

          {/* Best Price Guaranteed badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-4">
            <span className="text-green-600 text-xs font-bold">✓ Best Price Guaranteed</span>
            <span className="text-green-500 text-xs">— Book direct, no fees</span>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Pick your dates, then fill in your details below.
          </p>

          {status === 'success' ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-serif text-xl font-bold text-isalos-blue mb-2">Request Sent!</h3>
              <p className="text-gray-500">
                We will contact you within 24 hours to confirm your stay.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* CALENDAR */}
              <div className="border-2 border-isalos-sand rounded-2xl p-2 flex justify-center overflow-x-auto bg-isalos-sand/30">
                <DayPicker
                  mode="range"
                  selected={{ from: range.from, to: range.to }}
                  onSelect={(r) => setRange(r ?? {})}
                  disabled={isDateBlocked}
                  modifiersClassNames={{
                    selected: 'bg-isalos-blue text-white rounded-full',
                    today:    'font-bold text-isalos-blue',
                    disabled: 'opacity-30 line-through',
                  }}
                  showOutsideDays
                />
              </div>

              {/* PRICE SUMMARY */}
              {nights > 0 ? (
                <div
                  style={{ background: 'linear-gradient(135deg, #2B6CB0, #1A365D)' }}
                  className="rounded-2xl px-5 py-4 flex items-center justify-between shadow-md">
                  <div>
                    <p className="text-sm text-blue-100 font-medium">
                      {format(range.from!, 'dd MMM yyyy')} → {format(range.to!, 'dd MMM yyyy')}
                    </p>
                    <p className="text-sm text-blue-200 mt-0.5">
                      {nights} night{nights > 1 ? 's' : ''} × €{pricePerNight}
                    </p>
                    {seasonLabel && (
                      <p className="text-xs text-orange-300 mt-0.5">🌞 {seasonLabel}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-200 mb-0.5">Total</p>
                    <p className="text-3xl font-bold text-white">€{totalPrice}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 text-center">
                  <p className="text-isalos-stone text-sm font-medium">
                    👆 Select your check-in and check-out dates above
                  </p>
                </div>
              )}

              {/* FULL NAME */}
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1.5">Full Name *</label>
                <input
                  {...register('guest_name')}
                  placeholder="Your full name"
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-isalos-blue transition-colors bg-gray-50 text-gray-800 placeholder-gray-400"
                />
                {errors.guest_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.guest_name.message}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1.5">Email *</label>
                <input
                  {...register('guest_email')}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-isalos-blue transition-colors bg-gray-50 text-gray-800 placeholder-gray-400"
                />
                {errors.guest_email && (
                  <p className="text-red-500 text-xs mt-1">{errors.guest_email.message}</p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1.5">
                  Phone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  {...register('guest_phone')}
                  placeholder="+30 ..."
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-isalos-blue transition-colors bg-gray-50 text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* GUESTS */}
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1.5">Number of Guests *</label>
                <select
                  {...register('guests_count')}
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-isalos-blue transition-colors bg-gray-50 text-gray-800 appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-1.5">
                  Message <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={2}
                  placeholder="Any special requests or questions..."
                  className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-isalos-blue transition-colors bg-gray-50 text-gray-800 placeholder-gray-400 resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                  <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={status === 'loading' || nights === 0}
                style={{
                  background: nights > 0 ? 'linear-gradient(135deg, #2B6CB0, #1A365D)' : '#e5e7eb',
                  color: nights > 0 ? 'white' : '#9ca3af',
                  cursor: nights === 0 ? 'not-allowed' : 'pointer',
                }}
                className="w-full font-bold py-4 rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:shadow-none"
              >
                {status === 'loading'
                  ? '⏳ Sending your request...'
                  : nights > 0
                    ? ` Send Reservation Request · €${totalPrice}`
                    : 'Select dates to continue'}
              </button>

              <p className="text-center text-xs text-gray-400 pt-1">
                No payment required now. The owner will confirm within 24 hours.
              </p>

            </form>
          )}
        </div>
      </div>
    </div>
  )
}
