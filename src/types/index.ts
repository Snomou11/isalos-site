export interface Room {
  id: string
  slug: string
  name: string
  description: string
  max_guests: number
  price_per_night: number
  amenities: string[]
  images: string[]
}

export interface Reservation {
  id?: string
  room_id: string
  guest_name: string
  guest_email: string
  guest_phone?: string
  check_in: string
  check_out: string
  guests_count: number
  message?: string
  status?: 'pending' | 'confirmed' | 'rejected'
}
