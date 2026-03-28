import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deleteRoomPrice, updateRoomPrice } from '../actions'

export default async function AdminPricesPage() {
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

  const { data: prices } = await supabase
    .from('room_prices')
    .select('*')
    .order('id', { ascending: false })

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Prices</h1>
          <p className="text-neutral-600">Manage room and season pricing.</p>
        </div>

        <section className="rounded-2xl border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Add new price</h2>

          <form action={updateRoomPrice} className="grid gap-4 md:grid-cols-4">
            <input name="room_slug" placeholder="room_slug" className="rounded-xl border px-4 py-3" required />
            <input name="season_name" placeholder="season_name" className="rounded-xl border px-4 py-3" required />
            <input name="price_per_night" type="number" step="0.01" placeholder="price_per_night" className="rounded-xl border px-4 py-3" required />
            <button className="rounded-xl bg-black text-white px-4 py-3 font-semibold">
              Save
            </button>
          </form>
        </section>

        <section className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Existing prices</h2>

          <div className="space-y-4">
            {prices?.map((price) => (
              <div key={price.id} className="rounded-xl border p-4">
                <form action={updateRoomPrice} className="grid gap-4 md:grid-cols-5">
                  <input type="hidden" name="id" value={price.id} />
                  <input name="room_slug" defaultValue={price.room_slug} className="rounded-xl border px-4 py-3" required />
                  <input name="season_name" defaultValue={price.season_name} className="rounded-xl border px-4 py-3" required />
                  <input
                    name="price_per_night"
                    type="number"
                    step="0.01"
                    defaultValue={price.price_per_night}
                    className="rounded-xl border px-4 py-3"
                    required
                  />
                  <button className="rounded-xl bg-black text-white px-4 py-3 font-semibold">
                    Update
                  </button>
                </form>

                <form action={deleteRoomPrice} className="mt-3">
                  <input type="hidden" name="id" value={price.id} />
                  <button className="rounded-xl border border-red-200 px-4 py-2 text-red-700">
                    Delete
                  </button>
                </form>
              </div>
            ))}

            {!prices?.length ? (
              <p className="text-neutral-600">No prices yet.</p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
