```md
# 🌊 Isalos Apartments — Official Website

Seaside apartment booking website for **Isalos Apartments**, located directly on Velika beach, Larisa, Greece.

Built with **Next.js 14**, **Tailwind CSS** and **Supabase**.

---

## 🏖️ About

Isalos is a family-run Seaside complex on Velika beach, at the foot of the mountains of Thessaly.
This website allows guests to browse rooms, check availability, request reservations and explore the surrounding area.

---

## ✨ Features

- 🏠 Room listings with image galleries and amenities
- 📅 Interactive booking calendar with blocked/reserved dates
- 💶 Seasonal pricing (peak, high and off-season rates)
- ✉️ Reservation request form with email notification
- 🗺️ Area guide — beaches, hiking, food and activities
- ❓ FAQ section
- 📸 Photo gallery
- 📍 Contact page with Google Maps embed
- 🌐 English / Greek language toggle
- ⭐ Guest reviews section
- 📱 Fully responsive — mobile, tablet and desktop
- 🔒 Admin dashboard (Supabase) for managing reservations and blocked dates

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth (admin) | Supabase Auth |
| Forms | React Hook Form + Zod |
| Calendar | react-day-picker |
| Deployment | Vercel (planned) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/YOURUSERNAME/isalos-site.git
cd isalos-site
npm install
```


### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```


### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── rooms/
│   │   ├── page.tsx          # Rooms listing
│   │   └── [slug]/page.tsx   # Individual room + booking form
│   ├── gallery/page.tsx      # Photo gallery
│   ├── area-guide/page.tsx   # Area & region guide
│   ├── about/page.tsx        # About the property
│   ├── contact/page.tsx      # Contact + map
│   ├── faq/page.tsx          # FAQ
│   └── admin/                # Admin dashboard
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Analytics.tsx
└── lib/
    └── supabase.ts
```


---

## 🌿 Branch Strategy

| Branch | Purpose |
| :-- | :-- |
| `main` | Production-ready code |
| `develop` | Active development |


---

## 📍 Location

**Isalos Apartments**
Velika Beach, Velika, Larisa, Thessaly, Greece

---

## 📄 License

Private project — all rights reserved © Isalos Apartments

```
