'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { format, parseISO } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

interface Room { id: string; slug: string; name: string; price_per_night: number }
interface Reservation {
  id: string; room_id: string; guest_name: string; guest_email: string
  guest_phone: string; check_in: string; check_out: string
  guests_count: number; total_price: number; message: string; status: string; created_at: string
}

const ADMIN_PASSWORD = 'isalos2024'

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [rooms, setRooms] = useState<Room[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  const [editPrice, setEditPrice] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'reservations' | 'availability'>('reservations')

  useEffect(() => {
    if (!auth) return
    const load = async () => {
      const { data: r } = await supabase.from('rooms').select('*').order('name')
      if (r) { setRooms(r); setSelectedRoom(r[0]); setEditPrice(r[0].price_per_night) }
      const { data: res } = await supabase
        .from('reservations').select('*').order('created_at', { ascending: false })
      if (res) setReservations(res)
    }
    load()
  }, [auth])

  useEffect(() => {
    if (!selectedRoom) return
    const load = async () => {
      setEditPrice(selectedRoom.price_per_night)
      const { data } = await supabase
        .from('blocked_dates').select('date').eq('room_id', selectedRoom.id)
      if (data) setBlockedDates(data.map(d => new Date(d.date)))
    }
    load()
  }, [selectedRoom])

  const savePrice = async () => {
    if (!selectedRoom) return
    setSaving(true)
    await supabase.from('rooms').update({ price_per_night: editPrice }).eq('id', selectedRoom.id)
    setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...r, price_per_night: editPrice } : r))
    setSaving(false)
    alert('Price updated!')
  }

  const toggleDate = async (date: Date) => {
    if (!selectedRoom) return
    const dateStr = format(date, 'yyyy-MM-dd')
    const isBlocked = blockedDates.some(d => format(d, 'yyyy-MM-dd') === dateStr)
    if (isBlocked) {
      await supabase.from('blocked_dates')
        .delete().eq('room_id', selectedRoom.id).eq('date', dateStr)
      setBlockedDates(prev => prev.filter(d => format(d, 'yyyy-MM-dd') !== dateStr))
    } else {
      await supabase.from('blocked_dates')
        .insert({ room_id: selectedRoom.id, date: dateStr })
      setBlockedDates(prev => [...prev, date])
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('reservations').update({ status }).eq('id', id)
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  if (!auth) return (
    <div className="min-h-screen flex items-center justify-center bg-isalos-sand">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-80">
        <h1 className="font-serif text-2xl font-bold text-isalos-dark text-center mb-6">Admin Login</h1>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)}
          placeholder="Enter password" onKeyDown={e => e.key === 'Enter' && pw === ADMIN_PASSWORD && setAuth(true)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-isalos-blue" />
        <button onClick={() => pw === ADMIN_PASSWORD ? setAuth(true) : alert('Wrong password')}
          className="w-full bg-isalos-blue text-white font-semibold py-3 rounded-xl hover:bg-isalos-dark transition-colors">
          Login
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-isalos-dark">Owner Dashboard</h1>
          <button onClick={() => setAuth(false)} className="text-sm text-gray-400 hover:text-red-500">Logout</button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8">
          {(['reservations', 'availability'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all capitalize ${tab === t ? 'bg-isalos-blue text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* RESERVATIONS TAB */}
        {tab === 'reservations' && (
          <div className="space-y-4">
            {reservations.length === 0 && <p className="text-gray-400 text-center py-12">No reservations yet.</p>}
            {reservations.map(r => {
              const room = rooms.find(rm => rm.id === r.room_id)
              return (
                <div key={r.id} className="bg-white rounded-2xl shadow p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-isalos-dark text-lg">{r.guest_name}</h3>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          r.status === 'rejected'  ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'}`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{room?.name} · {r.check_in} → {r.check_out}</p>
                      <p className="text-sm text-gray-500">{r.guest_email} · {r.guest_phone || 'No phone'}</p>
                      {r.message && <p className="text-sm text-gray-400 italic mt-1">"{r.message}"</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-isalos-blue">€{r.total_price}</p>
                      <p className="text-xs text-gray-400">{r.guests_count} guest{r.guests_count > 1 ? 's' : ''}</p>
                      <p className="text-xs text-gray-400">{format(parseISO(r.created_at), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => updateStatus(r.id, 'confirmed')}
                        className="bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-green-600 transition-colors">
                        ✓ Confirm
                      </button>
                      <button onClick={() => updateStatus(r.id, 'rejected')}
                        className="bg-red-500 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-red-600 transition-colors">
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* AVAILABILITY TAB */}
        {tab === 'availability' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room selector + price */}
            <div className="space-y-4">
              <h2 className="font-semibold text-isalos-dark text-lg">Select Room</h2>
              {rooms.map(r => (
                <button key={r.id} onClick={() => setSelectedRoom(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${selectedRoom?.id === r.id ? 'border-isalos-blue bg-isalos-blue/5 font-semibold text-isalos-blue' : 'border-gray-200 bg-white text-gray-700 hover:border-isalos-blue'}`}>
                  {r.name}
                  <span className="block text-xs text-gray-400 font-normal">€{r.price_per_night}/night</span>
                </button>
              ))}

              {selectedRoom && (
                <div className="bg-white rounded-2xl shadow p-5 mt-4">
                  <h3 className="font-semibold text-isalos-dark mb-3">Update Price</h3>
                  <div className="flex gap-2">
                    <input type="number" value={editPrice} onChange={e => setEditPrice(Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-isalos-blue" />
                    <button onClick={savePrice} disabled={saving}
                      className="bg-isalos-blue text-white px-4 py-2 rounded-xl hover:bg-isalos-dark transition-colors disabled:opacity-50 font-semibold">
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Calendar */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
              <h2 className="font-semibold text-isalos-dark text-lg mb-2">
                Availability — {selectedRoom?.name}
              </h2>
              <p className="text-sm text-gray-400 mb-4">Click a date to block/unblock it. Red = unavailable.</p>
              <DayPicker
                mode="multiple"
                selected={blockedDates}
                onDayClick={toggleDate}
                modifiersClassNames={{
                  selected: 'bg-red-400 text-white rounded-full',
                  today: 'font-bold text-isalos-blue',
                }}
                showOutsideDays
                numberOfMonths={2}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
