import os
from datetime import datetime, date
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env.local from the project root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_reservations() -> list:
    res = supabase.table('reservations').select('*').execute()
    return res.data or []


def fetch_prices() -> list:
    res = supabase.table('prices').select('*').execute()
    return res.data or []


def fetch_rooms() -> list:
    res = supabase.table('rooms').select('*').order('id').execute()
    return res.data or []


def print_section(title: str):
    print(f'\n{"="*50}')
    print(f'  {title}')
    print('='*50)


def run_analytics():
    rooms       = fetch_rooms()
    reservations = fetch_reservations()
    prices      = fetch_prices()
    today       = date.today()

    print('\n🏖  ISALOS APARTMENTS — Analytics Report')
    print(f'   Generated: {datetime.now().strftime("%Y-%m-%d %H:%M")}')

    # ── ROOMS ──
    print_section('ROOMS')
    for r in rooms:
        print(f'  • {r["name"]}  (slug: {r["slug"]})')

    # ── RESERVATIONS ──
    print_section('RESERVATIONS')
    if not reservations:
        print('  No reservations yet.')
    else:
        total_revenue = 0
        confirmed = [r for r in reservations if r.get('status') == 'confirmed']
        pending   = [r for r in reservations if r.get('status') != 'confirmed']

        print(f'  Total:     {len(reservations)}')
        print(f'  Confirmed: {len(confirmed)}')
        print(f'  Pending:   {len(pending)}')

        for r in sorted(reservations, key=lambda x: x.get('check_in', ''), reverse=True)[:10]:
            revenue = r.get('total_price', 0) or 0
            total_revenue += revenue if r.get('status') == 'confirmed' else 0
            print(f'  [{r.get("status","?"):9}]  {r.get("room_name","?")}  '
                  f'{r.get("check_in","?")} → {r.get("check_out","?")}  '
                  f'€{revenue}  — {r.get("guest_name","?")}')

        print(f'\n  💶 Total confirmed revenue: €{total_revenue}')

    # ── PRICES ──
    print_section('CURRENT PRICE PERIODS')
    if not prices:
        print('  No prices set.')
    else:
        for p in sorted(prices, key=lambda x: (x.get('room_slug',''), x.get('date_from',''))):
            status = '✅ active' if p.get('date_from','') <= str(today) <= p.get('date_to','') else ''
            print(f'  {p.get("room_slug","?"):20}  {p.get("date_from","?")} → {p.get("date_to","?")}  '
                  f'€{p.get("price_per_night","?")} / night  {status}')

    # ── UPCOMING ──
    print_section('UPCOMING CONFIRMED (next 30 days)')
    upcoming = [
        r for r in reservations
        if r.get('status') == 'confirmed'
        and str(today) <= r.get('check_in', '9999')
        and r.get('check_in', '9999') <= str(date(today.year, today.month + 1 if today.month < 12 else 1,
                                                    today.day))
    ]
    if not upcoming:
        print('  No confirmed upcoming bookings.')
    else:
        for r in sorted(upcoming, key=lambda x: x.get('check_in', '')):
            print(f'  {r.get("room_name","?")}  {r.get("check_in","?")} → {r.get("check_out","?")}  '
                  f'{r.get("guest_name","?")} ({r.get("guest_email","?")})')

    print('\n')


if __name__ == '__main__':
    run_analytics()