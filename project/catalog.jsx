// catalog.jsx — interaktywna baza produktów: wyszukiwarka + filtry + sortowanie.
const { useState: useS3, useMemo: useM3 } = React;

const CAT_TINT = {
  piany:     ['#FBE7DF', 'var(--flame)'],
  silikony:  ['#E5E9F8', 'var(--cobalt)'],
  akryle:    ['#E7EAEF', 'var(--ash-700)'],
  kleje:     ['#FEF1D9', '#B97A0A'],
  akcesoria: ['#E4E7EA', 'var(--navy)'],
};

function ProductTile({ p }) {
  const { IArrow } = window.Icons;
  const cat = window.CATEGORIES.find(c => c.id === p.category);
  const [tint, fg] = CAT_TINT[p.category] || ['#eee','#333'];
  const role = window.ROLE_LABEL[p.role];
  return (
    <article className="pcard">
      <div className="pcard-img" style={{ background: tint, color: fg }}>
        <Icon name={cat.icon} size={64} style={{ opacity:.9 }} />
        <span className="pcard-imgtag">Zdjęcie wkrótce</span>
        {role && <span className={'pbadge ' + role.cls}>{role.t}</span>}
      </div>
      <div className="pcard-body">
        <div className="pcard-brand">{p.brand}</div>
        <h3 className="pcard-name">{p.name}</h3>
        <div className="pcard-variant">{p.variant}</div>
        <div className="pcard-tags">
          {p.tags.map(t => <span className="ptag" key={t}>{t}</span>)}
        </div>
        <div className="pcard-foot">
          <div>
            <div className="pcard-pack">{p.pack}</div>
            <div className="pcard-sku num">{p.sku}</div>
          </div>
          <a href="#kontakt" className="pcard-ask">Zapytaj o cenę <IArrow s={16}/></a>
        </div>
      </div>
    </article>
  );
}

function ProductDatabase({ initialCat = 'all', initialCatRef }) {
  const { IGrid, IX } = window.Icons;
  const [q, setQ] = useS3('');
  const [cat, setCat] = useS3('all');
  const [brand, setBrand] = useS3('all');
  const [sort, setSort] = useS3('name');

  // allow external category pick (from Categories section)
  React.useEffect(() => {
    if (initialCatRef) initialCatRef.current = (c) => setCat(c === 'all' ? 'all' : c);
  }, [initialCatRef]);

  const results = useM3(() => {
    let r = window.PRODUCTS.filter(p => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (brand !== 'all' && p.brand !== brand) return false;
      if (q.trim()) {
        const s = (p.name + ' ' + p.brand + ' ' + p.sku + ' ' + p.variant + ' ' + p.tags.join(' ')).toLowerCase();
        if (!s.includes(q.trim().toLowerCase())) return false;
      }
      return true;
    });
    if (sort === 'name') r = [...r].sort((a,b)=>a.name.localeCompare(b.name,'pl'));
    if (sort === 'brand') r = [...r].sort((a,b)=>a.brand.localeCompare(b.brand,'pl') || a.name.localeCompare(b.name,'pl'));
    return r;
  }, [q, cat, brand, sort]);

  const active = q || cat !== 'all' || brand !== 'all';
  const clear = () => { setQ(''); setCat('all'); setBrand('all'); };

  return (
    <section id="baza" className="sec sec-base">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Baza produktów</span>
          <h2 className="h-sec">Przeszukaj cały katalog.</h2>
          <p className="lead" style={{ maxWidth:560, marginTop:14 }}>
            Wersja beta — ceny hurtowe pokazujemy po zalogowaniu. Filtruj po kategorii i marce, a o cenę pytaj jednym kliknięciem.
          </p>
        </div>

        <div className="base-toolbar">
          <div className="search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Szukaj: nazwa, marka, SKU, np. „silikon sanitarny”…" />
            {q && <button className="search-x" onClick={()=>setQ('')} aria-label="Wyczyść"><IX s={18}/></button>}
          </div>
          <div className="sortbox">
            <label>Sortuj</label>
            <select value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="name">Nazwa A–Z</option>
              <option value="brand">Marka</option>
            </select>
          </div>
        </div>

        <div className="filters">
          <div className="filter-line">
            <span className="filter-k">Kategoria</span>
            <div className="chips">
              <button className={'chip' + (cat==='all'?' active':'')} onClick={()=>setCat('all')}>Wszystkie</button>
              {window.CATEGORIES.map(c=>(
                <button key={c.id} className={'chip' + (cat===c.id?' active':'')} onClick={()=>setCat(c.id)}>{c.label}</button>
              ))}
            </div>
          </div>
          <div className="filter-line">
            <span className="filter-k">Marka</span>
            <div className="chips">
              <button className={'chip' + (brand==='all'?' active':'')} onClick={()=>setBrand('all')}>Wszystkie</button>
              {window.BRANDS.map(b=>(
                <button key={b} className={'chip' + (brand===b?' active':'')} onClick={()=>setBrand(b)}>{b}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="base-meta">
          <span className="num">{results.length}</span> {results.length === 1 ? 'produkt' : (results.length>=2&&results.length<=4?'produkty':'produktów')}
          {active && <button className="base-clear" onClick={clear}>Wyczyść filtry <IX s={15}/></button>}
        </div>

        {results.length ? (
          <div className="pgrid">
            {results.map(p => <ProductTile key={p.sku} p={p} />)}
          </div>
        ) : (
          <div className="empty">
            <span className="empty-ic"><IGrid s={30}/></span>
            <h3 className="why-t">Brak wyników</h3>
            <p className="why-d">Nie znaleźliśmy produktów dla tych filtrów. Zmień zapytanie lub wyczyść filtry.</p>
            <button className="btn btn-ghost" onClick={clear}>Wyczyść filtry</button>
          </div>
        )}
      </div>
    </section>
  );
}

window.ProductDatabase = ProductDatabase;
