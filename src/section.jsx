import { useEffect, useState } from 'react';
import { fetchJson, TONES } from './lib.js';

export function SectionPage() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get('sec') || 'latest-news';
  const [section, setSection] = useState(null);
  const [articles, setArticles] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sections = await fetchJson('/api/sections');
      const sec = sections.find((s) => s.key === key) || sections.find((s) => s.key === 'latest-news');
      if (cancelled) return;
      setSection(sec);
      document.title = sec.title + ' — Quartz';
      const arts = await fetchJson('/api/articles?block=section');
      if (cancelled) return;
      setArticles(arts);
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container">
      <div className="page-head">
        <h1 id="sec-title">{section ? section.title : 'Section'}</h1>
        <p className="dek" id="sec-dek">{section ? section.dek : 'Latest stories and analysis.'}</p>
      </div>

      <div className="facet-bar" id="sec-facets">
        {section
          ? section.facets.map((f, i) => (
              <button
                key={f}
                className={`facet ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
              >
                {f}
              </button>
            ))
          : null}
      </div>
      <div className="sort-row">
        Sort:{' '}
        <select id="sec-sort">
          <option>Most Recent</option>
          <option>Oldest to Newest</option>
        </select>
      </div>
      <div id="sec-list">
        {articles.map((a, i) => (
          <a key={a.id} className="story" href="article.html">
            <div className="story__body">
              <div className="story__eyebrow eyebrow">{a.category}</div>
              <span className="story__title">{a.title}</span>
              <p className="story__dek">{a.dek}</p>
              <span className="meta">{a.age}</span>
            </div>
            <div className="story__media">
              <div className={`ph ${TONES[i % TONES.length]}`} data-label={a.category}></div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
