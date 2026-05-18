// Hotel Door Hanger Collection — data.
// All 55 plates scanned. The Featured trio is reshuffled on every page load:
// three distinct plate IDs picked at random from 001–055.

function pickFeaturedIds(n, total) {
  const pool = Array.from({ length: total }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

const FEATURED_IDS = pickFeaturedIds(3, 55);

const HANGERS = Array.from({ length: 55 }, (_, i) => {
  const id = i + 1;
  const num = String(id).padStart(3, '0');
  return {
    id,
    num,
    src: `assets/hanger_${String(id).padStart(4, '0')}.jpg`,
    featured: FEATURED_IDS.includes(id),
    real: true, // kept for any legacy consumer
  };
});

window.HANGERS = HANGERS;
window.FEATURED_IDS = FEATURED_IDS;
