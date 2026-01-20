import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import payloadConfig from '@/payload.config'
import Link from 'next/link'
import { Media, Offer, Performer, Venue } from '@/payload-types'
import React, { cache } from 'react'

export const dynamic = 'force-dynamic'

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatAddress(address: Venue['address']) {
  return `${address.streetAddress}, ${address.locality} ${address.region} ${address.postalCode}`
}

function formatCurrency(amount: number, currency: string) {
  if (amount === 0) return 'Free'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

const queryEventsById = cache(async ({ id }: { id: string }) => {
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'events',
    where: {
      id: {
        equals: id,
      },
    },
    depth: 3,
    limit: 1,
  })

  return result.docs?.[0] || null
})

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  // const payload = await getPayload({ config: payloadConfig });

  const { id } = await params

  // Fetch the event by slug (or change to id if needed)
  // const event = await payload.find({
  //   collection: "events",
  //   where: {
  //     id: {
  //       equals: id,
  //     },
  //   },
  //   depth: 3,
  // });

  // const doc = event.docs[0];
  const doc = queryEventsById({ id })

  if (!doc) {
    return <div>Event not found</div>
  }

  const image = doc.images?.[0]

  const media = image && typeof image === 'object' ? image : null
  const heroImage = doc.images?.[0] || null

  const startDate = new Date(doc.startDate)
  const endDate = doc.endDate ? new Date(doc.endDate) : null

  const day = startDate.getDate()
  const month = startDate.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase()
  const year = startDate.getFullYear()

  const lowestPrice = (doc.offers as unknown as Offer[])?.length
    ? Math.min(...(doc.offers as unknown as Offer[]).map((o) => o.price))
    : null

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Hero Section - Eventure Style */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
          backgroundColor: '#6c5ce7',
        }}
      >
        {/* Background Image */}
        {heroImage && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              // backgroundImage: `linear-gradient(180deg, rgba(98, 51, 239, 0.8), rgba(98, 51, 239, 0.8)), url(${media?.url || null})`,
              backgroundImage: `linear-gradient(180deg, rgba(25 43 100 / 80%), rgba(25 43 100 / 80%)), url(${media?.url || null})`,
              backgroundPosition: '0px 0px, 50% 50%',
              backgroundSize: 'auto, cover',
              backgroundRepeat: 'repeat, no-repeat',
            }}
          />
        )}

        {/* Purple Overlay */}
        {/* <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(108, 92, 231, 0.95) 0%, rgba(94, 79, 212, 0.9) 100%)',
          }}
        /> */}

        {/* Large Decorative Year */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '-2%',
            fontSize: 'clamp(150px, 25vw, 350px)',
            fontWeight: 800,
            color: 'rgba(255, 255, 255, 0.08)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {'2026'}
        </div>

        {/* Decorative Line */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '15%',
            width: '80px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          }}
        />

        {/* Navigation */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '1.5rem 3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 20,
          }}
        >
          <Link
            href="/events"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Events
          </Link>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link
              href="/events"
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              All Events
            </Link>
            <Link
              href={`/venues/`}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              Venues
            </Link>
            <Link
              href={(doc.offers as any)?.[0]?.url || '#tickets'}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                padding: '0.6rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 4,
              }}
            >
              Get Tickets
            </Link>
          </div>
        </div>

        {/* Main Hero Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '0 3rem',
            maxWidth: 1400,
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2.5rem' }}>
            {/* Date Box */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1.5rem 1.75rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 4,
                minWidth: 100,
              }}
            >
              <span
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {day}
              </span>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#fff',
                  marginTop: '0.25rem',
                  letterSpacing: '0.1em',
                }}
              >
                {month}
              </span>
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  margin: '0.75rem 0',
                }}
              />
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#fff',
                  letterSpacing: '0.15em',
                }}
              >
                {year}
              </span>
            </div>

            {/* Vertical Divider */}
            <div
              style={{
                width: '1px',
                height: '180px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                alignSelf: 'center',
              }}
            />

            {/* Title and CTA */}
            <div style={{ maxWidth: 650 }}>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.4rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {doc.eventStatus}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.4rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    borderRadius: 4,
                  }}
                >
                  {doc.attendanceMode}
                </span>
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)',
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}
              >
                {doc.title}
              </h1>
              <Link
                href={(doc.offers as any)?.[0]?.url || '#tickets'}
                style={{
                  display: 'inline-block',
                  marginTop: '2rem',
                  padding: '1rem 2rem',
                  backgroundColor: '#ff6b6b',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
                }}
              >
                Get Tickets
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            padding: '1.5rem 3rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '4rem',
          }}
        >
          {/* Duration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: '#f3f0ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6c5ce7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {/* {formatTime(startDate)} - {endDate ? formatTime(endDate) : 'Late'} */}
              </div>
              {/* <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{formatDate(startDate)}</div> */}
            </div>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {(doc.venue as any).address.streetAddress}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {(doc.venue as any).address.locality}, {(doc.venue as any).address.region}{' '}
                {(doc.venue as any).address.postalCode}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: '#fce7f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#db2777"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Drop us a line:</div>
              <a
                href={`mailto:${(doc.organizer as any).contact.email}`}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#6c5ce7',
                  textDecoration: 'none',
                }}
              >
                {(doc.organizer as any).contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* Social Links - Right Side */}
        <div
          style={{
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            zIndex: 20,
          }}
        >
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#fff',
            opacity: 0.6,
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              writingMode: 'vertical-rl',
            }}
          >
            Scroll
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </div>

      {/* Content Container */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 1.5rem',
          marginTop: '-3rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <style>
          {` .layout-grid { 
          display: grid; grid-template-columns: 1fr 380px; gap: 2rem; padding-bottom: 4rem; 
          } 
          @media (max-width: 800px) {
           .layout-grid { 
           grid-template-columns: 1fr; 
           } 
           }
          `}
        </style>
        {/* Main Grid */}
        <div className="layout-grid">
          {/* Left Column - Main Content */}
          <div>
            {/* Quick Stats Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1px',
                backgroundColor: '#e5e7eb',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                marginBottom: '2rem',
              }}
            >
              {/* Date */}
              <div
                style={{
                  backgroundColor: '#fff',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: '#f0fdf4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Date
                </span>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#111827',
                    marginTop: '0.25rem',
                  }}
                >
                  {startDate.toLocaleDateString('en-AU', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Time */}
              <div
                style={{
                  backgroundColor: '#fff',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Time
                </span>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#111827',
                    marginTop: '0.25rem',
                  }}
                >
                  {formatTime(startDate)} {endDate && `- ${formatTime(endDate)}`}
                </span>
              </div>

              {/* Price */}
              <div
                style={{
                  backgroundColor: '#fff',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: '#ede9fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  From
                </span>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#111827',
                    marginTop: '0.25rem',
                  }}
                >
                  {lowestPrice !== null
                    ? formatCurrency(lowestPrice, (doc.offers[0] as Offer)?.currency || 'AUD')
                    : 'TBA'}
                </span>
              </div>
            </div>

            {/* About Section */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: '2rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                marginBottom: '1.5rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 1.5rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                About This Event
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  color: 'black',
                }}
              >
                <RichText data={doc.description} />
              </div>
            </div>

            {(doc.images as Media[])?.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={image.alt || ''}
                style={{ maxWidth: '100%' }}
              />
            ))}

            {/* Performers */}
            {doc.performers && doc.performers.length > 0 && (
              <div
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: '2rem',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  marginBottom: '1.5rem',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#111827',
                    margin: '0 0 1.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Featuring
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {(doc.performers as unknown as Performer[]).map((performer) => (
                    <div
                      key={performer.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: 12,
                        border: '1px solid #f3f4f6',
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          backgroundColor:
                            performer.type === 'Organization' ? '#dbeafe' : '#fce7f3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {performer.type === 'Organization' ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#db2777"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#111827',
                            display: 'block',
                          }}
                        >
                          {performer.name}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {performer.type === 'Organization' ? 'Group' : 'Artist'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Good to Know */}
            {(doc.additionalInfo.parking ||
              doc.additionalInfo.ageRestriction ||
              doc.additionalInfo.dressCode) && (
              <div
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: '2rem',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#111827',
                    margin: '0 0 1.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  Good to Know
                </h2>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {doc.additionalInfo.ageRestriction && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        backgroundColor: '#fef3c7',
                        borderRadius: 12,
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                      <div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: '#92400e',
                            fontWeight: 500,
                            display: 'block',
                          }}
                        >
                          Age Restriction
                        </span>
                        <span
                          style={{
                            fontSize: '0.95rem',
                            color: '#78350f',
                            fontWeight: 600,
                          }}
                        >
                          {doc.additionalInfo.ageRestriction}
                        </span>
                      </div>
                    </div>
                  )}
                  {doc.additionalInfo.dressCode && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        backgroundColor: '#fce7f3',
                        borderRadius: 12,
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#be185d"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                      </svg>
                      <div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: '#9d174d',
                            fontWeight: 500,
                            display: 'block',
                          }}
                        >
                          Dress Code
                        </span>
                        <span
                          style={{
                            fontSize: '0.95rem',
                            color: '#831843',
                            fontWeight: 600,
                          }}
                        >
                          {doc.additionalInfo.dressCode}
                        </span>
                      </div>
                    </div>
                  )}
                  {doc.additionalInfo.parking && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        backgroundColor: '#dbeafe',
                        borderRadius: 12,
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
                      </svg>
                      <div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: '#1e40af',
                            fontWeight: 500,
                            display: 'block',
                          }}
                        >
                          Parking
                        </span>
                        <span
                          style={{
                            fontSize: '0.95rem',
                            color: '#1e3a8a',
                            fontWeight: 600,
                          }}
                        >
                          {doc.additionalInfo.parking}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Tickets Card */}
            {doc.offers && doc.offers.length > 0 && (
              <div
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: '1.75rem',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  position: 'sticky',
                  top: '1.5rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#111827',
                    margin: '0 0 1.25rem 0',
                  }}
                >
                  Get Tickets
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  {(doc.offers as unknown as Offer[]).map((offer) => (
                    <div
                      key={offer.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: 10,
                        border: '1px solid #f3f4f6',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#111827',
                            display: 'block',
                          }}
                        >
                          {offer.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: offer.availability === 'InStock' ? '#059669' : '#dc2626',
                            fontWeight: 500,
                          }}
                        >
                          {offer.availability === 'InStock' ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: offer.price === 0 ? '#059669' : '#111827',
                        }}
                      >
                        {formatCurrency(offer.price, offer.currency)}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href={(doc.offers[0] as Offer)?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#111827',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 10,
                    textDecoration: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Book Now
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            )}

            {/* Venue Card */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: '1.75rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 1.25rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Venue
              </h3>
              <Link
                href={`/venues/${(doc.venue as Venue).id}`}
                style={{
                  display: 'block',
                  padding: '1.25rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: 12,
                  textDecoration: 'none',
                  border: '1px solid #f3f4f6',
                  transition: 'border-color 0.2s, background-color 0.2s',
                }}
              >
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#111827',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  {(doc.venue as Venue).name}
                </span>
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    lineHeight: 1.5,
                    display: 'block',
                  }}
                >
                  {formatAddress((doc.venue as Venue).address)}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginTop: '0.75rem',
                    fontSize: '0.85rem',
                    color: '#2563eb',
                    fontWeight: 500,
                  }}
                >
                  View venue details
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Organizer Card */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: '1.75rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 1.25rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Organizer
              </h3>
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: 12,
                  border: '1px solid #f3f4f6',
                }}
              >
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#111827',
                    display: 'block',
                    marginBottom: '1rem',
                  }}
                >
                  {(doc.organizer as any).name}
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  {(doc.organizer as any).contact.email && (
                    <a
                      href={`mailto:${(doc.organizer as any).contact.email}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.9rem',
                        color: '#4b5563',
                        textDecoration: 'none',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      {(doc.organizer as any).contact.email}
                    </a>
                  )}
                  {(doc.organizer as any).contact.telephone && (
                    <a
                      href={`tel:${(doc.organizer as any).contact.telephone}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.9rem',
                        color: '#4b5563',
                        textDecoration: 'none',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {(doc.organizer as any).contact.telephone}
                    </a>
                  )}
                  {(doc.organizer as any).url && (
                    <a
                      href={(doc.organizer as any).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.9rem',
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      Visit website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
