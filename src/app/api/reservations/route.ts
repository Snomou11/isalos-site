import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { data: roomRow } = await supabase
    .from('rooms').select('id').eq('slug', body.room_id).single()
  if (!roomRow) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('reservations')
    .insert([{
      room_id:      roomRow.id,
      guest_name:   body.guest_name,
      guest_email:  body.guest_email,
      guest_phone:  body.guest_phone || null,
      check_in:     body.check_in,
      check_out:    body.check_out,
      guests_count: body.guests_count,
      total_price:  body.total_price,
      message:      body.message || null,
      status:       'pending',
    }])
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // ─── EMAIL DEBUG BLOCK ────────────────────────────────────────────────────
  try {
    console.log('📧 Sending owner email to:', process.env.OWNER_EMAIL)

    const result1 = await resend.emails.send({
      from: 'Isalos Reservations <onboarding@resend.dev>',
      to: process.env.OWNER_EMAIL!,
      subject: `New Reservation — ${body.room_name} — ${body.guest_name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#1A365D;">🏖️ New Booking Request</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;">Room</td><td style="padding:8px;font-weight:600;">${body.room_name}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Guest</td><td style="padding:8px;font-weight:600;">${body.guest_name}</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;">Email</td><td style="padding:8px;">${body.guest_email}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Phone</td><td style="padding:8px;">${body.guest_phone || 'Not provided'}</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;">Check-in</td><td style="padding:8px;font-weight:600;">${body.check_in}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Check-out</td><td style="padding:8px;font-weight:600;">${body.check_out}</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:8px;color:#6b7280;">Nights</td><td style="padding:8px;">${body.nights}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Guests</td><td style="padding:8px;">${body.guests_count}</td></tr>
            <tr style="background:#F5E6C8;"><td style="padding:8px;color:#1A365D;font-weight:700;">Total Price</td><td style="padding:8px;font-weight:700;color:#2B6CB0;font-size:18px;">€${body.total_price}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Message</td><td style="padding:8px;">${body.message || 'None'}</td></tr>
          </table>
          <p style="margin-top:20px;color:#6b7280;font-size:13px;">Reply to this email to contact the guest directly.</p>
        </div>`,
    })
    console.log('✅ Owner email result:', JSON.stringify(result1))

    console.log('📧 Sending guest email to:', body.guest_email)

    const result2 = await resend.emails.send({
      from: 'Isalos Apartments <onboarding@resend.dev>',
      to: body.guest_email,
      subject: 'We received your reservation — Isalos Apartments',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#1A365D;">Thank you, ${body.guest_name}! 🌊</h2>
          <p style="color:#4b5563;">Your reservation request for <strong>${body.room_name}</strong> has been received.</p>
          <div style="background:#F5E6C8;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;color:#1A365D;"><strong>Check-in:</strong> ${body.check_in}</p>
            <p style="margin:8px 0 0;color:#1A365D;"><strong>Check-out:</strong> ${body.check_out}</p>
            <p style="margin:8px 0 0;color:#1A365D;"><strong>Nights:</strong> ${body.nights}</p>
            <p style="margin:8px 0 0;color:#2B6CB0;font-size:18px;font-weight:700;"><strong>Total:</strong> €${body.total_price}</p>
          </div>
          <p style="color:#4b5563;">The owner will contact you within <strong>24 hours</strong> to confirm.</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="color:#9ca3af;font-size:12px;">Isalos Apartments · Naxos, Greece</p>
        </div>`,
    })
    console.log('✅ Guest email result:', JSON.stringify(result2))

  } catch (e) {
    console.error('❌ Email error:', e)
    // Return the error visibly so you see it in the browser response
    return NextResponse.json({
      success: true,
      reservation: data,
      emailError: String(e)
    })
  }
  // ─────────────────────────────────────────────────────────────────────────

  return NextResponse.json({ success: true, reservation: data })
}