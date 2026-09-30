import { useEffect, useState } from 'react';
import { fetchJson } from './lib.js';

export function FastApp() {
  const [stories, setStories] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetchJson('/api/fast')
      .then(setStories)
      .catch(() => {});
  }, []);

  const count = stories.length;
  const i = count ? Math.min(idx, count - 1) : 0;
  const s = count ? stories[i] : null;
  const pct = count ? Math.round(((i + 1) / count) * 100) : 0;

  const show = (next) => setIdx(Math.max(0, Math.min(count - 1, next)));

  return (
    <section className="container">
      <div className="page-head" style={{ textAlign: 'center', border: 'none' }}>
        <h1>Welcome to FAST</h1>
        <p className="dek">The day's news in bite-sized portions. Scroll down to begin.</p>
      </div>

      <div className="fast-progress">
        <div className="fast-progress__label" id="fast-label">
          {count ? `Story ${i + 1} of ${count}` : 'Loading…'}
        </div>
        <div className="fast-progress__bar">
          <div className="fast-progress__fill" id="fast-fill" style={{ width: pct + '%' }}></div>
        </div>
      </div>

      <div className="fast-stage" id="fast-stage">
        {s && (
          <article className="fast-card">
            <div className="fast-card__media">
              <div className={`ph ${s.tone}`} data-label={s.cat}></div>
            </div>
            <div className="fast-card__eyebrow eyebrow">{s.cat}</div>
            <h2 className="fast-card__title">{s.title}</h2>
            <ul className="fast-card__points">
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="fast-card__actions">
              <a className="btn btn--solid btn--sm" href="article.html">
                Full story
              </a>
              <button className="btn btn--ghost btn--sm" data-action="share">
                Share
              </button>
            </div>
          </article>
        )}
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0 40px' }}>
        <button className="btn btn--ghost" id="fast-prev" onClick={() => show(idx - 1)}>
          ← Previous
        </button>
        <button className="btn btn--solid" id="fast-next" onClick={() => show(idx + 1)}>
          Next story →
        </button>
      </div>
    </section>
  );
}
