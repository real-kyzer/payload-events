/* eslint-disable @next/next/no-html-link-for-pages */
export function MenuComp() {
  return (
    <div
      data-collapse="medium"
      data-animation="default"
      data-duration="400"
      data-doc-height="1"
      data-easing="ease"
      data-easing2="ease"
      role="banner"
      className="nav-bar w-nav"
    >
      <div className="wrapper nav-bar-wrapper">
        <a
          href="/"
          data-w-id="6b0c85b1-2520-07d3-ffe4-64c3e4ff4e9d"
          aria-current="page"
          className="brand w-nav-brand w--current"
          aria-label="home"
        >
          <div>Home</div>
          <div className="nav-underline" style={{ width: '0%', height: '2px' }}></div>
        </a>
        <nav role="navigation" className="nav-menu w-nav-menu">
          <a href="/" aria-current="page" className="nav-link w-inline-block w--current">
            <div>Home</div>
            <div className="nav-underline" style={{ width: '0%', height: '2px' }}></div>
          </a>
          <a href="/events" className="nav-link w-inline-block">
            <div>Events</div>
            <div className="nav-underline" style={{ width: '0%', height: '' }}></div>
          </a>
          <a href="/venues" className="nav-link w-inline-block">
            <div>Venues</div>
            <div className="nav-underline" style={{ width: '0%', height: '' }}></div>
          </a>
        </nav>
        <div
          className="menu-button w-nav-button"
          aria-label="menu"
          role="button"
          aria-controls="w-nav-overlay-0"
          aria-haspopup="menu"
          aria-expanded="false"
        >
          <div className="w-icon-nav-menu"></div>
        </div>
      </div>
      <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div>
    </div>
  )
}
