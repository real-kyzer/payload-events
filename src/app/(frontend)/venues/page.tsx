import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export default async function VenuesPage() {
  const payload = await getPayload({ config })

  const venues = await payload.find({
    collection: 'venues',
    depth: 0,
    limit: 100,
  })

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Venues</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {venues.docs.map((venue) => (
          <Link
            key={venue.id}
            href={`/venues/${venue.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #ddd',
              borderRadius: 8,
              overflow: 'hidden',
              textDecoration: 'none',
              background: '#fff',
              color: '#111',
              padding: '1rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.2rem',
                margin: 0,
                marginBottom: '0.5rem',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {venue.name}
            </h2>

            <p style={{ color: '#444', fontSize: '0.9rem', margin: 0 }}>
              {venue.address?.streetAddress}
            </p>

            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {venue.address?.locality}, {venue.address?.region} {venue.address?.postalCode}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
