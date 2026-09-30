import { useEffect, useRef } from 'react';
import { ICONS } from './icons.jsx';
import { useShell } from './hooks.js';
import { bindInteractions, bindSearchInput } from './interactions.js';

export function SiteHeader() {
  const shell = useShell();
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__left">
            <button className="hamburger" data-action="menu" aria-label="Open menu">
              {ICONS.menu}
            </button>
            <button className="edition-pill" data-action="editions">
              Edition: World {ICONS.chevron}
            </button>
          </div>
          <a className="logo" href="index.html">
            QUARTZ<span className="dot">.</span>
          </a>
          <div className="site-header__right">
            <button className="icon-btn" data-action="search" aria-label="Search">
              {ICONS.search}
            </button>
            <button className="icon-btn" data-action="account" aria-label="Account">
              {ICONS.user}
            </button>
            <button className="subscribe-btn" data-action="subscribe">
              Subscribe
            </button>
          </div>
        </div>
      </header>
      <div className="ticker">
        <div className="ticker__track" id="ticker-track">
          {shell.ticker.map((t) => (
            <span key={t.s + '-a'} className={`ticker__item ${t.up ? 'up' : 'down'}`}>
              <span className="sym">{t.s}</span> {t.v} <span>{t.d}</span>
            </span>
          ))}
          {shell.ticker.map((t) => (
            <span key={t.s + '-b'} className={`ticker__item ${t.up ? 'up' : 'down'}`}>
              <span className="sym">{t.s}</span> {t.v} <span>{t.d}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export function Drawer() {
  const shell = useShell();
  return (
    <>
      <div className="overlay" data-action="close-all"></div>
      <aside className="drawer" id="drawer">
        <div className="drawer__head">
          <span className="drawer__brand">
            QUARTZ<span>.</span>
          </span>
          <button className="icon-btn" data-action="close-all">
            {ICONS.close}
          </button>
        </div>
        <div className="drawer__body">
          <div className="drawer__group">
            <div className="drawer__label">Sections</div>
            {shell.nav.primary.map((l) => (
              <a key={l.href} className="drawer__link" href={l.href}>
                {l.label}
                <span className="chev">{ICONS.chevron}</span>
              </a>
            ))}
          </div>
          <div className="drawer__group">
            <div className="drawer__label">More</div>
            <div className="drawer__row">
              {shell.nav.secondary.map((l) => (
                <a key={l.href} className="drawer__link" href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="drawer__group">
            <div className="drawer__label">Editions</div>
            {shell.nav.editions.map((l) => (
              <a key={l.href} className="drawer__link" href={l.href}>
                {l.label}
                {l.current ? <span className="chev">•</span> : null}
              </a>
            ))}
          </div>
          <div className="drawer__group">
            <a className="drawer__link" href="#" data-action="account">
              Sign In / My Feed
              <span className="chev">{ICONS.chevron}</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

export function SearchModal() {
  const shell = useShell();
  const inputRef = useRef(null);

  useEffect(() => {
    bindInteractions();
    bindSearchInput(inputRef.current);
  }, []);

  return (
    <div className="search-modal" id="search-modal">
      <button className="icon-btn search-modal__close" data-action="close-search">
        {ICONS.close}
      </button>
      <div className="search-modal__inner">
        <div className="search-input-wrap">
          {ICONS.search}
          <input
            ref={inputRef}
            className="search-input"
            id="search-input"
            placeholder="Search keywords, topics and more"
            autoComplete="off"
          />
        </div>
        <div className="search-modal__block">
          <div className="search-modal__title">Trending topics</div>
          <div className="trending-list" id="search-trending">
            {shell.trending.map((t) => (
              <button key={t} className="trending-pill" data-q={t}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="search-modal__block">
          <div className="search-modal__title">Suggestions</div>
          <div id="search-suggest" style={{ maxHeight: 260, overflow: 'auto' }}></div>
        </div>
      </div>
    </div>
  );
}

export function AuthModal() {
  return (
    <>
      <div className="overlay" data-action="close-auth"></div>
      <div className="auth-modal" id="auth-modal">
        <div className="auth-modal__card">
          <button className="icon-btn auth-modal__close" data-action="close-auth">
            {ICONS.close}
          </button>
          <div className="auth-modal__brand">Sign in</div>
          <div className="auth-modal__sub">
            Continue with your meconnect account to bookmark stories and build My Feed.
          </div>
          <div className="field">
            <label htmlFor="auth-email">Email</label>
            <input id="auth-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="auth-pass">Password</label>
            <input id="auth-pass" type="password" placeholder="••••••••" />
          </div>
          <button className="btn btn--solid btn--block" data-action="do-signin">
            Sign in
          </button>
          <div className="auth-modal__foot">
            New here? <a href="#" data-action="do-signin">Create an account</a> · Single sign-on via{' '}
            <b>meconnect</b>
          </div>
        </div>
      </div>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="logo" href="index.html">
              QUARTZ<span>.</span>
            </a>
            <p>
              Trusted news and analysis from Singapore and across Asia — articles, live TV, podcasts,
              visual stories and interactive explainers.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">{ICONS.facebook}</a>
              <a href="#" aria-label="X">{ICONS.x}</a>
              <a href="#" aria-label="LinkedIn">{ICONS.linkedin}</a>
              <a href="#" aria-label="Instagram">{ICONS.instagram}</a>
              <a href="#" aria-label="YouTube">{ICONS.youtube}</a>
              <a href="rss.html" aria-label="RSS">{ICONS.rss}</a>
            </div>
            <div className="footer-apps">
              <a href="#"> App Store</a>
              <a href="#"> Google Play</a>
              <a href="#"> Huawei AppGallery</a>
            </div>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>Sections</h5>
              <a href="section.html?sec=asia">Asia</a>
              <a href="section.html?sec=singapore">Singapore</a>
              <a href="section.html?sec=business">Business</a>
              <a href="section.html?sec=cna-insider">CNA Insider</a>
              <a href="section.html?sec=today">TODAY</a>
              <a href="section.html?sec=commentary">Commentary</a>
              <a href="section.html?sec=world">World</a>
              <a href="section.html?sec=sport">Sport</a>
            </div>
            <div className="footer-col">
              <h5>Products</h5>
              <a href="newsletters.html">Newsletters</a>
              <a href="watch.html">Live TV</a>
              <a href="listen.html">CNA938 &amp; Podcasts</a>
              <a href="fast.html">FAST</a>
              <a href="games.html">Games</a>
              <a href="interactives.html">Interactives</a>
              <a href="rss.html">RSS</a>
            </div>
            <div className="footer-col">
              <h5>About</h5>
              <a href="about.html">About Us</a>
              <a href="about.html#presenters">Our Presenters</a>
              <a href="about.html#correspondents">Our Correspondents</a>
              <a href="about.html#network">Mediacorp Network</a>
              <a href="contact.html">Contact Us</a>
              <a href="advertise.html">Advertise With Us</a>
            </div>
            <div className="footer-col">
              <h5>Legal</h5>
              <a href="#">Official Domain</a>
              <a href="#">Terms &amp; Conditions</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Report Vulnerability</a>
              <a href="#">Online Links Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © <span id="footer-year">{new Date().getFullYear()}</span> Mediacorp Pte Ltd. All rights
            reserved. (Design study — Quartz-style look &amp; feel)
          </span>
          <span>
            <a href="contact.html">Help &amp; Feedback</a> · <a href="#">Cookie Settings</a> ·{' '}
            <a href="#">Accessibility</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
