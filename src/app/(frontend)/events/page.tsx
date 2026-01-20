import payloadConfig from '@/payload.config'
import Link from 'next/link'
import { getPayload } from 'payload'
import { cache } from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

const queryEventsById = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'events',
    depth: 2,
    limit: 100,
  })

  return result || null
})

export default async function EventsPage() {
  // const payload = await getPayload({ config })

  // const events = await payload.find({
  //   collection: 'events',
  //   depth: 2,
  //   limit: 100,
  // })

  // const doc = event.docs[0];
  const events = await queryEventsById()

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <Link href={'/'}>Home</Link>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Events</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {events.docs.map((event) => {
          // Narrow the hero image type
          const hero =
            event.images?.[0] && typeof event.images[0] === 'object' ? event.images[0] : null

          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ddd',
                borderRadius: 8,
                overflow: 'hidden',
                textDecoration: 'none',
                background: '#fff',
                color: '#111', // ensure text is visible
              }}
            >
              {/* Image */}
              {hero && (
                <img
                  src={hero.url}
                  alt={hero.alt || event.title}
                  width={400}
                  height={250}
                  style={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              )}

              {/* Content */}
              <div
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  flexGrow: 1,
                  color: '#111', // force readable text
                }}
              >
                <h2
                  style={{
                    fontSize: '1.1rem',
                    margin: 0,
                    lineHeight: 1.3,
                    color: '#111',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {event.title}
                </h2>

                <p
                  style={{
                    color: '#444',
                    fontSize: '0.9rem',
                    margin: 0,
                    marginTop: 'auto',
                  }}
                >
                  {new Date(event.startDate).toLocaleDateString()}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
