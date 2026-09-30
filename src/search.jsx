import { useEffect, useState } from 'react';
import { fetchJson, TONES } from './lib.js';

export function SearchPage() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  const [type, setType] = useState(params.get('type') || 'All');
  const [cat, setCat] = useState(params.get('cat') || 'All');
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchJson(
      `/api/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}&cat=${encodeURIComponent(cat)}`
    )
      .then((d) => {
        if (cancelled) return;
        const canonical = (list, v) => {
          const hit = list.find((f) => f.toLowerCase() === v.toLowerCase());
          return hit ? hit : 'All';
        };
        const nt = canonical(d.types.map((t) => t.facet), type);
        const nc = canonical(d.cats.map((c) => c.facet), cat);
        if (nt !== type || nc !== cat) {
          setType(nt);
          setCat(nc);
          return;
        }
        setData(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [type, cat]);

  return (
    <section className="container">
      <div className="page-head">
        <h1>Search</h1>
        <p className="dek" id="search-query-line">
          You searched for “{q}”
        </p>
      </div>

      <div className="facet-bar" id="type-facets">
        {data
          ? data.types.map((t) => (
              <button
                key={t.facet}
                className={`facet ${type === t.facet ? 'active' : ''}`}
                data-type={t.facet}
                onClick={() => setType(t.facet)}
              >
                {t.facet} {t.count}
              </button>
            ))
          : null}
      </div>
      <div className="facet-bar" id="cat-facets">
        {data
          ? data.cats.map((c) => (
              <button
                key={c.facet}
                className={`facet ${cat === c.facet ? 'active' : ''}`}
                data-cat={c.facet}
                onClick={() => setCat(c.facet)}
              >
                {c.facet} {c.count}
              </button>
            ))
          : null}
      </div>
      <div className="sort-row">
        Sort:{' '}
        <select id="sort">
          <option>Most Recent</option>
          <option>Oldest to Newest</option>
        </select>
      </div>
      <div id="results">
        {data
          ? data.items.length
            ? data.items.map((d, i) => (
                <a key={i} className="story" href="article.html">
                  <div className="story__body">
                    <div className="story__eyebrow eyebrow">
                      {d.type} · {d.category}
                    </div>
                    <span className="story__title">{d.title}</span>
                    <p className="story__dek">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt.
                    </p>
                    <span className="meta">
                      {d.category === 'Brand Studio' ? 'brand studio' : 'a few hours ago'}
                    </span>
                  </div>
                  <div className="story__media">
                    <div
                      className={`ph ${TONES[i % TONES.length]}`}
                      data-label={d.category}
                    ></div>
                  </div>
                </a>
              ))
            : (
                <p className="dek" style={{ padding: '30px 0' }}>
                  No results found.
                </p>
              )
          : null}
      </div>
    </section>
  );
}
