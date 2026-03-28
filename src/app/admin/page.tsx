import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOutAdmin } from './actions'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin dashboard</h1>
            <p className="text-neutral-600">Logged in as {profile.email}</p>
          </div>

          <form action={signOutAdmin}>
            <button className="rounded-xl border px-4 py-2 font-medium">
              Sign out
            </button>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/prices" className="rounded-2xl border p-6 hover:bg-neutral-50">
            <h2 className="text-xl font-semibold">Prices</h2>
            <p className="mt-2 text-neutral-600">Edit room prices and seasonal pricing.</p>
          </Link>

          <Link href="/admin/calendar" className="rounded-2xl border p-6 hover:bg-neutral-50">
            <h2 className="text-xl font-semibold">Calendar</h2>
            <p className="mt-2 text-neutral-600">Block dates and manage availability rules.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
