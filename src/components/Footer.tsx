import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-isalos-dark text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-xl font-bold mb-3">ISALOS</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Seaside apartments in Velika, Larisa.<br />
            Your home by the sea.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-isalos-lightblue">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {[['/', 'Home'], ['/rooms', 'Rooms'], ['/gallery', 'Gallery'],
              ['/area-guide', 'Area Guide'], ['/contact', 'Contact']].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-isalos-lightblue">Contact</h4>
          <p className="text-sm text-gray-300 space-y-1">
            <span className="block">📍 Velika, Larisa, Greece</span>
            <a href="mailto:isalosrooms@gmail.com" className="block hover:underline">
  ✉️ isalosrooms@gmail.com
</a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Isalos Apartments. All rights reserved.
      </div>
    </footer>
  )
}
