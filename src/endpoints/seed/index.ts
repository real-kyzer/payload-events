import type { LexicalValue } from '@payloadcms/richtext-lexical'

import type { Payload, PayloadRequest, CollectionSlug, File } from 'payload'

const collections: CollectionSlug[] = [
  'media',
  'venues',
  'organizers',
  'offers',
  'performers',
  'events',
]

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // ----------------------------------------
  // CLEAR COLLECTIONS
  // ----------------------------------------
  payload.logger.info(`— Clearing collections...`)

  await Promise.all(
    collections.map((collection) =>
      payload.db.deleteMany({
        collection,
        req,
        where: {},
      }),
    ),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) =>
        payload.db.deleteVersions({
          collection,
          req,
          where: {},
        }),
      ),
  )

  // ----------------------------------------
  // SEED MEDIA
  // ----------------------------------------
  payload.logger.info(`— Seeding media...`)

  const mediaURLs = [
    // Outdoor cinema
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',

    // Night market / food stalls
    'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0',

    // Live music / jazz night
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',

    // Art gallery / exhibition
    'https://images.unsplash.com/photo-1529101091764-c3526daf38fe',

    // Light festival / city lights
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',

    // Garden / outdoor event
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',

    // Crowd at event / festival
    'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf',

    // Street performers / laneway vibe
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
  ]

  const mediaBuffers = await Promise.all(mediaURLs.map(fetchFileByURL))

  const mediaDocs = await Promise.all(
    mediaBuffers.map((file, i) =>
      payload.create({
        collection: 'media',
        data: {
          alt: `Event image ${i + 1}`,
        },
        file,
        draft: false,
      }),
    ),
  )

  // ----------------------------------------
  // REALISTIC VENUES
  // ----------------------------------------
  payload.logger.info(`— Seeding venues...`)

  const venueData = [
    {
      name: 'Federation Square',
      address: {
        streetAddress: 'Swanston St & Flinders St',
        locality: 'Melbourne',
        region: 'VIC',
        postalCode: '3000',
        country: 'Australia',
      },
      geo: { latitude: -37.817979, longitude: 144.969093 },
    },
    {
      name: 'Sydney Town Hall',
      address: {
        streetAddress: '483 George St',
        locality: 'Sydney',
        region: 'NSW',
        postalCode: '2000',
        country: 'Australia',
      },
      geo: { latitude: -33.8731, longitude: 151.206 },
    },
    {
      name: 'Royal Botanic Gardens',
      address: {
        streetAddress: 'Birdwood Ave',
        locality: 'South Yarra',
        region: 'VIC',
        postalCode: '3141',
        country: 'Australia',
      },
      geo: { latitude: -37.8304, longitude: 144.9796 },
    },
  ]

  const venues = await Promise.all(
    venueData.map((v) =>
      payload.create({
        collection: 'venues',
        data: v,
      }),
    ),
  )

  // ----------------------------------------
  // REALISTIC ORGANIZERS
  // ----------------------------------------
  payload.logger.info(`— Seeding organizers...`)

  const organizerData = [
    {
      name: 'City of Melbourne Events',
      url: 'https://whatson.melbourne.vic.gov.au',
      contact: {
        email: 'events@melbourne.vic.gov.au',
        telephone: '+61 3 9658 9658',
        contactType: 'public enquiries',
      },
    },
    {
      name: 'Sydney Culture Collective',
      url: 'https://whatson.cityofsydney.nsw.gov.au',
      contact: {
        email: 'info@cityofsydney.nsw.gov.au',
        telephone: '+61 2 9265 9333',
        contactType: 'public enquiries',
      },
    },
    {
      name: 'Arts & Live Entertainment Australia',
      url: 'https://example.com',
      contact: {
        email: 'contact@alea.org.au',
        telephone: '+61 3 9000 1234',
        contactType: 'customer support',
      },
    },
  ]

  const organizers = await Promise.all(
    organizerData.map((o) =>
      payload.create({
        collection: 'organizers',
        data: o,
      }),
    ),
  )

  // ----------------------------------------
  // REALISTIC PERFORMERS
  // ----------------------------------------
  payload.logger.info(`— Seeding performers...`)

  const performerNames = [
    'Luna Rivers',
    'The Harbour Lights Ensemble',
    'DJ Solstice',
    'Melbourne Indie Choir',
    'The Riverside Quartet',
  ]

  const performers = await Promise.all(
    performerNames.map((name, i) =>
      payload.create({
        collection: 'performers',
        data: {
          name,
          type: i % 2 === 0 ? 'Person' : 'Organization',
        },
      }),
    ),
  )

  // ----------------------------------------
  // REALISTIC OFFERS
  // ----------------------------------------
  payload.logger.info(`— Seeding offers...`)

  const offerData = [
    { name: 'General Admission', price: 25 },
    { name: 'Concession Ticket', price: 18 },
    { name: 'Family Pass', price: 60 },
    { name: 'VIP Experience', price: 120 },
    { name: 'Early Bird Special', price: 15 },
  ]

  const offers = await Promise.all(
    offerData.map((o, i) =>
      payload.create({
        collection: 'offers',
        data: {
          name: o.name,
          price: o.price,
          currency: 'AUD',
          availability: 'InStock',
          validFrom: new Date().toISOString(),
          url: `https://tickets.example.com/${o.name.toLowerCase().replace(/\s+/g, '-')}`,
        },
      }),
    ),
  )

  // ----------------------------------------
  // REALISTIC EVENTS
  // ----------------------------------------
  payload.logger.info(`— Seeding events...`)

  const richText = (text: string): LexicalValue => ({
    root: {
      type: 'root',
      version: 1,
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text,
            },
          ],
        },
      ],
    },
  })

  const eventTemplates = [
    {
      title: 'Sunset Jazz at the Gardens',
      description:
        'An evening of smooth jazz performed live among the greenery of the Royal Botanic Gardens.',
    },
    {
      title: 'Laneway Night Market',
      description:
        'A vibrant night market featuring street food, handmade crafts, and live entertainment.',
    },
    {
      title: 'Open-Air Cinema: Summer Series',
      description: 'Enjoy classic films under the stars with food trucks and beanbag seating.',
    },
    {
      title: 'Sydney Harbour Light Festival',
      description:
        'A spectacular display of light installations and performances along the harbour foreshore.',
    },
    {
      title: 'Melbourne Art Walk',
      description: 'A guided walking tour showcasing local artists and pop-up galleries.',
    },
  ]

  for (let i = 0; i < 10; i++) {
    const template = eventTemplates[i % eventTemplates.length]

    await payload.create({
      collection: 'events',
      data: {
        title: template.title,
        description: richText(template.description),
        startDate: new Date(2026, 1, i + 3, 18, 0).toISOString(),
        endDate: new Date(2026, 1, i + 3, 22, 0).toISOString(),
        eventStatus: 'EventScheduled',
        attendanceMode: 'OfflineEventAttendanceMode',
        images: [mediaDocs[i % mediaDocs.length].id],
        venue: venues[i % venues.length].id,
        organizer: organizers[i % organizers.length].id,
        offers: [offers[i % offers.length].id],
        performers: [
          performers[(i + 1) % performers.length].id,
          performers[(i + 2) % performers.length].id,
        ],
        additionalInfo: {
          ageRestriction: i % 2 === 0 ? '18+' : 'All ages',
          dressCode: 'Smart casual',
          parking: 'On-site parking available',
        },
      },
    })
  }

  payload.logger.info('Seeded database successfully!')
}

// ----------------------------------------
// FETCH FILE HELPER
// ----------------------------------------
async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
