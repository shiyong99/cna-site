import { TONES } from './lib.js';
import { useApi } from './hooks.js';
import { ICONS } from './icons.jsx';

/* Data-driven content components. Each mirrors one of the `data-render` kinds
   that the static HTML pages declare on their `[data-fetch]` containers. */

function Ph({ tone, label }) {
  return <div className={`ph ${tone || ''}`} data-label={label ?? ''}></div>;
}

export function Hero({ a }) {
  return (
    <>
      <div className="hero__text">
        <div className="hero__eyebrow eyebrow">{a.category}</div>
        <h1>{a.title}</h1>
        <p className="dek">{a.dek}</p>
        <div className="article-byline">
          <span className="avatar">AL</span>
          <div>
            <div className="byline-name">Amirul Lutfi</div>
            <div className="byline-meta">{a.age} · 5 min read</div>
          </div>
        </div>
      </div>
      <a className="hero__media" href="article.html">
        <Ph tone={a.tone} label={a.category} />
      </a>
    </>
  );
}

export function Story({ a }) {
  return (
    <a className="story" href="article.html">
      <div className="story__body">
        <div className="story__eyebrow eyebrow">{a.category}</div>
        <span className="story__title">{a.title}</span>
        <p className="story__dek">{a.dek}</p>
        <span className="meta">{a.age}</span>
      </div>
      <div className="story__media">
        <Ph tone={a.tone} label={a.category} />
      </div>
    </a>
  );
}

export function Card({ a, i }) {
  const tone = a.tone || TONES[i % TONES.length];
  return (
    <a className="card" href="article.html">
      <div className="card__media">
        <Ph tone={tone} label={a.category} />
      </div>
      <div className="card__eyebrow eyebrow">{a.category}</div>
      <span className="card__title">{a.title}</span>
      {a.dek ? <p className="card__dek">{a.dek}</p> : null}
    </a>
  );
}

export function DiscoverCard({ d }) {
  return (
    <a className="card" href={d.href}>
      <div className="card__media">
        <Ph tone={d.tone} label={d.title} />
      </div>
      <span className="card__title">{d.title}</span>
      <p className="card__dek">{d.dek}</p>
    </a>
  );
}

export function EpisodeRow({ e }) {
  const meta = [e.show || e.category, e.duration].filter(Boolean).join(' · ');
  return (
    <div className="episode-row">
      <div className="episode-row__thumb">
        <Ph tone={e.tone} label={e.duration} />
      </div>
      <div className="episode-row__main">
        <a className="episode-row__title" href={e.href || 'watch.html'}>
          {e.title}
        </a>
        <div className="episode-row__meta">{meta}</div>
      </div>
      <button className="play-btn">{ICONS.play}</button>
    </div>
  );
}

export function SeriesCard({ s }) {
  return (
    <a className="card" href="#">
      <div className="card__media">
        <Ph tone={s.tone} label={s.name} />
      </div>
      <span className="card__title">{s.name}</span>
      <p className="card__dek">{s.dek}</p>
    </a>
  );
}

export function ThumbTile({ g }) {
  return (
    <a className="thumb-tile" href="#">
      <Ph tone={g.tone} label={g.label} />
      <span className="thumb-tile__label">{g.label}</span>
    </a>
  );
}

export function InteractiveCard({ x }) {
  return (
    <a className="card" href="#">
      <div className="card__media">
        <Ph tone={x.tone} label={x.eyebrow} />
      </div>
      <div className="card__eyebrow eyebrow">{x.eyebrow}</div>
      <span className="card__title">{x.title}</span>
    </a>
  );
}

export function SpecCard({ s }) {
  return (
    <div className="spec-card">
      <h3>{s.name}</h3>
      <div className="dims">{s.dims}</div>
      <div className={`spec-box ${s.size}`}>{s.dims.split('—')[0].trim()}</div>
    </div>
  );
}

export function Stat({ s }) {
  return (
    <div className="contact-block">
      <h4 style={{ fontSize: 22 }}>{s.value}</h4>
      <p>{s.label}</p>
    </div>
  );
}

export function FeedRow({ f }) {
  return (
    <tr>
      <td>{f.category}</td>
      <td>
        <code>{f.url}</code>
      </td>
    </tr>
  );
}

export function Person({ p, i }) {
  return (
    <div className="person">
      <div className="person__photo">
        <Ph tone={TONES[i % TONES.length]} label="" />
      </div>
      <div className="person__name">{p.name}</div>
      <div className="person__role">{p.role}</div>
    </div>
  );
}

export function NetworkCard({ n, i }) {
  return (
    <a className="card" href="#">
      <div className="card__media">
        <Ph tone={TONES[i % TONES.length]} label={n.name} />
      </div>
      <span className="card__title">{n.name}</span>
    </a>
  );
}

export function Newsletter({ n }) {
  return (
    <div className="contact-block">
      <div className="eyebrow">{n.cadence}</div>
      <h3 className="mt-8">{n.name}</h3>
      <p className="dek" style={{ fontSize: 14 }}>
        {n.dek}
      </p>
      <button className="btn btn--solid btn--sm mt-8">Subscribe</button>
    </div>
  );
}

export function ScheduleRow({ s }) {
  return (
    <tr>
      <td className="time">{s.time}</td>
      <td className="show">{s.show}</td>
      <td>{s.details}</td>
    </tr>
  );
}

export function Contact({ c }) {
  return (
    <div className="contact-block">
      <h4>{c.heading}</h4>
      {c.detail ? <p>{c.detail}</p> : null}
      {c.email ? (
        <p>
          <a href="#">{c.email}</a>
        </p>
      ) : null}
    </div>
  );
}

/* Renders the result of one `[data-fetch]` container into its host element. */
export function Fetcher({ url, render }) {
  const data = useApi(url);
  if (!data) return null;

  switch (render) {
    case 'hero':
      return <Hero a={data[0]} />;
    case 'story-list':
      return <>{data.map((a) => <Story key={a.id || a.title} a={a} />)}</>;
    case 'cards':
    case 'cards4':
      return <>{data.map((a, i) => <Card key={a.id || a.title || i} a={a} i={i} />)}</>;
    case 'discover':
      return <>{data.map((d) => <DiscoverCard key={d.title} d={d} />)}</>;
    case 'episodes':
      return <>{data.map((e) => <EpisodeRow key={e.title} e={e} />)}</>;
    case 'series':
      return <>{data.map((s) => <SeriesCard key={s.name} s={s} />)}</>;
    case 'thumbs':
      return <>{data.map((g) => <ThumbTile key={g.label} g={g} />)}</>;
    case 'interactives':
      return <>{data.map((x) => <InteractiveCard key={x.title} x={x} />)}</>;
    case 'specs':
      return <>{data.map((s) => <SpecCard key={s.name} s={s} />)}</>;
    case 'stats':
      return <>{data.map((s) => <Stat key={s.label} s={s} />)}</>;
    case 'feeds':
      return <>{data.map((f) => <FeedRow key={f.url} f={f} />)}</>;
    case 'people':
      return <>{data.map((p, i) => <Person key={p.name} p={p} i={i} />)}</>;
    case 'network':
      return <>{data.map((n, i) => <NetworkCard key={n.name} n={n} i={i} />)}</>;
    case 'newsletters':
      return <>{data.map((n) => <Newsletter key={n.name} n={n} />)}</>;
    case 'schedule':
      return <>{data.map((s) => <ScheduleRow key={s.time + s.show} s={s} />)}</>;
    case 'contacts':
      return <>{data.map((c) => <Contact key={c.heading} c={c} />)}</>;
    default:
      return null;
  }
}
