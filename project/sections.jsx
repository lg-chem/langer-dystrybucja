// sections.jsx — marketing sections for the Langer site.
const { useState, useEffect, useRef } = React;

/* ---------- Brand mark: L fused with an (upside-down) paint roller ---------- */
function LangerMark({ size = 40, className }) {
  // stem = currentColor (adapts to bg), roller = flame
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* handle / L-stem */}
      <rect x="13" y="7" width="11" height="35" rx="5.5" fill="currentColor" />
      {/* frame arm down to roller */}
      <rect x="18.5" y="38" width="6" height="10" rx="3" fill="currentColor" />
      {/* roller cylinder = L foot, flame */}
      <rect x="13" y="46" width="42" height="13" rx="6.5" fill="var(--flame)" />
      {/* nap seam */}
      <line x1="13" y1="52.5" x2="55" y2="52.5" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.4" />
    </svg>
  );
}

function LangerLogo({ onDark, size = 40 }) {
  return (
    <a href="#top" className="logo" style={{ color: onDark ? '#fff' : 'var(--navy)' }}>
      <LangerMark size={size} />
      <span className="logo-words">
        <span className="logo-name">LANGER</span>
        <span className="logo-sub" style={{ color: onDark ? 'rgba(255,255,255,.6)' : 'var(--ash-700)' }}>DYSTRYBUCJA</span>
      </span>
    </a>
  );
}

function Icon({ name, size = 24, style }) {
  return (
    <span aria-hidden="true" style={{
      display:'inline-block', width:size, height:size, background:'currentColor',
      WebkitMaskImage:`url(assets/icons/${name}.svg)`, maskImage:`url(assets/icons/${name}.svg)`,
      WebkitMaskRepeat:'no-repeat', maskRepeat:'no-repeat',
      WebkitMaskPosition:'center', maskPosition:'center',
      WebkitMaskSize:'contain', maskSize:'contain', ...style,
    }} />
  );
}

/* inline lucide-ish line icons */
const Svg = (p) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={p.style}>{p.children}</svg>;
const IArrow = (p)=> <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Svg>;
const ITruck = (p)=> <Svg {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></Svg>;
const IBox = (p)=> <Svg {...p}><path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/></Svg>;
const ITag = (p)=> <Svg {...p}><path d="M3 11l8-8 9 9-8 8z"/><circle cx="8" cy="8" r="1.4"/></Svg>;
const IHead = (p)=> <Svg {...p}><path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2zM18 16v1a3 3 0 01-3 3h-3"/></Svg>;
const IClock = (p)=> <Svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Svg>;
const IShield = (p)=> <Svg {...p}><path d="M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></Svg>;
const IGrid = (p)=> <Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Svg>;
const IPhone = (p)=> <Svg {...p}><path d="M5 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></Svg>;
const IMail = (p)=> <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></Svg>;
const IPin = (p)=> <Svg {...p}><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></Svg>;
const ICheck = (p)=> <Svg {...p}><path d="M20 6L9 17l-5-5"/></Svg>;
const IMenu = (p)=> <Svg {...p}><path d="M3 6h18M3 12h18M3 18h18"/></Svg>;
const IX = (p)=> <Svg {...p}><path d="M6 6l12 12M18 6L6 18"/></Svg>;

window.Icons = { IArrow, ITruck, IBox, ITag, IHead, IClock, IShield, IGrid, IPhone, IMail, IPin, ICheck, IMenu, IX };

/* ---------------------------- HEADER ---------------------------- */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const links = [['#proces','Proces'],['#oferta','Oferta'],['#baza','Baza produktów'],['#dlaczego','Dlaczego my'],['#kontakt','Kontakt']];
  return (
    <header className={'hdr' + (scrolled ? ' hdr-solid' : '')}>
      <div className="wrap hdr-in">
        <LangerLogo onDark={!scrolled} size={38} />
        <nav className="hdr-nav">
          {links.map(([h,l]) => <a key={h} href={h} className="hdr-link">{l}</a>)}
        </nav>
        <div className="hdr-cta">
          <a href="#kontakt" className="btn btn-flame" style={{ padding:'12px 20px', fontSize:15 }}>Zostań partnerem <IArrow s={17}/></a>
        </div>
        <button className="hdr-burger" onClick={()=>setOpen(true)} aria-label="Menu"><IMenu s={24}/></button>
      </div>
      {open && (
        <div className="mobile-menu" onClick={()=>setOpen(false)}>
          <div className="mobile-sheet" onClick={e=>e.stopPropagation()}>
            <button className="mm-close" onClick={()=>setOpen(false)} aria-label="Zamknij"><IX s={24}/></button>
            {links.map(([h,l]) => <a key={h} href={h} className="mm-link" onClick={()=>setOpen(false)}>{l}</a>)}
            <a href="#kontakt" className="btn btn-flame" onClick={()=>setOpen(false)} style={{marginTop:16}}>Zostań partnerem <IArrow/></a>
          </div>
        </div>
      )}
    </header>
  );
}

window.LangerMark = LangerMark;
window.LangerLogo = LangerLogo;
window.Icon = Icon;
window.Header = Header;
