import SocialLinks from './SocialLinks.jsx'

export default function Sections() {
  return (
    <main className="content">
      <header className="nav">
        <span className="nav__brand">BRIGGZZY</span>
        <nav className="nav__links">
          <a href="#music">Music</a>
          <a href="#visuals">Visuals</a>
          <a href="#shows">Shows</a>
          <a href="#connect">Connect</a>
        </nav>
      </header>

      {/* HERO — tall so the particle morph has room to play out on scroll */}
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Melodic Rap · New Single Out Now</p>
          <h1 className="hero__title">BRIGGZZY</h1>
          <SocialLinks className="socials-hero" />
        </div>
        <div className="scroll-hint">scroll</div>
      </section>

      <section className="panel" id="about">
        <p className="section-index">01 — Artist</p>
        <h2>Built in the dark, made to glow.</h2>
        <p className="lede">
          Briggzzy turns the small hours into sound — melodic rap that sits
          somewhere between a confession and a club. Three singles, two million
          streams, one voice you don't forget.
        </p>
      </section>

      <section className="panel panel--split" id="music">
        <div>
          <p className="section-index">02 — Latest Release</p>
          <h2>“Blue Hour”</h2>
          <p className="lede">
            The new single. Reverb-soaked vocals over a midnight 808.
          </p>
          <div className="cta-row">
            <a className="btn btn--solid" href="#">Spotify</a>
            <a className="btn btn--ghost" href="#">Apple Music</a>
            <a className="btn btn--ghost" href="#">YouTube</a>
          </div>
        </div>
        <div className="release-card">
          <div className="release-art" />
          <div className="release-meta">
            <span>Briggzzy — Blue Hour</span>
            <span>3:48</span>
          </div>
        </div>
      </section>

      <section className="panel" id="visuals">
        <p className="section-index">03 — Visuals</p>
        <h2>The look</h2>
        <div className="gallery">
          <div className="gallery__tile" />
          <div className="gallery__tile" />
          <div className="gallery__tile" />
          <div className="gallery__tile" />
        </div>
      </section>

      <section className="panel" id="shows">
        <p className="section-index">04 — Live</p>
        <h2>Shows</h2>
        <ul className="shows">
          <li><span>Jul 12</span><span>Atlanta, GA</span><span>The Loft</span><a className="btn btn--ghost" href="#">RSVP</a></li>
          <li><span>Jul 19</span><span>Houston, TX</span><span>White Oak</span><a className="btn btn--ghost" href="#">RSVP</a></li>
          <li><span>Aug 02</span><span>Los Angeles, CA</span><span>The Roxy</span><a className="btn btn--ghost" href="#">RSVP</a></li>
        </ul>
      </section>

      <section className="panel panel--center" id="connect">
        <p className="section-index">05 — Connect</p>
        <h2>Stay close.</h2>
        <p className="lede">Join the list for unreleased drops and first-access tickets.</p>
        <form className="signup" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="your@email.com" aria-label="Email" />
          <button className="btn btn--solid" type="submit">Subscribe</button>
        </form>
        <div className="socials">
          <a href="#">Instagram</a><a href="#">TikTok</a><a href="#">Spotify</a><a href="#">YouTube</a>
        </div>
        <footer className="footer">© {new Date().getFullYear()} Briggzzy. All rights reserved.</footer>
      </section>
    </main>
  )
}
