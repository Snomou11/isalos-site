export const metadata = {
  title: 'Contact | Isalos Apartments — Velika, Larisa',
  description: 'Get in touch with Isalos Apartments on Velika beach, Larisa, Greece.',
}

export default function ContactPage() {
  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 py-16">

      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase text-isalos-blue mb-5">
          Get in Touch
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-isalos-dark mb-4">
          Contact Us
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          We are happy to answer any questions about availability, rooms or your stay.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: '📍', label: 'Address',   value: 'Velika, Larisa, Greece',     href: null },
            { icon: '📞', label: 'Phone',     value: '+30 6947811102',           href: 'tel:+306947811102' },
            { icon: '✉️', label: 'Email',     value: 'isalosrooms@gmail.com',      href: 'mailto:isalosrooms@gmail.com' },
            { icon: '🕐', label: 'Check-in',  value: '15:00 – 21:00',              href: null },
            { icon: '🕙', label: 'Check-out', value: '08:00 – 11:00',              href: null },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="font-medium hover:underline" style={{ color: '#2B6CB0' }}>
                    {item.value}
                  </a>
                ) : (
                  <p className="text-gray-700 font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}

        </div>

        {/* Map */}
        <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-[450px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.5!2d23.073!3d39.227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zVmVsaWthIEJlYWNo!5e0!3m2!1sen!2sgr!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
