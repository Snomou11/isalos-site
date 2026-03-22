import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.isalos-velika.gr'
  const rooms = ['studio', 'double', 'superior-suite-1', 'superior-suite-2', 'family']

  return [
    { url: base,              lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/rooms`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`,   lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.7 },
    ...rooms.map(slug => ({
      url: `${base}/rooms/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
