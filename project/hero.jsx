// hero.jsx — Hero (3 warianty), Marquee, WhyUs, Process, Categories, Contact, Footer.
const { useState: useS2, useEffect: useE2, useRef: useR2 } = React;

const HERO = {
  eyebrow: 'Hurtowa dystrybucja chemii budowlanej',
  h1a: 'Chemia budowlana',
  h1b: 'na czas',
  h1c: ', w pełnych kartonach.',
  lead: 'Zaopatrujemy sklepy, hurtownie i ekipy wykonawcze w piany montażowe, silikony, akryle i kleje. Sprawdzone marki, marka własna Langer z najlepszą marżą i krótkie terminy dostaw.',
};

function HeroStats({ onDark }) {
  const stats = [
    ['120+', 'produktów w ofercie'],
    ['6', 'marek, w tym Langer'],
    ['48 h', 'średni czas realizacji'],
    ['1 200+', 'zaopatrywanych punktów'],
  ];
  return (
    <div className={'hstats' + (onDark ? ' on-dark' : '')}>
      {stats.map(([n,l]) => (
        <div className="hstat" key={l}>
          <div className="hstat-n num">{n}</div>
          <div className="hstat-l">{l}</div>
        </div>
      ))}
    </div>
  );
}

function Hero({ variant }) {
  const { IArrow } = window.Icons;
  const Title = ({ light }) => (
    <h1 className="display hero-h">
      {HERO.h1a} <span style={{ color: 'var(--flame)' }}>{HERO.h1b}</span>{HERO.h1c}
    </h1>
  );
  const CTAs = ({ darkBtns }) => (
    <div className="hero-cta">
      <a href="#kontakt" className="btn btn-flame">Zostań partnerem <IArrow/></a>
      <a href="#baza" className={'btn ' + (darkBtns ? 'btn-ghost' : 'btn-ghost on-dark')}>Zobacz bazę produktów</a>
    </div>
  );

  if (variant === 'poster') {
    // FLAME full-bleed poster, navy text
    return (
      <section id="top" className="hero hero-poster">
        <LangerMark size={520} className="hero-watermark" />
        <div className="wrap hero-poster-in">
          <span className="eyebrow" style={{ color: 'var(--navy)' }}>{HERO.eyebrow}</span>
          <h1 className="display hero-h" style={{ color: 'var(--navy)', maxWidth: 980 }}>
            {HERO.h1a} <span style={{ color:'#fff' }}>{HERO.h1b}</span>{HERO.h1c}
          </h1>
          <p className="lead" style={{ color: 'var(--navy)', maxWidth: 620, opacity:.85 }}>{HERO.lead}</p>
          <div className="hero-cta">
            <a href="#kontakt" className="btn btn-dark">Zostań partnerem <IArrow/></a>
            <a href="#baza" className="btn btn-ghost" style={{ borderColor:'rgba(14,21,51,.3)', color:'var(--navy)' }}>Zobacz bazę produktów</a>
          </div>
          <HeroStats onDark={false} />
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    // Half navy / half flame editorial split
    return (
      <section id="top" className="hero hero-split">
        <div className="hero-split-l">
          <div className="hero-split-inner">
            <span className="eyebrow on-dark">{HERO.eyebrow}</span>
            <Title/>
            <p className="lead" style={{ color:'rgba(255,255,255,.72)', maxWidth:520 }}>{HERO.lead}</p>
            <CTAs/>
          </div>
        </div>
        <div className="hero-split-r">
          <LangerMark size={260} className="hero-split-mark" />
          <HeroStats onDark={false} />
        </div>
      </section>
    );
  }

  // default: 'navy' — full navy, big type, floating category chips
  return (
    <section id="top" className="hero hero-navy">
      <div className="hero-grid-bg" />
      <div className="wrap hero-navy-in">
        <span className="eyebrow on-dark">{HERO.eyebrow}</span>
        <Title/>
        <p className="lead" style={{ color:'rgba(255,255,255,.74)', maxWidth: 640 }}>{HERO.lead}</p>
        <CTAs/>
        <HeroStats onDark />
      </div>
    </section>
  );
}

/* scrolling marquee of brands */
function Marquee() {
  const items = ['SOUDAL','TYTAN','PENOSIL','DEN BRAVEN','LANGER','SOUDAL','TYTAN','PENOSIL','DEN BRAVEN','LANGER'];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.concat(items).map((b,i)=>(
          <span className="marquee-item" key={i}>{b}<span className="marquee-dot">/</span></span>
        ))}
      </div>
    </div>
  );
}

/* WHY US */
function WhyUs() {
  const { ITruck, IBox, ITag, IHead, IClock, IShield } = window.Icons;
  const items = [
    [IClock,'Krótkie terminy','Średnio 48 h od zamówienia do rozładunku. Zamówienia do 13:00 kompletujemy tego samego dnia.'],
    [IBox,'Pełen asortyment','Piany, silikony, akryle, kleje i akcesoria w jednym miejscu — bez żonglowania kilkoma hurtowniami.'],
    [ITag,'Marka własna Langer','Produkty Langer w jakości premium, ale z marżą, która realnie zarabia na półce.'],
    [ITruck,'Dostawa na paletach','Logistyka skrojona pod handel — pełne kartony, palety i transport własny w regionie.'],
    [IHead,'Doradztwo handlowca','Stały opiekun, który zna Twój asortyment i podpowiada, co dobrać do zamówienia.'],
    [IShield,'Stała jakość','Tylko sprawdzone marki i partie z atestami. Reklamacje załatwiamy bez przepychanek.'],
  ];
  return (
    <section id="dlaczego" className="sec">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Dlaczego Langer</span>
          <h2 className="h-sec">Hurtownia, która gra<br/>do jednej bramki z Tobą.</h2>
        </div>
        <div className="why-grid">
          {items.map(([Ic,t,d],i)=>(
            <div className="why-card reveal" key={t} style={{ transitionDelay: (i*60)+'ms' }}>
              <span className="why-ic"><Ic s={26}/></span>
              <h3 className="why-t">{t}</h3>
              <p className="why-d">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* PROCESS */
function Process() {
  const steps = [
    ['01','Składasz zamówienie','Online z bazy produktów, mailem lub przez swojego handlowca. Pełne kartony, jasne jednostki sprzedaży.'],
    ['02','Kompletujemy i pakujemy','Magazyn zbiera towar tego samego dnia. Kontrola ilości i partii przed wysyłką.'],
    ['03','Wysyłka i transport','Transport własny w regionie lub spedycja w całej Polsce. Dostawa na paletach pod sklep.'],
    ['04','Rozładunek i rozliczenie','Dostawa w 48 h, faktura z terminem, a Twój handlowiec pilnuje kolejnego uzupełnienia.'],
  ];
  return (
    <section id="proces" className="sec sec-dark">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow on-dark">Proces dystrybucji</span>
          <h2 className="h-sec" style={{ color:'#fff' }}>Od zamówienia do rozładunku<br/>w czterech krokach.</h2>
        </div>
        <div className="proc-grid">
          {steps.map(([n,t,d],i)=>(
            <div className="proc-step reveal" key={n} style={{ transitionDelay:(i*70)+'ms' }}>
              <div className="proc-n num">{n}</div>
              <h3 className="proc-t">{t}</h3>
              <p className="proc-d">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* CATEGORIES */
function Categories({ onPick }) {
  const { IArrow } = window.Icons;
  return (
    <section id="oferta" className="sec">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Oferta</span>
          <h2 className="h-sec">Pięć kategorii,<br/>jeden dostawca.</h2>
        </div>
        <div className="cat-grid">
          {window.CATEGORIES.map((c,i)=>(
            <a href="#baza" key={c.id} onClick={()=>onPick && onPick(c.id)}
               className="cat-card reveal" style={{ transitionDelay:(i*60)+'ms' }}>
              <span className="cat-ic"><Icon name={c.icon} size={40}/></span>
              <div className="cat-body">
                <h3 className="cat-t">{c.label}</h3>
                <p className="cat-d">{c.blurb}</p>
              </div>
              <span className="cat-go"><IArrow s={20}/></span>
            </a>
          ))}
          <a href="#baza" onClick={()=>onPick && onPick('all')} className="cat-card cat-card-all reveal">
            <div>
              <h3 className="cat-t" style={{ color:'#fff' }}>Cała baza produktów</h3>
              <p className="cat-d" style={{ color:'rgba(255,255,255,.7)' }}>Przeszukaj i filtruj pełny katalog.</p>
            </div>
            <span className="btn btn-flame" style={{ alignSelf:'flex-start' }}>Otwórz bazę <IArrow/></span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* CONTACT */
function Contact() {
  const { IPhone, IMail, IPin, ICheck, IArrow } = window.Icons;
  const [sent, setSent] = useS2(false);
  return (
    <section id="kontakt" className="sec sec-contact">
      <div className="wrap contact-grid">
        <div className="reveal">
          <span className="eyebrow">Kontakt</span>
          <h2 className="h-sec">Zostań partnerem<br/>Langer Dystrybucja.</h2>
          <p className="lead" style={{ maxWidth:440, marginTop:16 }}>
            Zostaw dane — handlowiec odezwie się w ciągu jednego dnia roboczego z ofertą i cennikiem hurtowym.
          </p>
          <ul className="contact-list">
            <li><span className="ci"><IPhone/></span><div><div className="ci-k">Telefon</div><a href="tel:+48000000000" className="ci-v num">+48 000 000 000</a></div></li>
            <li><span className="ci"><IMail/></span><div><div className="ci-k">E-mail</div><a href="mailto:biuro@langerdystrybucja.pl" className="ci-v">biuro@langerdystrybucja.pl</a></div></li>
            <li><span className="ci"><IPin/></span><div><div className="ci-k">Magazyn i biuro</div><div className="ci-v">ul. Przykładowa 00, 00-000 Miasto</div></div></li>
          </ul>
        </div>
        <div className="reveal">
          {sent ? (
            <div className="form-done">
              <span className="form-done-ic"><ICheck s={32}/></span>
              <h3 className="why-t" style={{ fontSize:24 }}>Dziękujemy!</h3>
              <p className="why-d">Odezwiemy się w ciągu jednego dnia roboczego.</p>
              <button className="btn btn-ghost" onClick={()=>setSent(false)} style={{ marginTop:12 }}>Wyślij kolejne</button>
            </div>
          ) : (
            <form className="form" onSubmit={e=>{e.preventDefault(); setSent(true);}}>
              <div className="form-row">
                <label className="field"><span>Firma</span><input required placeholder="Nazwa firmy"/></label>
                <label className="field"><span>NIP</span><input placeholder="000-000-00-00" inputMode="numeric"/></label>
              </div>
              <div className="form-row">
                <label className="field"><span>Osoba kontaktowa</span><input required placeholder="Imię i nazwisko"/></label>
                <label className="field"><span>Telefon</span><input required placeholder="+48 000 000 000" inputMode="tel"/></label>
              </div>
              <label className="field"><span>E-mail</span><input required type="email" placeholder="firma@email.pl"/></label>
              <label className="field"><span>Wiadomość</span><textarea rows="3" placeholder="Czego potrzebujesz? Jaki asortyment Cię interesuje?"></textarea></label>
              <button className="btn btn-flame" type="submit" style={{ width:'100%' }}>Wyślij zapytanie <IArrow/></button>
              <p className="form-note">Wysyłając formularz akceptujesz kontakt handlowy. To wersja demonstracyjna — dane nie są zapisywane.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div className="footer-brand">
          <LangerLogo onDark size={42}/>
          <p className="footer-tag">Hurtowa dystrybucja chemii budowlanej. Piany, silikony, akryle, kleje i akcesoria dla handlu i ekip wykonawczych.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-h">Nawigacja</div>
            <a href="#proces">Proces</a><a href="#oferta">Oferta</a><a href="#baza">Baza produktów</a><a href="#dlaczego">Dlaczego my</a><a href="#kontakt">Kontakt</a>
          </div>
          <div className="footer-col">
            <div className="footer-h">Oferta</div>
            {window.CATEGORIES.map(c=><a key={c.id} href="#baza">{c.label}</a>)}
          </div>
          <div className="footer-col">
            <div className="footer-h">Kontakt</div>
            <a href="tel:+48000000000" className="num">+48 000 000 000</a>
            <a href="mailto:biuro@langerdystrybucja.pl">biuro@langerdystrybucja.pl</a>
            <span style={{ color:'rgba(255,255,255,.5)' }}>ul. Przykładowa 00<br/>00-000 Miasto</span>
          </div>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Langer Dystrybucja</span>
        <span>Strona demonstracyjna · kolory i dane do uzupełnienia</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Hero, Marquee, WhyUs, Process, Categories, Contact, Footer });
