// brands.js — brand directory + Chrono24-style brand pages.
// Reads window.BRAND_INFO (profiles) + window.BRAND_MODELS (popular models)
// and the live `listings` array for per-brand counts.

let currentBrandSlug = null;

// Canonical brand list: BRAND_INFO order if available, else the model catalog.
function _allBrands(){
  const info = window.BRAND_INFO || {};
  const models = window.BRAND_MODELS || {};
  return Object.keys(info).length ? Object.keys(info) : Object.keys(models);
}

// Live listings for a brand on Aurex.
function _brandCount(brand){
  if(typeof listings==='undefined' || !Array.isArray(listings)) return 0;
  return listings.filter(l=> l.brand===brand && (typeof isLive==='function' ? isLive(l) : true)).length;
}

// 2-letter country code -> flag emoji ("CH" -> 🇨🇭).
function _flag(cc){
  if(!cc || cc.length!==2) return '';
  const A = 0x1F1E6, c = cc.toUpperCase();
  return String.fromCodePoint(A + (c.charCodeAt(0)-65)) + String.fromCodePoint(A + (c.charCodeAt(1)-65));
}

function _q(s){ return String(s).replace(/'/g, "\\'"); }   // safe for single-quoted onclick args

// Open a brand page.
function openBrand(brand){ currentBrandSlug = brand; showView('brand'); }

// Deep-link a brand + model into filtered Market results.
function filterByBrandModel(brand, model){
  showView('listings');
  setTimeout(()=>{
    const fb=document.getElementById('fBrand'); if(fb) fb.value=brand;
    const gs=document.getElementById('globalSearch'); if(gs) gs.value=model;
    if(typeof filterListings==='function') filterListings();
  },100);
}

// The Brands tab: a directory of every brand we carry.
function renderBrandDirectory(){
  const wrap=document.getElementById('brandGrid'); if(!wrap) return;
  const ar=currentLang==='ar';
  const info=window.BRAND_INFO||{};
  const html = _allBrands().map(b=>{
    const i=info[b]||{};
    const sub = i.city ? `${i.city} · ${i.cc||''}`.trim().replace(/ ·\s*$/,'') : (i.country||'');
    const flag=_flag(i.cc);
    const n=_brandCount(b);
    const cnt = n>0 ? `<span class="brand-card-count">${n}</span>` : '';
    return `<div class="brand-card" onclick="openBrand('${_q(b)}')">
      ${cnt}
      <span class="brand-card-name">${escapeHtml(b)}</span>
      <span class="brand-card-sub">${flag?flag+' ':''}${escapeHtml(sub)}</span>
    </div>`;
  }).join('') + `<div class="brand-card brand-card-all" onclick="filterByBrand('')">
      <span class="brand-card-name">${ar?'كل الساعات':'All Watches'}</span>
      <span class="brand-card-sub">${ar?'تصفّح السوق':'Browse market'}</span>
    </div>`;
  wrap.innerHTML=html;
}

// A single brand page (history, facts, popular models, listing count, media slot).
function renderBrandPage(brand){
  const wrap=document.getElementById('brandPage'); if(!wrap) return;
  if(!brand){ wrap.innerHTML=''; return; }
  const ar=currentLang==='ar';
  const i=(window.BRAND_INFO||{})[brand]||{};
  const models=((window.BRAND_MODELS||{})[brand]||[]).slice(0,12);
  const n=_brandCount(brand);
  const flag=_flag(i.cc);
  const blurb = ar ? (i.blurb_ar||i.blurb_en||'') : (i.blurb_en||'');
  const facts = [
    [ar?'التأسيس':'Founded', i.founded || '—'],
    [ar?'بلد المنشأ':'Country', (flag?flag+' ':'')+(i.country||'—')],
    [ar?'المقر':'Headquarters', i.city||'—'],
    [ar?'المؤسس':'Founder', i.founder||'—'],
    [ar?'الفئة':'Category', i.tier||'—'],
  ];
  const origin = [i.city, i.country].filter(Boolean).join(', ');
  wrap.innerHTML = `
    <div class="brand-page-wrap">
      <a class="brand-back" onclick="goHomePanel('brands')">${ar?'‹ كل الماركات':'‹ All brands'}</a>
      <div class="brand-hero">
        <div class="brand-hero-media" aria-hidden="true"><span class="brand-hero-mono">${escapeHtml(brand.charAt(0))}</span></div>
        <div class="brand-hero-info">
          ${i.tier?`<span class="brand-tier">${escapeHtml(i.tier)}</span>`:''}
          <h1 class="brand-title">${escapeHtml(brand)}</h1>
          <p class="brand-origin">${flag?flag+' ':''}${escapeHtml(origin)}${i.founded?` · ${ar?'منذ':'est.'} ${i.founded}`:''}</p>
        </div>
      </div>
      ${blurb?`<p class="brand-blurb">${escapeHtml(blurb)}</p>`:''}
      <div class="brand-facts">
        ${facts.map(f=>`<div class="brand-fact"><span class="bf-k">${f[0]}</span><span class="bf-v">${escapeHtml(String(f[1]))}</span></div>`).join('')}
      </div>
      ${models.length?`<div class="brand-section-h">${ar?'أبرز الموديلات':'Popular models'}</div>
      <div class="brand-models">${models.map(m=>`<button class="brand-model-chip" onclick="filterByBrandModel('${_q(brand)}','${_q(m)}')">${escapeHtml(m)}</button>`).join('')}</div>`:''}
      <div class="brand-cta-row">
        <button class="brand-cta" onclick="filterByBrand('${_q(brand)}')">${ar?`تصفّح كل ساعات ${escapeHtml(brand)}`:`Browse all ${escapeHtml(brand)} watches`}${n>0?` · ${n}`:''}</button>
      </div>
    </div>`;
}
