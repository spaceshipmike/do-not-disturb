// Variant 2 — THE FOLIO
// Editorial / magazine treatment. Pure white, oversized display serif paired
// with a tight modern sans, generous whitespace, numerical indexing used as
// a graphic device. Curated rather than exhaustive — shows the hanger
// pieces big, with the full set summarized as an index strip.

function FolioGallery({ width = 1440 }) {
  const folioStyles = {
    root: {
      width,
      background: '#ffffff',
      color: '#0a0a0a',
      fontFamily: '"Geist", "Inter Tight", system-ui, sans-serif',
      padding: '96px 96px 120px',
      boxSizing: 'border-box',
    },
    masthead: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      paddingBottom: 24,
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
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'end',
      marginTop: 72,
      marginBottom: 96,
    },
    bigTitle: {
      fontFamily: '"Instrument Serif", "EB Garamond", serif',
      fontSize: 220,
      lineHeight: 0.88,
      letterSpacing: '-0.04em',
      margin: 0,
      fontWeight: 400,
    },
    bigTitleItalic: {
      fontStyle: 'italic',
    },
    rightCol: {
      paddingBottom: 16,
    },
    issueLine: {
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#888',
      marginBottom: 20,
      fontWeight: 500,
    },
    lede: {
      fontFamily: '"Instrument Serif", serif',
      fontSize: 28,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      margin: 0,
      color: '#1a1a1a',
      maxWidth: 460,
    },
    statBar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 32,
      padding: '32px 0',
      borderTop: '1px solid #e8e8e8',
      borderBottom: '1px solid #e8e8e8',
      marginBottom: 96,
    },
    statNum: {
      fontFamily: '"Instrument Serif", serif',
      fontSize: 56,
      lineHeight: 0.9,
      letterSpacing: '-0.03em',
      fontWeight: 400,
    },
    statLabel: {
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#666',
      marginTop: 10,
      fontWeight: 500,
    },
    sectionLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 56,
    },
    sectionH: {
      fontFamily: '"Instrument Serif", serif',
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
      marginBottom: 112,
    },
    featureCard: {
      display: 'flex',
      flexDirection: 'column',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    cardIndex: {
      fontFamily: '"Instrument Serif", serif',
      fontSize: 88,
      lineHeight: 0.85,
      letterSpacing: '-0.04em',
      color: '#0a0a0a',
    },
    cardIndexFaded: {
      color: '#e5e5e5',
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
    },
    plateInner: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8%',
      boxSizing: 'border-box',
    },
    img: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      display: 'block',
    },
    plateEmpty: {
      width: '100%',
      aspectRatio: '1 / 1',
      background: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#d0d0d0',
      fontFamily: '"Instrument Serif", serif',
      fontSize: 80,
      letterSpacing: '-0.04em',
    },
    indexHead: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginTop: 24,
      marginBottom: 40,
      borderTop: '1px solid #0a0a0a',
      paddingTop: 24,
    },
    indexGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(11, 1fr)',
      gap: '24px 8px',
    },
    indexCell: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 8,
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
    },
    indexThumbEmpty: {
      background: '#fafafa',
    },
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
      fontSize: 9,
      letterSpacing: '0.22em',
      color: '#888',
      fontFamily: '"Geist Mono", "JetBrains Mono", monospace',
    },
    footer: {
      marginTop: 120,
      paddingTop: 32,
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

  // Feature the 3 real scans up top; everything else lives in the index strip.
  const features = window.HANGERS.filter(h => h.real);
  const all = window.HANGERS;

  return (
    <div style={folioStyles.root}>
      <div style={folioStyles.masthead}>
        <span>The Door-Hanger Folio</span>
        <div style={folioStyles.mastheadRight}>
          <span>Vol. I</span>
          <span>2026</span>
          <span>Private edition</span>
        </div>
      </div>

      <div style={folioStyles.headerWrap}>
        <h1 style={folioStyles.bigTitle}>
          Do not<br/>
          <span style={folioStyles.bigTitleItalic}>disturb.</span>
        </h1>
        <div style={folioStyles.rightCol}>
          <div style={folioStyles.issueLine}>An Introduction</div>
          <p style={folioStyles.lede}>
            Fifty-five hotel door hangers, lifted quietly from knobs across four decades of foreign service. Each one a small advertisement for sleep, in whatever language the morning happened to speak.
          </p>
        </div>
      </div>

      <div style={folioStyles.statBar}>
        <div>
          <div style={folioStyles.statNum}>55</div>
          <div style={folioStyles.statLabel}>Specimens</div>
        </div>
        <div>
          <div style={folioStyles.statNum}>110</div>
          <div style={folioStyles.statLabel}>Faces, front &amp; back</div>
        </div>
        <div>
          <div style={folioStyles.statNum}>03</div>
          <div style={folioStyles.statLabel}>Scanned to date</div>
        </div>
        <div>
          <div style={folioStyles.statNum}>52</div>
          <div style={folioStyles.statLabel}>Awaiting the scanner</div>
        </div>
      </div>

      <div style={folioStyles.sectionLabel}>
        <h2 style={folioStyles.sectionH}>Featured plates</h2>
        <span style={folioStyles.sectionMeta}>003 of 055 scanned</span>
      </div>

      <div style={folioStyles.featureGrid}>
        {features.map(h => (
          <div key={h.id} style={folioStyles.featureCard}>
            <div style={folioStyles.cardHeader}>
              <div style={folioStyles.cardIndex}>{h.num}</div>
              <div style={folioStyles.cardSlash}>/ 055</div>
            </div>
            <div style={folioStyles.plate}>
              <div style={folioStyles.plateInner}>
                <img src={h.src} alt={`Hanger ${h.num}`} style={folioStyles.img} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={folioStyles.sectionLabel}>
        <h2 style={folioStyles.sectionH}>The full register</h2>
        <span style={folioStyles.sectionMeta}>001 — 055</span>
      </div>

      <div style={folioStyles.indexGrid}>
        {all.map(h => (
          <div key={h.id} style={folioStyles.indexCell}>
            <div style={{...folioStyles.indexThumb, ...(h.real ? {} : folioStyles.indexThumbEmpty)}}>
              {h.real && (
                <div style={folioStyles.indexThumbInner}>
                  <img src={h.src} alt="" style={folioStyles.img} />
                </div>
              )}
            </div>
            <div style={folioStyles.indexNum}>{h.num}</div>
          </div>
        ))}
      </div>

      <div style={folioStyles.footer}>
        <span>The Door-Hanger Folio · Vol. I</span>
        <span>End of volume</span>
      </div>
    </div>
  );
}

window.FolioGallery = FolioGallery;
