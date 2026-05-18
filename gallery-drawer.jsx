// Variant 3 — THE DRAWER
// Scrapbook / archive-box treatment. Warm kraft-paper field, hangers laid
// out as if pinned to a board — slight per-card rotation, stamped catalogue
// numbers, typewriter captions. Vintage without going kitsch.

function DrawerGallery({ width = 1440 }) {
  // Deterministic per-id "scatter" so the layout is stable across renders.
  const wobble = (id) => {
    const r = ((id * 9301 + 49297) % 233280) / 233280;
    return (r - 0.5) * 2; // -1..1
  };

  const drawerStyles = {
    root: {
      width,
      color: '#2b1f12',
      fontFamily: '"Special Elite", "Courier Prime", "Courier New", monospace',
      padding: '88px 80px 120px',
      boxSizing: 'border-box',
      background:
        'radial-gradient(ellipse at 20% 10%, #e8d8b4 0%, #d9c5a0 45%, #c9b384 100%)',
      position: 'relative',
      overflow: 'hidden',
    },
    grain: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      opacity: 0.35,
      backgroundImage:
        'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/><feColorMatrix values=%220 0 0 0 0.25 0 0 0 0 0.18 0 0 0 0 0.1 0 0 0 0.5 0%22/></filter><rect width=%22240%22 height=%22240%22 filter=%22url(%23n)%22/></svg>")',
      mixBlendMode: 'multiply',
    },
    header: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'end',
      gap: 64,
      marginBottom: 80,
      paddingBottom: 32,
      borderBottom: '2px solid #5a3e22',
    },
    stampRow: {
      display: 'flex',
      gap: 12,
      marginBottom: 28,
      alignItems: 'center',
    },
    stamp: {
      display: 'inline-block',
      padding: '6px 14px',
      border: '2px solid #8b2f1f',
      color: '#8b2f1f',
      fontFamily: '"Special Elite", monospace',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      transform: 'rotate(-2deg)',
      background: 'rgba(139,47,31,0.04)',
    },
    stampSmall: {
      fontSize: 10,
      letterSpacing: '0.2em',
      color: '#5a3e22',
      textTransform: 'uppercase',
    },
    title: {
      fontFamily: '"Special Elite", "Courier Prime", monospace',
      fontSize: 92,
      lineHeight: 0.95,
      margin: 0,
      letterSpacing: '-0.01em',
      color: '#2b1f12',
      textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
    },
    titleSmall: {
      display: 'block',
      fontSize: 28,
      letterSpacing: '0.04em',
      marginTop: 8,
      color: '#5a3e22',
    },
    rightLabel: {
      fontFamily: '"Special Elite", monospace',
      fontSize: 12,
      letterSpacing: '0.12em',
      color: '#5a3e22',
      lineHeight: 1.8,
      textAlign: 'right',
      maxWidth: 280,
    },
    rightLabelHead: {
      display: 'block',
      borderBottom: '1px solid #5a3e22',
      paddingBottom: 6,
      marginBottom: 8,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
    },
    grid: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '64px 40px',
    },
    cardWrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    paper: {
      width: '100%',
      aspectRatio: '1 / 1.05',
      background: '#f4ead2',
      backgroundImage:
        'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.5), transparent 60%),' +
        'radial-gradient(ellipse at 80% 90%, rgba(120,80,40,0.18), transparent 55%)',
      boxShadow:
        '0 1px 0 rgba(255,255,255,0.4) inset,' +
        '0 14px 28px -10px rgba(60,40,20,0.45),' +
        '0 4px 8px -4px rgba(60,40,20,0.25)',
      padding: '14px 14px 10px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    paperEmpty: {
      background:
        'repeating-linear-gradient(45deg, #e8dcb6 0px, #e8dcb6 8px, #e2d3a8 8px, #e2d3a8 16px)',
    },
    pin: {
      position: 'absolute',
      top: -8,
      left: '50%',
      width: 12,
      height: 12,
      borderRadius: '50%',
      background:
        'radial-gradient(circle at 35% 35%, #ffb3a0 0%, #c0392b 55%, #6b1a10 100%)',
      transform: 'translateX(-50%)',
      boxShadow: '0 2px 3px rgba(0,0,0,0.4)',
      zIndex: 2,
    },
    imgWrap: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
    },
    img: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      display: 'block',
      mixBlendMode: 'multiply',
    },
    emptyMark: {
      fontFamily: '"Special Elite", monospace',
      fontSize: 14,
      color: 'rgba(90,62,34,0.5)',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
    },
    caption: {
      marginTop: 8,
      paddingTop: 6,
      borderTop: '1px dashed rgba(90,62,34,0.35)',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: '"Special Elite", monospace',
      fontSize: 11,
      letterSpacing: '0.12em',
      color: '#5a3e22',
      textTransform: 'uppercase',
    },
    captionStamp: {
      color: '#8b2f1f',
      border: '1px solid #8b2f1f',
      padding: '0 6px',
      borderRadius: 2,
    },
    footer: {
      position: 'relative',
      marginTop: 96,
      paddingTop: 24,
      borderTop: '2px solid #5a3e22',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: '"Special Elite", monospace',
      fontSize: 12,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#5a3e22',
    },
  };

  return (
    <div style={drawerStyles.root}>
      <div style={drawerStyles.grain}></div>

      <div style={drawerStyles.header}>
        <div>
          <div style={drawerStyles.stampRow}>
            <span style={drawerStyles.stamp}>Private collection</span>
            <span style={drawerStyles.stampSmall}>· Catalogue I ·</span>
          </div>
          <h1 style={drawerStyles.title}>
            DOOR HANGERS
            <span style={drawerStyles.titleSmall}>fifty-five souvenirs from the road</span>
          </h1>
        </div>
        <div style={drawerStyles.rightLabel}>
          <span style={drawerStyles.rightLabelHead}>Property of</span>
          a foreign-service officer,<br/>
          collected hotel by hotel,<br/>
          drawer by drawer.<br/>
          Returned at last to the light.
        </div>
      </div>

      <div style={drawerStyles.grid}>
        {window.HANGERS.map(h => {
          const rot = wobble(h.id) * 1.8;
          const ty = wobble(h.id + 100) * 6;
          return (
            <div
              key={h.id}
              style={{
                ...drawerStyles.cardWrap,
                transform: `rotate(${rot}deg) translateY(${ty}px)`,
              }}
            >
              <div style={{...drawerStyles.paper, ...(h.real ? {} : drawerStyles.paperEmpty)}}>
                <div style={drawerStyles.pin}></div>
                <div style={drawerStyles.imgWrap}>
                  {h.real ? (
                    <img src={h.src} alt={`Hanger ${h.num}`} style={drawerStyles.img} />
                  ) : (
                    <span style={drawerStyles.emptyMark}>to&nbsp;scan</span>
                  )}
                </div>
                <div style={drawerStyles.caption}>
                  <span>Nº&nbsp;{h.num}</span>
                  <span style={drawerStyles.captionStamp}>{h.real ? 'archived' : 'pending'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={drawerStyles.footer}>
        <span>Drawer one · plates 001–055</span>
        <span>Compiled with care · 2026</span>
      </div>
    </div>
  );
}

window.DrawerGallery = DrawerGallery;
