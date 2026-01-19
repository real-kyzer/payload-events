import { getPayload } from 'payload'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import payloadConfig from '@/payload.config'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config: payloadConfig })

  const { id } = await params

  // Fetch the event by slug (or change to id if needed)
  const event = await payload.find({
    collection: 'events',
    where: {
      id: {
        equals: id,
      },
    },
    depth: 3,
  })

  const doc = event.docs[0]

  if (!doc) {
    return <div>Event not found</div>
  }

  const image = doc.images?.[0]

  const media = image && typeof image === 'object' ? image : null

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <Link href={'/'}>Home</Link>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{doc.title}</h1>

      {/* Hero Image */}
      {doc.images?.[0] && typeof doc.images[0] === 'object' && (
        <div style={{ marginBottom: '2rem' }}>
          <img
            src={doc.images[0].url}
            alt={doc.images[0].alt || doc.title}
            width={1200}
            height={600}
            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
          />
        </div>
      )}

      {/* Description (Rich Text) */}
      <section style={{ marginBottom: '2rem' }}>
        <RichText data={doc.description} />
      </section>

      {/* Event Details */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Event Details</h2>
        <p>
          <strong>Start:</strong> {new Date(doc.startDate).toLocaleString()}
        </p>
        <p>
          <strong>End:</strong> {new Date(doc.endDate).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong> {doc.eventStatus}
        </p>
        <p>
          <strong>Attendance Mode:</strong> {doc.attendanceMode}
        </p>
      </section>

      {/* Venue */}
      {doc.venue && typeof doc.venue === 'object' && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Venue</h2>
          <p>
            <strong>{doc.venue.name}</strong>
          </p>
          <p>{doc.venue.address.streetAddress}</p>
          <p>
            {doc.venue.address.locality}, {doc.venue.address.region} {doc.venue.address.postalCode}
          </p>
        </section>
      )}

      {/* Organizer */}
      {doc.organizer && typeof doc.organizer === 'object' && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Organizer</h2>
          <p>
            <strong>{doc.organizer.name}</strong>
          </p>
          <p>
            <a href={doc.organizer.url} target="_blank">
              {doc.organizer.url}
            </a>
          </p>
          <p>{doc.organizer.contact.email}</p>
          <p>{doc.organizer.contact.telephone}</p>
        </section>
      )}

      {/* Performers */}
      {doc.performers?.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Performers</h2>
          <ul>
            {doc.performers.map((p: any) =>
              typeof p === 'object' ? <li key={p.id}>{p.name}</li> : null,
            )}
          </ul>
        </section>
      )}

      {/* Offers */}
      {doc.offers?.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Tickets</h2>
          <ul>
            {doc.offers.map((o: any) =>
              typeof o === 'object' ? (
                <li key={o.id}>
                  {o.name} — ${o.price} {o.currency}
                </li>
              ) : null,
            )}
          </ul>
        </section>
      )}

      {/* Additional Info */}
      {doc.additionalInfo && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Additional Info</h2>
          <p>
            <strong>Age Restriction:</strong> {doc.additionalInfo.ageRestriction}
          </p>
          <p>
            <strong>Dress Code:</strong> {doc.additionalInfo.dressCode}
          </p>
          <p>
            <strong>Parking:</strong> {doc.additionalInfo.parking}
          </p>
        </section>
      )}
    </main>
  )
}
