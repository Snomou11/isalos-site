'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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

export default function AvailabilityAdmin() {
  const supabase = createClient()

  const [rooms, setRooms] = useState<{ id: number; name: string; slug: string }[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set())
  const [selecting, setSelecting] = useState<string | null>(null) // first click date
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Load rooms
  useEffect(() => {
    supabase.from('rooms').select('id, name, slug').order('id')
      .then(({ data }) => { if (data) setRooms(data) })
  }, [])

  // Load blocked dates for selected room
  useEffect(() => {
    if (!selectedSlug) return
    setBlockedDates(new Set())
    supabase
      .from('availability')
      .select('date_from, date_to')
      .eq('room_slug', selectedSlug)
      .eq('is_blocked', true)
      .then(({ data }) => {
        if (!data) return
        const allDates = new Set<string>()
        data.forEach(row => {
          getDatesInRange(new Date(row.date_from), new Date(row.date_to))
            .forEach(d => allDates.add(d))
        })
        setBlockedDates(allDates)
      })
  }, [selectedSlug])

  const handleDateClick = (dateStr: string) => {
    if (!selecting) {
      // First click — start selection
      setSelecting(dateStr)
    } else {
      // Second click — finalize range
      const start = selecting < dateStr ? selecting : dateStr
      const end = selecting < dateStr ? dateStr : selecting
      const range = getDatesInRange(new Date(start), new Date(end))
      setBlockedDates(prev => {
        const next = new Set(prev)
        // If all in range are blocked → unblock them, else block all
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

    // Delete existing blocked rows for this room
    await supabase.from('availability')
      .delete()
      .eq('room_slug', selectedSlug)
      .eq('is_blocked', true)

    if (blockedDates.size > 0) {
      // Group consecutive dates into ranges
      const sorted = Array.from(blockedDates).sort()
      const ranges: { date_from: string; date_to: string }[] = []
      let start = sorted[0], end = sorted[0]

      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(end)
        const curr = new Date(sorted[i])
        prev.setDate(prev.getDate() + 1)
        if (prev.toISOString().split('T')[0] === sorted[i]) {
          end = sorted[i]
        } else {
          ranges.push({ date_from: start, date_to: end })
          start = sorted[i]; end = sorted[i]
        }
      }
      ranges.push({ date_from: start, date_to: end })

      await supabase.from('availability').insert(
        ranges.map(r => ({
          room_slug: selectedSlug,
          date_from: r.date_from,
          date_to: r.date_to,
          is_blocked: true,
        }))
      )
    }

    setSaving(false)
    setMessage('✅ Saved successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  // Build calendar grid
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const calCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Availability Manager</h1>

      {/* Room Selector */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Select Room</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {rooms.map(room => (
            <button
              key={room.slug}
              onClick={() => setSelectedSlug(room.slug)}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition
                ${selectedSlug === room.slug
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>

      {selectedSlug && (
        <>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >← Prev</button>
            <span className="font-semibold text-lg">{MONTHS[month]} {year}</span>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >Next →</button>
          </div>

          {/* Instructions */}
          <p className="text-sm text-gray-500 mb-3">
            {selecting
              ? '📅 Now click a second date to block the range'
              : 'Click a date to start selecting a range to block/unblock'}
          </p>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
            {calCells.map((day, i) => {
              if (!day) return <div key={i} />
              const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
              const isBlocked = blockedDates.has(dateStr)
              const isSelecting = selecting === dateStr
              return (
                <button
                  key={dateStr}
                  onClick={() => handleDateClick(dateStr)}
                  className={`rounded py-2 text-sm font-medium transition
                    ${isSelecting ? 'ring-2 ring-blue-500 bg-blue-100' :
                      isBlocked ? 'bg-red-500 text-white hover:bg-red-600' :
                      'bg-green-50 text-gray-700 hover:bg-green-100 border border-gray-200'}`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-sm mb-6">
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-green-50 border border-gray-200 inline-block"/> Available</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-red-500 inline-block"/> Blocked</span>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <p className="mt-3 text-green-600 font-medium">{message}</p>}
        </>
      )}
    </div>
  )
}