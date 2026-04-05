
# Create the analytics monitoring script
"""
Isalos Apartments - Site Analytics Monitor
Reads data from your Supabase database and shows:
- Reservation requests (count, status breakdown, revenue)
- Most requested rooms
- Busiest months
- Recent activity
"""

import os
from datetime import datetime, timedelta
from supabase import create_client, Client

# ── Config ────────────────────────────────────────────────────────────────────
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

# Alternatively hardcode for local testing:
# SUPABASE_URL = "https://koyjfvmktplzbjbicull.supabase.co"
# SUPABASE_KEY = "your-anon-key-here"


def get_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError(
            "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY "
            "as environment variables, or hardcode them in this script."
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def hr(char="─", width=60):
    print(char * width)


def section(title):
    print()
    hr("═")
    print(f"  {title}")
    hr("═")


# ── Reservations ──────────────────────────────────────────────────────────────
def reservations_summary(sb: Client):
    section("📋  RESERVATION REQUESTS")

    res = sb.table("reservations").select("*").execute()
    rows = res.data or []

    if not rows:
        print("  No reservations found.")
        return

    total = len(rows)
    statuses = {}
    revenue_confirmed = 0.0
    room_counts = {}

    for r in rows:
        status = r.get("status", "unknown")
        statuses[status] = statuses.get(status, 0) + 1

        if status == "confirmed":
            revenue_confirmed += float(r.get("total_price", 0) or 0)

        room = r.get("room_id") or r.get("room_name", "Unknown")
        room_counts[room] = room_counts.get(room, 0) + 1

    print(f"  Total requests  : {total}")
    for s, count in sorted(statuses.items()):
        bar = "█" * count
        print(f"  {s:<14}: {count:>4}  {bar}")

    print(f"\n  Confirmed revenue : €{revenue_confirmed:,.0f}")

    print("\n  Top rooms requested:")
    for room, count in sorted(room_counts.items(), key=lambda x: -x[1])[:5]:
        print(f"    {room:<25} {count:>3} requests")


# ── Recent Activity ───────────────────────────────────────────────────────────
def recent_activity(sb: Client, days=30):
    section(f"🕐  LAST {days} DAYS")

    cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
    res = (
        sb.table("reservations")
        .select("*")
        .gte("created_at", cutoff)
        .order("created_at", desc=True)
        .execute()
    )
    rows = res.data or []

    if not rows:
        print(f"  No activity in the last {days} days.")
        return

    print(f"  {len(rows)} request(s) in last {days} days:\n")
    for r in rows[:10]:
        name = r.get("guest_name", "—")[:22]
        room = (r.get("room_id") or r.get("room_name", "?"))[:20]
        check_in = r.get("check_in", "?")
        check_out = r.get("check_out", "?")
        status = r.get("status", "?")
        price = r.get("total_price", 0) or 0
        created = r.get("created_at", "")[:10]
        print(
            f"  {created}  {name:<23} {room:<21} "
            f"{check_in} → {check_out}  €{price:<6}  [{status}]"
        )

    if len(rows) > 10:
        print(f"\n  ... and {len(rows) - 10} more")


# ── Monthly Breakdown ─────────────────────────────────────────────────────────
def monthly_breakdown(sb: Client):
    section("📅  MONTHLY BREAKDOWN")

    res = sb.table("reservations").select("check_in, total_price, status").execute()
    rows = res.data or []

    months = {}
    for r in rows:
        ci = r.get("check_in", "")
        if not ci:
            continue
        month = ci[:7]  # "YYYY-MM"
        if month not in months:
            months[month] = {"count": 0, "revenue": 0}
        months[month]["count"] += 1
        if r.get("status") == "confirmed":
            months[month]["revenue"] += float(r.get("total_price", 0) or 0)

    if not months:
        print("  No check-in data available.")
        return

    print(f"  {'Month':<10} {'Requests':>9} {'Revenue':>10}")
    hr()
    for month in sorted(months.keys()):
        m = months[month]
        print(f"  {month}  {m['count']:>9}  €{m['revenue']:>9,.0f}")


# ── Prices Overview ───────────────────────────────────────────────────────────
def prices_overview(sb: Client):
    section("💶  CURRENT PRICE PERIODS")

    res = (
        sb.table("prices")
        .select("room_slug, date_from, date_to, price_per_night")
        .order("room_slug")
        .order("date_from")
        .execute()
    )
    rows = res.data or []

    if not rows:
        print("  No prices set.")
        return

    current_room = None
    today = datetime.utcnow().date().isoformat()

    for r in rows:
        room = r.get("room_slug", "?")
        if room != current_room:
            print(f"\n  {room}")
            current_room = room

        date_from = r.get("date_from", "?")
        date_to   = r.get("date_to", "?")
        price     = r.get("price_per_night", 0)
        active    = "✓ active" if date_from <= today <= date_to else ""
        print(f"    {date_from} → {date_to}   €{price}/night  {active}")


# ── Availability ──────────────────────────────────────────────────────────────
def blocked_dates(sb: Client):
    section("🚫  UPCOMING BLOCKED DATES")

    today = datetime.utcnow().date().isoformat()
    res = (
        sb.table("availability")
        .select("room_slug, date_from, date_to")
        .eq("is_blocked", True)
        .gte("date_to", today)
        .order("date_from")
        .execute()
    )
    rows = res.data or []

    if not rows:
        print("  No upcoming blocked dates.")
        return

    for r in rows:
        print(
            f"  {r.get('room_slug', '?'):<25} "
            f"{r.get('date_from')} → {r.get('date_to')}"
        )


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print()
    print("  ╔══════════════════════════════════════════╗")
    print("  ║   ISALOS APARTMENTS — Analytics Monitor  ║")
    print(f"  ║   {datetime.now().strftime('%Y-%m-%d  %H:%M')}                         ║")
    print("  ╚══════════════════════════════════════════╝")

    sb = get_client()

    reservations_summary(sb)
    recent_activity(sb, days=30)
    monthly_breakdown(sb)
    prices_overview(sb)
    blocked_dates(sb)

    print()
    hr()
    print("  Done.")
    print()


if __name__ == "__main__":
    main()
'''

with open("/root/isalos_analytics.py", "w") as f:
    f.write(script)

print("Script created successfully")
print(f"Size: {len(script)} characters")
