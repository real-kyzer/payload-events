import { Event, Venue } from '@/payload-types'
import Image from 'next/image'

function formatAddress(address: Venue['address']) {
  return `${address.streetAddress}, ${address.locality} ${address.region} ${address.postalCode}`
}

export function HeroComp({ doc }: { doc: Event }) {
  const image = doc.images?.[0]
  const media = image && typeof image === 'object' ? image : null
  const venue = doc.venue as Venue

  const startDate = new Date(doc.startDate)
  const endDate = doc.endDate ? new Date(doc.endDate) : null

  const day = startDate.getDate()
  const month = startDate.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase()
  const year = startDate.getFullYear()

  return (
    <>
      <div
        id="Hero"
        data-w-id="765dcf19-9748-91ec-e486-004874f9e924"
        className="section hero-section"
      >
        <div className="wrapper hero-wrapper">
          <div className="hero-intro">
            <div className="hero-date-card">
              <div className="hero-date">{day}</div>
              <div className="hero-month">{month}</div>
              <div className="hero-year">{year}</div>
            </div>
            <div className="hero-info">
              <h1 className="hero-heading">{doc.title}</h1>
              <a
                href="#"
                data-w-id="85893fbf-c65a-7fe0-cc56-642cdcad1edb"
                className="button color-button w-button"
              >
                View details
              </a>
            </div>
          </div>
        </div>
        <div className="hero-contacts-wrapper">
          <div className="wrapper left side-paddings">
            <div className="hero-contacts">
              <div className="hero-contact">
                <img
                  src="https://cdn.prod.website-files.com/5a680087d2637e0001af7d80/5ac89367e4871d2e7464974a_workshop-icon-color.svg"
                  alt=""
                  className="hero-contact-icon"
                />
                <div>
                  3 Days (Friday-Sunday)
                  <br />
                  70+ Workshops
                </div>
              </div>
              <div className="hero-contact">
                <img
                  src="https://cdn.prod.website-files.com/5a680087d2637e0001af7d80/5ac8936699758e27b71e2957_location-icon-color.svg"
                  alt=""
                  className="hero-contact-icon"
                />
                <div>{formatAddress(venue.address)}</div>
              </div>
              <div className="hero-contact">
                <img
                  src="https://cdn.prod.website-files.com/5a680087d2637e0001af7d80/5ac893662c10d190d1435ccd_contacts-icon-color.svg"
                  alt=""
                  className="hero-contact-icon"
                />
                <div>
                  Drop us a line:
                  <br />
                  <a href="mailto:your@email.com?subject=Eventure" className="link-color">
                    hello@eventure.com
                  </a>
                </div>
              </div>
              <a href="#About" className="hero-scroll-link w-inline-block">
                <div>Scroll</div>
                <img
                  src="https://cdn.prod.website-files.com/5a680087d2637e0001af7d80/5a76b7a84323220001d70a4a_arrow-right-icon.svg"
                  alt=""
                  className="scroll-down-icon"
                />
              </a>
            </div>
          </div>
          <div className="hero-contacts-bg"></div>
          <div className="hero-social">
            <a
              href="https://twitter.com"
              target="_blank"
              className="hero-social-link w-inline-block"
            >
              <img
                src="https://cdn.prod.website-files.com/5a680087d2637e0001af7d80/5a6c4fcd7bd20a000183b8d9_twitter-icon-white.svg"
                alt=""
                className="hero-social-icon"
              />
              <div className="hero-social-text">Twitter</div>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              className="hero-social-link w-inline-block"
            >
              <img
                src="https://cdn.prod.website-files.com/5a680087d2637e0001af7d80/5a6c4fcc7bd20a000183b8d8_facebook-icon-white.svg"
                alt=""
                className="hero-social-icon"
              />
              <div className="hero-social-text">Facebook</div>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              className="hero-social-link no-border w-inline-block"
            >
              <img
                src="https://cdn.prod.website-files.com/5a680087d2637e0001af7d80/5a6c4fcd513ec40001b66044_youtube-icon-white.svg"
                alt=""
                className="hero-social-icon"
              />
              <div className="hero-social-text">YouTube</div>
            </a>
          </div>
        </div>
        <div className="hero-bg-text">—&nbsp;&nbsp;{year}</div>
        <div className="bg-image hero-image" style={{ isolation: 'isolate' }}>
          <Image
            src={media?.url || ''}
            alt=""
            fill
            style={{ objectFit: 'cover', zIndex: '1' }}
            priority
          />
          <div
            style={{
              position: 'absolute',
              inset: '0',
              zIndex: '2',
              backgroundImage: `linear-gradient(180deg, rgba(25 43 100 / 80%), rgba(25 43 100 / 80%))`,
            }}
          />
        </div>
      </div>
    </>
  )
}
