// app.jsx — assembles the page + Tweaks (hero variant, accent color).
const { useState: useSA, useEffect: useEA, useRef: useRA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "Granat",
  "accent": "#F04E23",
  "marquee": true
}/*EDITMODE-END*/;

const HERO_KEY = { 'Granat': 'navy', 'Split': 'split', 'Plakat': 'poster' };

function useReveal() {
  useEA(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const catRef = useRA(null);

  // apply accent color
  useEA(() => {
    const r = document.documentElement;
    r.style.setProperty('--flame', t.accent);
    r.style.setProperty('--flame-glow', t.accent);
  }, [t.accent]);

  useReveal();

  const pickCat = (c) => {
    if (catRef.current) catRef.current(c);
    requestAnimationFrame(() => {
      const el = document.getElementById('baza');
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
    });
  };

  return (
    <React.Fragment>
      <Header />
      <Hero variant={HERO_KEY[t.hero] || 'navy'} />
      {t.marquee && <Marquee />}
      <WhyUs />
      <Process />
      <Categories onPick={pickCat} />
      <ProductDatabase initialCatRef={catRef} />
      <Contact />
      <Footer />

      <TweaksPanel>
        <TweakSection label="Strona główna (hero)" />
        <TweakRadio label="Wariant hero" value={t.hero}
          options={['Granat', 'Split', 'Plakat']}
          onChange={(v) => setTweak('hero', v)} />
        <TweakColor label="Kolor akcentu" value={t.accent}
          options={['#F04E23', '#E5421A', '#1E3FB5', '#0E1533']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakToggle label="Pasek marek (marquee)" value={t.marquee}
          onChange={(v) => setTweak('marquee', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
