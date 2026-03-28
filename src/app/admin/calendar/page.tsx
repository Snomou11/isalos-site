import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deleteAvailability, upsertAvailability } from '../actions'

export default async function AdminCalendarPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  const { data: rows } = await supabase
    .from('availability')
    .select('*')
    .order('date_from', { ascending: true })

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-neutral-600">Manage blocked dates and availability periods.</p>
        </div>

        <section className="rounded-2xl border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Add period</h2>

          <form action={upsertAvailability} className="grid gap-4 md:grid-cols-2">
            <input name="room_slug" placeholder="room_slug" className="rounded-xl border px-4 py-3" required />
            <input name="note" placeholder="note" className="rounded-xl border px-4 py-3" />
            <input name="date_from" type="date" className="rounded-xl border px-4 py-3" required />
            <input name="date_to" type="date" className="rounded-xl border px-4 py-3" required />

            <label className="flex items-center gap-2">
              <input name="is_blocked" type="checkbox" />
              <span>Blocked period</span>
            </label>

            <button className="rounded-xl bg-black text-white px-4 py-3 font-semibold">
              Save
            </button>
          </form>
        </section>

        <section className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Existing periods</h2>

          <div className="space-y-4">
            {rows?.map((row) => (
              <div key={row.id} className="rounded-xl border p-4 space-y-3">
                <form action={upsertAvailability} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={row.id} />
                  <input name="room_slug" defaultValue={row.room_slug} className="rounded-xl border px-4 py-3" required />
                  <input name="note" defaultValue={row.note ?? ''} className="rounded-xl border px-4 py-3" />
                  <input name="date_from" type="date" defaultValue={row.date_from} className="rounded-xl border px-4 py-3" required />
                  <input name="date_to" type="date" defaultValue={row.date_to} className="rounded-xl border px-4 py-3" required />

                  <label className="flex items-center gap-2">
                    <input name="is_blocked" type="checkbox" defaultChecked={row.is_blocked} />
                    <span>Blocked period</span>
                  </label>

                  <button className="rounded-xl bg-black text-white px-4 py-3 font-semibold">
                    Update
                  </button>
                </form>

                <form action={deleteAvailability}>
                  <input type="hidden" name="id" value={row.id} />
                  <button className="rounded-xl border border-red-200 px-4 py-2 text-red-700">
                    Delete
                  </button>
                </form>
              </div>
            ))}

            {!rows?.length ? (
              <p className="text-neutral-600">No calendar entries yet.</p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
