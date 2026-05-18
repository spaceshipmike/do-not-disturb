// Variant 1 — THE ARCHIVE
// Museum / catalogue treatment. Cream paper, serif, dense 5-col grid,
// every specimen numbered like an accession entry.

function ArchiveGallery({ width = 1440 }) {
  const archiveStyles = {
    root: {
      width,
      background: '#efe7d8',
      backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 60%)',
      color: '#241a10',
      fontFamily: '"EB Garamond", "Garamond", serif',
      padding: '88px 80px 120px',
      boxSizing: 'border-box',
    },
    eyebrow: {
      fontFamily: '"Inter Tight", system-ui, sans-serif',
      fontSize: 11,
      letterSpacing: '0.32em',
      textTransform: 'uppercase',
      color: '#6b553a',
      fontWeight: 500,
      marginBottom: 28,
    },
    title: {
      fontSize: 96,
      fontWeight: 400,
      lineHeight: 1,
      margin: 0,
      letterSpacing: '-0.01em',
      fontStyle: 'italic',
    },
    titleRoman: {
      fontStyle: 'normal',
    },
    rule: {
      width: 64,
      height: 1,
      background: '#7a5d3a',
      margin: '36px auto 32px',
    },
    lede: {
      fontSize: 19,
      lineHeight: 1.55,
      maxWidth: 540,
      margin: '0 auto',
      color: '#4a3a26',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    metaRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: 48,
      marginTop: 56,
      fontFamily: '"Inter Tight", system-ui, sans-serif',
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#6b553a',
    },
    sectionHead: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(60,40,20,0.25)',
      paddingBottom: 14,
      marginTop: 96,
      marginBottom: 48,
    },
    sectionTitle: {
      fontFamily: '"EB Garamond", serif',
      fontSize: 22,
      fontStyle: 'italic',
      color: '#3a2a18',
      margin: 0,
    },
    sectionMeta: {
      fontFamily: '"Inter Tight", sans-serif',
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#6b553a',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '64px 36px',
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    plate: {
      width: '100%',
      aspectRatio: '1 / 1',
      background: '#f7f1e2',
      boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 12px 24px -16px rgba(60,40,20,0.25)',
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
      padding: '6%',
      boxSizing: 'border-box',
    },
    img: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      display: 'block',
      mixBlendMode: 'multiply',
    },
    plateEmpty: {
      width: '100%',
      aspectRatio: '1 / 1',
      background: 'transparent',
      border: '1px dashed rgba(105,80,50,0.28)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(105,80,50,0.45)',
      fontFamily: '"EB Garamond", serif',
      fontStyle: 'italic',
      fontSize: 14,
    },
    cardMeta: {
      marginTop: 14,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      fontFamily: '"Inter Tight", sans-serif',
      fontSize: 10,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: '#6b553a',
    },
    cardNum: {
      fontVariantNumeric: 'tabular-nums',
    },
    cardState: {
      color: 'rgba(107,85,58,0.55)',
    },
    footer: {
      marginTop: 96,
      paddingTop: 32,
      borderTop: '1px solid rgba(60,40,20,0.18)',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: '"Inter Tight", sans-serif',
      fontSize: 11,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#6b553a',
    },
  };

  return (
    <div style={archiveStyles.root}>
      <div style={{ textAlign: 'center' }}>
        <div style={archiveStyles.eyebrow}>A Private Archive · MCMLX–MCMXC</div>
        <h1 style={archiveStyles.title}>
          <span style={archiveStyles.titleRoman}>Door</span> Hangers
        </h1>
        <div style={archiveStyles.rule}></div>
        <p style={archiveStyles.lede}>
          Fifty-five paper specimens, gathered hotel by hotel across a life in the foreign service. Catalogued here as they were collected — by hand, in no particular order.
        </p>
        <div style={archiveStyles.metaRow}>
          <span>55 specimens</span>
          <span>·</span>
          <span>Front &amp; verso</span>
          <span>·</span>
          <span>Catalogued 2026</span>
        </div>
      </div>

      <div style={archiveStyles.sectionHead}>
        <h2 style={archiveStyles.sectionTitle}>The Collection</h2>
        <span style={archiveStyles.sectionMeta}>Plates 001 – 055</span>
      </div>

      <div style={archiveStyles.grid}>
        {window.HANGERS.map(h => (
          <div key={h.id} style={archiveStyles.card}>
            {h.real ? (
              <div style={archiveStyles.plate}>
                <div style={archiveStyles.plateInner}>
                  <img src={h.src} alt={`Hanger № ${h.num}`} style={archiveStyles.img} />
                </div>
              </div>
            ) : (
              <div style={archiveStyles.plateEmpty}>
                <span>vacat</span>
              </div>
            )}
            <div style={archiveStyles.cardMeta}>
              <span style={archiveStyles.cardNum}>№ {h.num}</span>
              <span style={archiveStyles.cardState}>{h.real ? 'Plate' : 'Pending'}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={archiveStyles.footer}>
        <span>Private collection · Not for distribution</span>
        <span>Folio I of I</span>
      </div>
    </div>
  );
}

window.ArchiveGallery = ArchiveGallery;
