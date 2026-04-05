'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Room = { id: number; name: string; slug: string }
type View = 'dashboard' | 'availability' | 'prices'
type PriceRow = {
  id?: number
  room_slug: string
  date_from: string
  date_to: string
  price_per_night: number
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function getDatesInRange(from: Date, to: Date): string[] {
  const dates: string[] = []
  const cur = new Date(from)
  while (cur <= to) {
    dates.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

export default function AdminPage() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase = createClient()
  const [auth, setAuth] = useState<'loading' | 'out' | 'in'>('loading')
  const [view, setView] = useState<View>('dashboard')
  const [rooms, setRooms] = useState<Room[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.auth.getUser().then(({ data }: any) => {
      setAuth(data.user ? 'in' : 'out')
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e: any, session: any) => {
      setAuth(session ? 'in' : 'out')
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (auth !== 'in') return
    supabase.from('rooms').select('id, name, slug').order('id')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: any) => { if (data) setRooms(data) })
  }, [auth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoggingIn(false)
    if (error) { setLoginError(error.message); return }
    setEmail('')
    setPassword('')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuth('out')
  }

  if (auth === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Checking session...</p>
      </main>
    )
  }

  if (auth === 'out') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4"
        >
          <div>
            <h1 className="text-2xl font-bold">Admin login</h1>
            <p className="text-sm text-neutral-500 mt-1">Sign in to manage prices and availability.</p>
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button type="submit" disabled={loggingIn}
            className="w-full bg-black text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-60">
            {loggingIn ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => setView('dashboard')}
          className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
          Admin Panel
        </button>
        <span className="text-gray-300">|</span>
        <nav className="flex gap-2 flex-1">
          {[
            { key: 'dashboard', label: '🏠 Dashboard' },
            { key: 'availability', label: '📅 Availability' },
            { key: 'prices', label: '💶 Prices' },
          ].map(item => (
            <button key={item.key} onClick={() => setView(item.key as View)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                ${view === item.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout}
          className="ml-auto px-4 py-1.5 rounded-full text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition">
          🔒 Logout
        </button>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        {view === 'dashboard' && <Dashboard setView={setView} rooms={rooms} />}
        {view === 'availability' && <AvailabilityManager setView={setView} rooms={rooms} />}
        {view === 'prices' && <PricesManager setView={setView} rooms={rooms} />}
      </main>
    </div>
  )
}

function Dashboard({ setView, rooms }: { setView: (v: View) => void; rooms: Room[] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back 👋</h1>
      <p className="text-gray-500 mb-8">Manage your apartments from here.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button onClick={() => setView('availability')}
          className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md hover:border-blue-300 transition group">
          <div className="text-3xl mb-3">📅</div>
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">Manage Availability</h2>
          <p className="text-sm text-gray-500 mt-1">Block or unblock dates for each apartment</p>
        </button>
        <button onClick={() => setView('prices')}
          className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md hover:border-blue-300 transition group">
          <div className="text-3xl mb-3">💶</div>
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">Manage Prices</h2>
          <p className="text-sm text-gray-500 mt-1">Set prices per season for each apartment</p>
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Your Apartments</h3>
        <div className="flex flex-wrap gap-2">
          {rooms.map(room => (
            <span key={room.slug} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{room.name}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function AvailabilityManager({ setView, rooms }: { setView: (v: View) => void; rooms: Room[] }) {
  const supabase = createClient()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set())
  const [selecting, setSelecting] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!selectedSlug) return
    setBlockedDates(new Set())
    supabase.from('availability').select('date_from, date_to')
      .eq('room_slug', selectedSlug).eq('is_blocked', true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: any) => {
        if (!data) return
        const all = new Set<string>()
        data.forEach((row: { date_from: string; date_to: string }) =>
          getDatesInRange(new Date(row.date_from), new Date(row.date_to)).forEach(d => all.add(d))
        )
        setBlockedDates(all)
      })
  }, [selectedSlug])

  const handleDateClick = (dateStr: string) => {
    if (!selecting) {
      setSelecting(dateStr)
    } else {
      const start = selecting < dateStr ? selecting : dateStr
      const end = selecting < dateStr ? dateStr : selecting
      const range = getDatesInRange(new Date(start), new Date(end))
      setBlockedDates(prev => {
        const next = new Set(prev)
        const allBlocked = range.every(d => prev.has(d))
        range.forEach(d => allBlocked ? next.delete(d) : next.add(d))
        return next
      })
      setSelecting(null)
    }
  }

  const handleSave = async () => {
    if (!selectedSlug) return
    setSaving(true)
    setMessage('')
    await supabase.from('availability').delete().eq('room_slug', selectedSlug).eq('is_blocked', true)
    if (blockedDates.size > 0) {
      const sorted = Array.from(blockedDates).sort()
      const ranges: { date_from: string; date_to: string }[] = []
      let start = sorted[0], end = sorted[0]
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(end)
        prev.setDate(prev.getDate() + 1)
        if (prev.toISOString().split('T')[0] === sorted[i]) { end = sorted[i] }
        else { ranges.push({ date_from: start, date_to: end }); start = sorted[i]; end = sorted[i] }
      }
      ranges.push({ date_from: start, date_to: end })
      await supabase.from('availability').insert(
        ranges.map(r => ({ room_slug: selectedSlug, date_from: r.date_from, date_to: r.date_to, is_blocked: true }))
      )
    }
    setSaving(false)
    setMessage('✅ Saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const calCells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setView('dashboard')} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800">📅 Availability Manager</h2>
      </div>
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Select a room:</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {rooms.map(room => (
            <button key={room.slug} onClick={() => setSelectedSlug(room.slug)}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition
                ${selectedSlug === room.slug ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>
              {room.name}
            </button>
          ))}
        </div>
      </div>
      {!selectedSlug && <p className="text-gray-400 text-center py-16">← Select a room to manage its availability</p>}
      {selectedSlug && (
        <>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">← Prev</button>
            <span className="font-semibold text-lg">{MONTHS[month]} {year}</span>
            <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">Next →</button>
          </div>
          <p className="text-sm text-gray-500 mb-3">{selecting ? '📅 Click an end date to complete the range' : 'Click a start date, then an end date'}</p>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
            {calCells.map((day, i) => {
              if (!day) return <div key={i} />
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isBlocked = blockedDates.has(dateStr)
              const isSelecting = selecting === dateStr
              return (
                <button key={dateStr} onClick={() => handleDateClick(dateStr)}
                  className={`rounded py-2 text-sm font-medium transition
                    ${isSelecting ? 'ring-2 ring-blue-500 bg-blue-100' :
                      isBlocked ? 'bg-red-500 text-white hover:bg-red-600' :
                      'bg-green-50 text-gray-700 hover:bg-green-100 border border-gray-200'}`}>
                  {day}
                </button>
              )
            })}
          </div>
          <div className="flex gap-4 text-sm mb-5">
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-green-50 border border-gray-200 inline-block" /> Available</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-red-500 inline-block" /> Blocked</span>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <p className="mt-3 text-green-600 font-medium">{message}</p>}
        </>
      )}
    </div>
  )
}

function PricesManager({ setView, rooms }: { setView: (v: View) => void; rooms: Room[] }) {
  const supabase = createClient()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [prices, setPrices] = useState<PriceRow[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selecting, setSelecting] = useState<string | null>(null)
  const [pendingStart, setPendingStart] = useState<string | null>(null)
  const [pendingPrice, setPendingPrice] = useState<number>(0)
  const [showPriceInput, setShowPriceInput] = useState(false)
  const [pendingEnd, setPendingEnd] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedSlug) return
    setLoading(true)
    supabase.from('prices').select('*').eq('room_slug', selectedSlug).order('date_from')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: any) => { if (data) setPrices(data); setLoading(false) })
  }, [selectedSlug])

  // Build a map of date → price for calendar display
  const dateToPrice: Record<string, number> = {}
  prices.forEach(p => {
    getDatesInRange(new Date(p.date_from), new Date(p.date_to)).forEach(d => {
      dateToPrice[d] = p.price_per_night
    })
  })

  const handleDateClick = (dateStr: string) => {
    if (!pendingStart) {
      setPendingStart(dateStr)
      setSelecting(dateStr)
    } else {
      const start = pendingStart < dateStr ? pendingStart : dateStr
      const end = pendingStart < dateStr ? dateStr : pendingStart
      setPendingStart(start)
      setPendingEnd(end)
      setSelecting(null)
      setShowPriceInput(true)
    }
  }




  
  const handleConfirmPrice = async () => {
    if (!selectedSlug || !pendingStart || !pendingEnd || !pendingPrice) return
    setSaving(true)

    // Remove any existing price rows that overlap with this range
    const toDelete = prices.filter(p => p.date_from <= pendingEnd! && p.date_to >= pendingStart!)
    for (const p of toDelete) {
      if (p.id) await supabase.from('prices').delete().eq('id', p.id)
    }

    const { data, error } = await supabase.from('prices').insert([{
      room_slug: selectedSlug,
      date_from: pendingStart,
      date_to: pendingEnd,
      price_per_night: pendingPrice,
    }]).select().single() as any // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!error && data) {
      // Reload all prices for this room
      const { data: fresh } = await supabase.from('prices').select('*').eq('room_slug', selectedSlug).order('date_from') as any // eslint-disable-line @typescript-eslint/no-explicit-any
      if (fresh) setPrices(fresh)
    }

    setSaving(false)
    setShowPriceInput(false)
    setPendingStart(null)
    setPendingEnd(null)
    setPendingPrice(0)
    setMessage('✅ Price saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleCancelPrice = () => {
    setShowPriceInput(false)
    setPendingStart(null)
    setPendingEnd(null)
    setPendingPrice(0)
    setSelecting(null)
  }

  const handleDelete = async (id: number) => {
    await supabase.from('prices').delete().eq('id', id)
    setPrices(prev => prev.filter(p => p.id !== id))
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const calCells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  // Color scale for prices — low=green, mid=yellow, high=orange
  const getPriceColor = (price: number) => {
    if (price <= 80)  return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (price <= 130) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-orange-100 text-orange-800 border-orange-200'
  }

  const isInPendingRange = (dateStr: string) => {
    if (!pendingStart || !pendingEnd) return false
    return dateStr >= pendingStart && dateStr <= pendingEnd
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setView('dashboard')} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800">💶 Prices Manager</h2>
      </div>

      {/* Room selector */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Select a room:</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {rooms.map(room => (
            <button key={room.slug} onClick={() => { setSelectedSlug(room.slug); handleCancelPrice() }}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition
                ${selectedSlug === room.slug ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>
              {room.name}
            </button>
          ))}
        </div>
      </div>

      {!selectedSlug && <p className="text-gray-400 text-center py-16">← Select a room to manage its prices</p>}

      {selectedSlug && (
        <>
          {loading ? <p className="text-gray-400">Loading...</p> : (
            <>
              {/* Instructions / price input panel */}
              {showPriceInput ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-blue-800 mb-3">
                    📅 Range selected: <strong>{pendingStart}</strong> → <strong>{pendingEnd}</strong>
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-blue-700 mb-1 block">Price per night (€)</label>
                      <input
                        type="number"
                        autoFocus
                        placeholder="e.g. 120"
                        value={pendingPrice || ''}
                        onChange={e => setPendingPrice(Number(e.target.value))}
                        onKeyDown={e => e.key === 'Enter' && handleConfirmPrice()}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                      />
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button onClick={handleConfirmPrice} disabled={saving || !pendingPrice}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                        {saving ? 'Saving…' : '✓ Save'}
                      </button>
                      <button onClick={handleCancelPrice}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3 bg-gray-50 rounded-lg px-3 py-2">
                  {selecting ? '📅 Click an end date to complete the range' : '👆 Click a start date, then an end date to set a price'}
                </p>
              )}

              {message && <p className="mb-3 text-green-600 font-medium text-sm">{message}</p>}

              {/* Calendar navigation */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">← Prev</button>
                <span className="font-semibold text-lg">{MONTHS[month]} {year}</span>
                <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">Next →</button>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
                {calCells.map((day, i) => {
                  if (!day) return <div key={i} />
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const price = dateToPrice[dateStr]
                  const isStart = selecting === dateStr
                  const inPending = isInPendingRange(dateStr)

                  return (
                    <button key={dateStr} onClick={() => !showPriceInput && handleDateClick(dateStr)}
                      className={`rounded py-1.5 text-xs font-medium transition border flex flex-col items-center justify-center min-h-[44px]
                        ${isStart ? 'ring-2 ring-blue-500 bg-blue-100 border-blue-300' :
                          inPending ? 'bg-blue-50 border-blue-200 text-blue-700' :
                          price ? getPriceColor(price) :
                          'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                      <span>{day}</span>
                      {price && <span className="text-[9px] leading-tight opacity-80">€{price}</span>}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 text-xs mb-6 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-gray-200 inline-block" /> No price</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200 inline-block" /> ≤€80</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200 inline-block" /> €81–€130</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-100 border border-orange-200 inline-block" /> €131+</span>
              </div>

              {/* Price periods table */}
              {prices.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
                    <h3 className="font-semibold text-gray-700 text-sm">Set Price Periods</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">From</th>
                        <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">To</th>
                        <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">€/night</th>
                        <th className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((p, i) => (
                        <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2 text-gray-600">{p.date_from}</td>
                          <td className="px-4 py-2 text-gray-600">{p.date_to}</td>
                          <td className="px-4 py-2 text-gray-800 font-semibold">€{p.price_per_night}</td>
                          <td className="px-4 py-2 text-right">
                            <button onClick={() => handleDelete(p.id!)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}