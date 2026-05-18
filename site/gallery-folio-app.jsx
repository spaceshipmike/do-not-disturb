// The Folio — interactive gallery + detail overlay.
// Wraps the chosen direction (B) into a real artifact: clickable plates,
// fullscreen detail view, keyboard nav, pending plates included in the walk.

const { useState, useEffect, useCallback, useRef } = React;

// ---------------------------------------------------------------------------
// shared styles — kept close so the file reads top-to-bottom

const folioFont = '"Geist", "Inter Tight", system-ui, -apple-system, sans-serif';
const folioSerif = '"Instrument Serif", "EB Garamond", Georgia, serif';

// ---------------------------------------------------------------------------
// FolioGallery — the page itself. Stat bar removed per direction.

function FolioGallery({ onOpen }) {
  const all = window.HANGERS;
  // Curated featured trio (edit FEATURED_IDS in gallery-data.jsx to change).
  const featured = window.FEATURED_IDS
    .map(id => all.find(h => h.id === id))
    .filter(Boolean);

  const s = {
    root: {
      background: '#ffffff',
      color: '#0a0a0a',
      fontFamily: folioFont,
      padding: '72px 96px 96px',
      boxSizing: 'border-box',
      maxWidth: 1600,
      margin: '0 auto',
    },
    masthead: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingBottom: 20,
      borderBottom: '1px solid #0a0a0a',
      fontSize: 12,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 500,
    },
    mastheadRight: {
      display: 'flex',
      gap: 32,
      color: '#666',
    },
    headerWrap: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 64,
      alignItems: 'end',
      marginTop: 80,
      marginBottom: 144,
    },
    bigTitle: {
      fontFamily: folioSerif,
      fontSize: 220,
      lineHeight: 0.86,
      letterSpacing: '-0.04em',
      margin: 0,
      fontWeight: 400,
    },
    bigTitleItalic: { fontStyle: 'italic' },
    rightCol: { paddingBottom: 18 },
    issueLine: {
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#888',
      marginBottom: 22,
      fontWeight: 500,
    },
    lede: {
      fontFamily: folioSerif,
      fontSize: 28,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      margin: 0,
      color: '#1a1a1a',
      maxWidth: 480,
    },
    sectionLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 56,
      paddingBottom: 18,
      borderBottom: '1px solid #e5e5e5',
    },
    sectionH: {
      fontFamily: folioSerif,
      fontSize: 40,
      letterSpacing: '-0.02em',
      margin: 0,
      fontWeight: 400,
    },
    sectionMeta: {
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#666',
      fontWeight: 500,
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '80px 48px',
      marginBottom: 128,
    },
    featureCard: {
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      padding: 0,
      textAlign: 'left',
      font: 'inherit',
      color: 'inherit',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    cardIndex: {
      fontFamily: folioSerif,
      fontSize: 88,
      lineHeight: 0.85,
      letterSpacing: '-0.04em',
      color: '#0a0a0a',
      transition: 'color .25s ease',
    },
    cardSlash: {
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#888',
      paddingBottom: 8,
      fontWeight: 500,
    },
    plate: {
      width: '100%',
      aspectRatio: '1 / 1',
      background: '#f7f6f3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      transition: 'background .25s ease',
    },
    plateInner: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8%',
      boxSizing: 'border-box',
      transition: 'transform .35s cubic-bezier(.2,.7,.3,1)',
    },
    img: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      display: 'block',
    },
    indexGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(11, 1fr)',
      gap: '32px 12px',
    },
    indexCell: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 10,
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      padding: 0,
      textAlign: 'left',
      font: 'inherit',
      color: 'inherit',
    },
    indexThumb: {
      width: '100%',
      aspectRatio: '1 / 1',
      background: '#f7f6f3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      transition: 'background .2s ease',
    },
    indexThumbEmpty: { background: '#fafafa' },
    indexThumbInner: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8%',
      boxSizing: 'border-box',
    },
    indexNum: {
      fontSize: 10,
      letterSpacing: '0.22em',
      color: '#888',
      fontFamily: '"Geist Mono", "JetBrains Mono", monospace',
    },
    pendingBig: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#dadada',
      fontFamily: folioSerif,
      fontSize: 80,
      letterSpacing: '-0.04em',
      lineHeight: 1,
    },
    footer: {
      marginTop: 144,
      paddingTop: 28,
      borderTop: '1px solid #0a0a0a',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#666',
      fontWeight: 500,
    },
  };

  const featuredCount = featured.length;

  return (
    <div style={s.root}>
      <div style={s.masthead}>
        <span>Hotel Door Hanger Collection</span>
      </div>

      <div style={s.headerWrap}>
        <h1 style={s.bigTitle}>
          Do not<br/>
          <span style={s.bigTitleItalic}>disturb.</span>
        </h1>
        <div style={s.rightCol}>
          <div style={s.issueLine}>Introduction</div>
          <p style={s.lede}>
            Fifty-five hotel door hangers, lifted quietly from knobs across four decades of foreign service. Each one a small advertisement for sleep, in whatever language the morning happened to speak.
          </p>
        </div>
      </div>

      <div style={s.sectionLabel}>
        <h2 style={s.sectionH}>Featured</h2>
        <span style={s.sectionMeta}>{String(featuredCount).padStart(3,'0')} / 055</span>
      </div>

      <div style={s.featureGrid}>
        {featured.map(h => (
          <FeatureCard key={h.id} hanger={h} onOpen={onOpen} styles={s} />
        ))}
      </div>

      <div style={s.sectionLabel}>
        <h2 style={s.sectionH}>The full register</h2>
        <span style={s.sectionMeta}>001 — 055</span>
      </div>

      <div style={s.indexGrid}>
        {all.map(h => (
          <IndexCell key={h.id} hanger={h} onOpen={onOpen} styles={s} />
        ))}
      </div>

      <div style={s.footer}>
        <span>Hotel Door Hanger Collection</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FeatureCard — large clickable plate with hover lift.

function FeatureCard({ hanger, onOpen, styles }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={styles.featureCard}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(hanger.id)}
      aria-label={`Open plate ${hanger.num}`}
    >
      <div style={styles.cardHeader}>
        <div style={{...styles.cardIndex, color: hover ? '#c0392b' : '#0a0a0a'}}>{hanger.num}</div>
        <div style={styles.cardSlash}>/ 055</div>
      </div>
      <div style={{...styles.plate, background: hover ? '#f0eee9' : '#f7f6f3'}}>
        <div style={{...styles.plateInner, transform: hover ? 'scale(1.02)' : 'scale(1)'}}>
          <img src={hanger.src} alt={`Hanger ${hanger.num}`} style={styles.img} />
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// IndexCell — small thumb in the full register, clickable.

function IndexCell({ hanger, onOpen, styles }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={styles.indexCell}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(hanger.id)}
      aria-label={`Open plate ${hanger.num}`}
    >
      <div
        style={{
          ...styles.indexThumb,
          background: hover ? '#efece4' : '#f7f6f3',
        }}
      >
        <div style={styles.indexThumbInner}>
          <img src={hanger.src} alt="" style={styles.img} />
        </div>
      </div>
      <div style={{...styles.indexNum, color: hover ? '#0a0a0a' : '#888'}}>{hanger.num}</div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// DetailOverlay — fullscreen viewer. Walks through all 55 in order.

function DetailOverlay({ openId, onClose, onPrev, onNext }) {
  const hanger = openId == null ? null : window.HANGERS.find(h => h.id === openId);
  const prevId = openId == null ? null : Math.max(1, openId - 1);
  const nextId = openId == null ? null : Math.min(55, openId + 1);
  const atStart = openId === 1;
  const atEnd = openId === 55;

  useEffect(() => {
    if (openId == null) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [openId]);

  if (!hanger) return null;

  const ds = {
    root: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(255,255,255,0.985)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: folioFont,
      color: '#0a0a0a',
      animation: 'folioFadeIn .35s ease',
    },
    topBar: {
      padding: '28px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #ececec',
      flex: '0 0 auto',
    },
    topLeft: {
      fontSize: 12,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#666',
      fontWeight: 500,
    },
    topCenter: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      fontFamily: folioSerif,
      fontSize: 22,
      letterSpacing: '-0.01em',
    },
    topRight: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
    },
    closeBtn: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: '1px solid #ddd',
      background: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 18,
      color: '#0a0a0a',
      fontFamily: folioSerif,
      transition: 'background .15s, border-color .15s',
    },
    body: {
      flex: '1 1 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '32px 80px',
      minHeight: 0,
    },
    stage: {
      maxWidth: '70vw',
      maxHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    stageImg: {
      maxWidth: '100%',
      maxHeight: '100%',
      width: 'auto',
      height: 'auto',
      objectFit: 'contain',
      display: 'block',
      filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.08))',
    },
    pending: {
      width: 'min(60vw, 720px)',
      aspectRatio: '1 / 1',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
    },
    pendingNum: {
      fontFamily: folioSerif,
      fontSize: 280,
      lineHeight: 0.8,
      letterSpacing: '-0.04em',
      color: '#e2e2e2',
    },
    pendingLabel: {
      fontSize: 11,
      letterSpacing: '0.32em',
      textTransform: 'uppercase',
      color: '#aaa',
      fontWeight: 500,
    },
    navBtn: (side) => ({
      position: 'absolute',
      top: '50%',
      [side]: 24,
      transform: 'translateY(-50%)',
      width: 56,
      height: 56,
      borderRadius: '50%',
      border: '1px solid #e5e5e5',
      background: 'rgba(255,255,255,0.9)',
      cursor: 'pointer',
      fontFamily: folioSerif,
      fontSize: 32,
      lineHeight: 1,
      color: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s, border-color .15s, transform .15s',
    }),
    navBtnDisabled: {
      opacity: 0.25,
      cursor: 'default',
      pointerEvents: 'none',
    },
    bottomBar: {
      padding: '20px 48px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #ececec',
      flex: '0 0 auto',
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#888',
      fontWeight: 500,
    },
    bottomCenter: {
      fontFamily: folioSerif,
      fontStyle: 'italic',
      fontSize: 14,
      textTransform: 'none',
      letterSpacing: '0',
      color: '#666',
    },
    progress: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
  };

  return (
    <div style={ds.root} role="dialog" aria-modal="true" onClick={onClose}>
      <div style={ds.topBar} onClick={e => e.stopPropagation()}>
        <span style={ds.topLeft}>Hotel Door Hanger Collection</span>
        <span style={ds.topCenter}>
          Plate № {hanger.num}
          <span style={{color: '#aaa', fontStyle: 'italic'}}> &nbsp;/ 055</span>
        </span>
        <div style={ds.topRight}>
          <button style={ds.closeBtn} onClick={onClose} aria-label="Close">×</button>
        </div>
      </div>

      <div style={ds.body} onClick={e => e.stopPropagation()}>
        <button
          style={{...ds.navBtn('left'), ...(atStart ? ds.navBtnDisabled : {})}}
          onClick={onPrev}
          aria-label="Previous plate"
        >‹</button>

        <div style={ds.stage}>
          <img src={hanger.src} alt={`Hanger ${hanger.num}`} style={ds.stageImg} />
        </div>

        <button
          style={{...ds.navBtn('right'), ...(atEnd ? ds.navBtnDisabled : {})}}
          onClick={onNext}
          aria-label="Next plate"
        >›</button>
      </div>

      <div style={ds.bottomBar} onClick={e => e.stopPropagation()}>
        <span>Specimen</span>
        <span style={ds.bottomCenter}>
          Front &amp; verso, as collected
        </span>
        <span style={ds.progress}>
          <span>{String(hanger.id).padStart(3,'0')} / 055</span>
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App — composition root.

function App() {
  const [openId, setOpenId] = useState(null);

  const onPrev = useCallback(() => setOpenId(id => id == null ? id : Math.max(1, id - 1)), []);
  const onNext = useCallback(() => setOpenId(id => id == null ? id : Math.min(55, id + 1)), []);
  const onClose = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    function onKey(e) {
      if (openId == null) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, onPrev, onNext, onClose]);

  return (
    <React.Fragment>
      <FolioGallery onOpen={setOpenId} />
      <DetailOverlay openId={openId} onClose={onClose} onPrev={onPrev} onNext={onNext} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
