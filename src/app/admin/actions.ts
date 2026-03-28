'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (error || !profile || profile.role !== 'admin') {
    throw new Error('Forbidden')
  }

  return { supabase, user, profile }
}

export async function signOutAdmin() {
  const { supabase } = await requireAdmin()
  await supabase.auth.signOut()
  revalidatePath('/admin')
}

export async function updateRoomPrice(formData: FormData) {
  const { supabase, user } = await requireAdmin()

  const id = Number(formData.get('id'))
  const room_slug = String(formData.get('room_slug') || '')
  const season_name = String(formData.get('season_name') || '')
  const price_per_night = Number(formData.get('price_per_night'))

  if (!room_slug || !season_name || !Number.isFinite(price_per_night) || price_per_night < 0) {
    throw new Error('Invalid input')
  }

  if (id) {
    const { error } = await supabase
      .from('room_prices')
      .update({
        room_slug,
        season_name,
        price_per_night,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('room_prices')
      .insert({
        room_slug,
        season_name,
        price_per_night,
      })

    if (error) throw new Error(error.message)
  }

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'upsert_room_price',
    table_name: 'room_prices',
    record_id: String(id || ''),
    payload: { room_slug, season_name, price_per_night },
  })

  revalidatePath('/admin/prices')
}

export async function deleteRoomPrice(formData: FormData) {
  const { supabase, user } = await requireAdmin()

  const id = Number(formData.get('id'))
  if (!id) throw new Error('Invalid price id')

  const { error } = await supabase.from('room_prices').delete().eq('id', id)
  if (error) throw new Error(error.message)

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'delete_room_price',
    table_name: 'room_prices',
    record_id: String(id),
    payload: {},
  })

  revalidatePath('/admin/prices')
}

export async function upsertAvailability(formData: FormData) {
  const { supabase, user } = await requireAdmin()

  const id = Number(formData.get('id'))
  const room_slug = String(formData.get('room_slug') || '')
  const date_from = String(formData.get('date_from') || '')
  const date_to = String(formData.get('date_to') || '')
  const note = String(formData.get('note') || '')
  const is_blocked = formData.get('is_blocked') === 'on'

  if (!room_slug || !date_from || !date_to) {
    throw new Error('Missing required fields')
  }

  if (id) {
    const { error } = await supabase
      .from('availability')
      .update({
        room_slug,
        date_from,
        date_to,
        note,
        is_blocked,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('availability')
      .insert({
        room_slug,
        date_from,
        date_to,
        note,
        is_blocked,
      })

    if (error) throw new Error(error.message)
  }

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'upsert_availability',
    table_name: 'availability',
    record_id: String(id || ''),
    payload: { room_slug, date_from, date_to, note, is_blocked },
  })

  revalidatePath('/admin/calendar')
}

export async function deleteAvailability(formData: FormData) {
  const { supabase, user } = await requireAdmin()

  const id = Number(formData.get('id'))
  if (!id) throw new Error('Invalid availability id')

  const { error } = await supabase.from('availability').delete().eq('id', id)
  if (error) throw new Error(error.message)

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'delete_availability',
    table_name: 'availability',
    record_id: String(id),
    payload: {},
  })

  revalidatePath('/admin/calendar')
}
