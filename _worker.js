// _worker.js — Cloudflare Pages advanced mode (works with drag-and-drop Direct Upload).
// Adds server-rendered per-listing SEO/share pages at /watch/<id> and a live /sitemap.xml,
// while serving the existing SPA + all static assets completely unchanged.

const SUPA = 'https://udfpwakssijojlsuvqjm.supabase.co';
const ANON = 'sb_publishable_pheGlJPG-oM5oPJqQAI1kQ_gYX7lnc_'; // publishable key (safe, RLS-protected)
const SITE = 'https://aurexmovement.com';
const OG_DEFAULT = SITE + '/og-image.png';

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function money(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function jsonLd(obj){ return JSON.stringify(obj).replace(/</g, '\\u003c'); }

async function fetchListing(id){
  const u = `${SUPA}/rest/v1/listings?id=eq.${encodeURIComponent(id)}&select=id,title,brand,model,ref_number,year,price,city,condition,images,status,description&limit=1`;
  try {
    const r = await fetch(u, { headers: { apikey: ANON, Authorization: 'Bearer ' + ANON } });
    if(!r.ok) return null;
    const rows = await r.json();
    return (rows && rows[0]) || null;
  } catch(e){ return null; }
}

function buildSeo(l){
  const name = (l.title && l.title.trim()) || [l.brand, l.model].filter(Boolean).join(' ');
  const priceTxt = l.price ? money(l.price) + ' AED' : 'Price on request';
  const title = `${name}${l.ref_number ? ' Ref. ' + l.ref_number : ''} | Aurex Movement`;
  const desc = `${[l.brand, l.model].filter(Boolean).join(' ')}${l.year ? ', ' + l.year : ''}${l.condition ? ', ' + l.condition : ''} for sale in ${l.city || 'UAE'}. ${priceTxt}. Authentic luxury watches — Aurex Movement, UAE & GCC.`;
  const img = (Array.isArray(l.images) && l.images[0]) ? l.images[0] : OG_DEFAULT;
  const wurl = `${SITE}/watch/${l.id}`;
  const ogTitle = `${name} — ${priceTxt}`;
  const block = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<meta name="robots" content="${l.status === 'sold' ? 'noindex, follow' : 'index, follow'}">`,
    `<link rel="canonical" href="${esc(wurl)}">`,
    `<meta property="og:type" content="product">`,
    `<meta property="og:title" content="${esc(ogTitle)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${esc(wurl)}">`,
    `<meta property="og:site_name" content="Aurex Movement">`,
    `<meta property="og:image" content="${esc(img)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(ogTitle)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${esc(img)}">`,
  ].join('\n');
  const ld = jsonLd({
    '@context': 'https://schema.org', '@type': 'Product',
    name, image: [img], description: desc,
    brand: { '@type': 'Brand', name: l.brand || 'Aurex Movement' },
    sku: l.ref_number || l.id,
    offers: {
      '@type': 'Offer', priceCurrency: 'AED',
      price: l.price ? String(l.price) : undefined,
      availability: l.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      url: wurl,
    },
  });
  return { block, ld };
}

async function renderWatch(id, env, url){
  const shell = await env.ASSETS.fetch(new Request(new URL('/index.html', url)));
  let html = await shell.text();
  const l = await fetchListing(id);
  if(l){
    const { block, ld } = buildSeo(l);
    html = html.replace(/<!--SEO:START-->[\s\S]*?<!--SEO:END-->/, block);
    html = html.replace('</head>', `<script type="application/ld+json">${ld}</script>\n</head>`);
  }
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}

async function renderSitemap(){
  const urls = [`${SITE}/`, `${SITE}/terms`, `${SITE}/privacy`];
  try {
    const r = await fetch(`${SUPA}/rest/v1/listings?status=eq.available&select=id&order=created_at.desc&limit=1000`, { headers: { apikey: ANON, Authorization: 'Bearer ' + ANON } });
    if(r.ok){ (await r.json()).forEach(x => urls.push(`${SITE}/watch/${x.id}`)); }
  } catch(e){}
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}

export default {
  async fetch(request, env){
    const url = new URL(request.url);
    const m = url.pathname.match(/^\/watch\/([^\/]+)\/?$/);
    if(m) return renderWatch(m[1], env, url);
    if(url.pathname === '/sitemap.xml') return renderSitemap();
    return env.ASSETS.fetch(request);
  },
};
