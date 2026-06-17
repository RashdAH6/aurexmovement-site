// detail.js — listing detail view, contact reveal, share, hash routing, image swap.

// Arabic translations for the watch-spec dropdown values (stored in English).
const SPEC_VALUE_AR = {
  Automatic:'أوتوماتيك', Manual:'يدوي', Quartz:'كوارتز',
  Steel:'ستيل', 'Yellow Gold':'ذهب أصفر', 'Rose Gold':'ذهب وردي', 'White Gold':'ذهب أبيض',
  'Two-Tone':'مزدوج', Platinum:'بلاتين', Titanium:'تيتانيوم', Ceramic:'سيراميك',
  Men:'رجالي', Women:'نسائي', Unisex:'للجنسين',
  Gold:'ذهب', Leather:'جلد', Rubber:'مطاط', Other:'أخرى'
};
function tSpecVal(v){ return currentLang==='ar' ? (SPEC_VALUE_AR[v] || v) : v; }

// ════════════════════════════════════════════════
// DETAIL
// ════════════════════════════════════════════════
function openDetail(id, skipHash){
  const l = listings.find(l=>l.id===id);
  if(!l) return;
  currentDetailId = id;
  if(!skipHash){
    try { history.pushState({watch:id}, '', '#watch-'+id); } catch(e){ location.hash = 'watch-'+id; }
  }
  // SEO: reflect the watch in the page title + description
  try {
    const titleParts = [l.title || null, !l.title ? [l.brand, l.model, l.ref, l.year, l.city].filter(Boolean).join(' ') : null].filter(Boolean).join('');
    const priceTxt = l.price ? Number(l.price).toLocaleString('en-AE')+' AED' : 'Negotiable';
    document.title = `${titleParts || l.brand+' '+l.model} | ${priceTxt} — Aurex Movement`;
    const md = document.querySelector('meta[name="description"]');
    if(md){
      if(!window._defaultMetaDesc) window._defaultMetaDesc = md.getAttribute('content');
      md.setAttribute('content', [
        `${l.brand} ${l.model}${l.ref ? ' Ref. '+l.ref : ''} for sale in ${l.city||'UAE'}.`,
        l.year      ? `Year: ${l.year}.`           : '',
        l.condition ? `Condition: ${l.condition}.` : '',
        `Price: ${priceTxt}.`,
        `Authentic luxury watches UAE & GCC — Aurex Movement.`,
      ].filter(Boolean).join(' '));
    }
  } catch(e){}
  showView('detail');
  const L = T[currentLang];
  const locale = currentLang==='ar'?'ar-AE':'en-AE';
  const waNum = waNumber(l.wa);
  const waMsg = encodeURIComponent(currentLang==='ar'
    ?'مرحباً، رأيت إعلانك على Aurex Movement بخصوص '+l.brand+' '+l.model+'. هل لا تزال متاحة؟'
    :'Hi, I saw your listing on Aurex Movement for the '+l.brand+' '+l.model+'. Is it still available?');
  const priceDisplay = l.price ? Number(l.price).toLocaleString(locale)+' AED' : (currentLang==='ar'?'تفاوضي':'Negotiable');
  const seller = l.userName
    ? {name:l.userName, wa:l.wa}
    : {name:currentLang==='ar'?'بائع':'Seller', wa:l.wa};
  const mainImg = l.images&&l.images[0]
    ? `<img src="${escapeHtml(l.images[0])}" alt="${escapeHtml(l.brand)}">`
    : `<div class="big-placeholder"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="28"/><circle cx="40" cy="40" r="20"/><line x1="40" y1="20" x2="40" y2="25"/><line x1="40" y1="55" x2="40" y2="60"/><line x1="20" y1="40" x2="25" y2="40"/><line x1="55" y1="40" x2="60" y2="40"/><line x1="40" y1="40" x2="40" y2="30"/><line x1="40" y1="40" x2="48" y2="43"/></svg></div>`;
  const thumbs = (l.images||[]).map((img,i)=>`<div class="detail-thumb ${i===0?'active':''}" onclick="swapImg(this,'${escapeHtml(img)}')"><img src="${escapeHtml(img)}" loading="lazy"></div>`).join('');

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-imgs">
      <div class="detail-main-img" id="detailMainImg">${mainImg}</div>
      ${thumbs?`<div class="detail-thumbs">${thumbs}</div>`:''}
    </div>
    <div class="detail-info">
      <div class="detail-brand">${escapeHtml(l.brand)}${isFeatured(l)?` <span class="feat-badge" style="position:static;display:inline-block;margin-inline-start:.5rem;vertical-align:middle">★ ${currentLang==='ar'?'مميّز':'Featured'}</span>`:''}</div>
      <h1 class="detail-model">${escapeHtml(l.model)}</h1>
      <p class="detail-sub">${escapeHtml([l.ref,l.year,l.dial].filter(Boolean).join(' · '))}</p>
      <div class="detail-price-box">
        <div class="detail-price-label">${currentLang==='ar'?'السعر':'Price'}</div>
        <div class="detail-price">${priceDisplay}</div>
        ${l.negotiable==='yes'?`<div class="detail-price-neg">${L.priceNeg}</div>`:''}
      </div>
      <div class="detail-seller">
        <div class="seller-avatar">${escapeHtml(seller.name.charAt(0))}</div>
        <div><div class="seller-name">${escapeHtml(seller.name)}${l.verified?` <span class="verified-badge" title="${currentLang==='ar'?'تاجر موثق':'Verified Seller'}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>`:''}</div><div class="seller-since">${l.verified?(currentLang==='ar'?'تاجر موثق':'Verified Seller'):L.sellerLabel} · ${escapeHtml(l.city||'UAE')}</div></div>
      </div>
      ${l.status==='available'?`
      <div id="contactReveal" class="contact-reveal">
        <button class="detail-cta-reveal" onclick="revealContact('${l.id}')">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          ${currentLang==='ar'?'إظهار رقم التواصل':'Show Contact Number'}
        </button>
      </div>
      `:`<div style="background:rgba(167,167,167,.08);border:1px solid rgba(167,167,167,.15);padding:1rem;text-align:center;font-size:.8rem;color:var(--grey)">${currentLang==='ar'?'هذه الساعة مُباعة':'This watch has been sold'}</div>`}
      <button class="detail-cta-share" onclick="shareListing('${l.id}')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        ${currentLang==='ar'?'مشاركة الإعلان':'Share Listing'}
      </button>
      ${isAdmin()?`<div class="admin-bar"><span class="admin-lbl">${currentLang==='ar'?'إدارة':'Admin'}</span>${isFeatured(l)
        ? `<button class="admin-btn admin-on" onclick="adminUnfeature('${l.id}')">✓ ${currentLang==='ar'?'مميّز — إزالة':'Featured — Remove'}</button>`
        : `<button class="admin-btn" onclick="adminSetFeatured('${l.id}',30)">★ ${currentLang==='ar'?'تمييز 30 يوم':'Feature 30 days'}</button><button class="admin-btn" onclick="adminSetFeatured('${l.id}',0)">★ ${currentLang==='ar'?'تمييز دائم':'Feature — no expiry'}</button>`
      }</div>`:''}
      <div class="detail-specs">
        <h3 class="detail-specs-title">${currentLang==='ar'?'مواصفات الساعة':'Watch Specifications'}</h3>
        <div class="specs-grid">
          <div class="spec-item"><div class="spec-label">${L.specsBrand}</div><div class="spec-val">${escapeHtml(l.brand)}</div></div>
          <div class="spec-item"><div class="spec-label">${L.specsModel}</div><div class="spec-val">${escapeHtml(l.model)}</div></div>
          ${l.ref?`<div class="spec-item"><div class="spec-label">${L.specsRef}</div><div class="spec-val">${escapeHtml(l.ref)}</div></div>`:''}
          ${l.year?`<div class="spec-item"><div class="spec-label">${L.specsYear}</div><div class="spec-val">${escapeHtml(l.year)}</div></div>`:''}
          ${l.condition?`<div class="spec-item"><div class="spec-label">${L.specsCond}</div><div class="spec-val">${escapeHtml(tCond(l.condition))}</div></div>`:''}
          ${l.set?`<div class="spec-item"><div class="spec-label">${L.specsSet}</div><div class="spec-val">${escapeHtml(tSet(l.set))}</div></div>`:''}
          ${l.dial?`<div class="spec-item"><div class="spec-label">${L.specsDial}</div><div class="spec-val">${escapeHtml(l.dial)}</div></div>`:''}
          ${l.city?`<div class="spec-item"><div class="spec-label">${L.specsCity}</div><div class="spec-val">${escapeHtml(l.city)}</div></div>`:''}
          ${l.movement?`<div class="spec-item"><div class="spec-label">${currentLang==='ar'?'الحركة':'Movement'}</div><div class="spec-val">${escapeHtml(tSpecVal(l.movement))}</div></div>`:''}
          ${l.material?`<div class="spec-item"><div class="spec-label">${currentLang==='ar'?'مادة العلبة':'Case Material'}</div><div class="spec-val">${escapeHtml(tSpecVal(l.material))}</div></div>`:''}
          ${l.size?`<div class="spec-item"><div class="spec-label">${currentLang==='ar'?'قياس العلبة':'Case Size'}</div><div class="spec-val">${escapeHtml(l.size)} ${currentLang==='ar'?'مم':'mm'}</div></div>`:''}
          ${l.gender?`<div class="spec-item"><div class="spec-label">${currentLang==='ar'?'لمن':'Gender'}</div><div class="spec-val">${escapeHtml(tSpecVal(l.gender))}</div></div>`:''}
          ${l.bracelet?`<div class="spec-item"><div class="spec-label">${currentLang==='ar'?'السوار':'Bracelet'}</div><div class="spec-val">${escapeHtml(tSpecVal(l.bracelet))}</div></div>`:''}
        </div>
      </div>
      ${l.desc?`<div class="detail-desc"><h3 class="detail-desc-title">${currentLang==='ar'?'وصف البائع':'Seller Description'}</h3><p>${escapeHtml(l.desc)}</p></div>`:''}
    </div>
  `;
}

function revealContact(id){
  const l = listings.find(l=>l.id===id);
  if(!l) return;
  const box = document.getElementById('contactReveal');
  if(!box) return;
  const waNum = waNumber(l.wa);
  const L = T[currentLang];
  if(!waNum){
    box.innerHTML = `<div style="background:rgba(167,167,167,.08);border:1px solid rgba(167,167,167,.15);padding:1rem;text-align:center;font-size:.8rem;color:var(--grey)">${currentLang==='ar'?'رقم التواصل غير متوفر':'Contact number unavailable'}</div>`;
    return;
  }
  const waMsg = encodeURIComponent(currentLang==='ar'
    ?'مرحباً، رأيت إعلانك على Aurex Movement بخصوص '+l.brand+' '+l.model+'. هل لا تزال متاحة؟'
    :'Hi, I saw your listing on Aurex Movement for the '+l.brand+' '+l.model+'. Is it still available?');
  box.innerHTML = `
    <a class="detail-cta-wa" href="https://wa.me/${waNum}?text=${waMsg}" target="_blank" rel="nofollow noopener">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.554 4.112 1.523 5.843L0 24l6.335-1.505A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.89 0-3.658-.51-5.172-1.397l-.371-.22-3.761.894.938-3.664-.242-.384A9.8 9.8 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
      ${L.contactWa}
    </a>
    <a class="detail-cta-call" href="tel:+${waNum}" rel="nofollow">📞 +${waNum}</a>`;
}

async function shareListing(id){
  const l = listings.find(l=>l.id===id);
  if(!l) return;
  const url = 'https://aurexmovement.com/watch/'+id;
  const price = l.price ? Number(l.price).toLocaleString(currentLang==='ar'?'ar-AE':'en-AE')+' AED' : (currentLang==='ar'?'السعر تفاوضي':'Negotiable');
  const title = `${l.brand} ${l.model}`;
  const text = currentLang==='ar'
    ? `شاهد هذه الساعة على Aurex Movement:\n${l.brand} ${l.model} — ${price}`
    : `Check out this watch on Aurex Movement:\n${l.brand} ${l.model} — ${price}`;
  // Native share (mobile) if available
  if(navigator.share){
    try {
      await navigator.share({ title, text, url });
      return;
    } catch(e){
      if(e && e.name==='AbortError') return; // user cancelled
    }
  }
  // Fallback: copy link to clipboard
  try {
    await navigator.clipboard.writeText(url);
    toast(currentLang==='ar'?'تم نسخ رابط الإعلان ✦':'Listing link copied ✦');
  } catch(e){
    // Last resort: temporary input + execCommand
    const tmp = document.createElement('input');
    tmp.value = url; document.body.appendChild(tmp); tmp.select();
    try { document.execCommand('copy'); toast(currentLang==='ar'?'تم نسخ الرابط':'Link copied'); }
    catch(_){ toast(url); }
    document.body.removeChild(tmp);
  }
}

// Open a listing directly if the URL contains #watch-{id}
async function handleHashRoute(){
  // Open a watch from either the SPA hash (#watch-ID) or a real shared/SEO URL (/watch/ID).
  let m = (location.hash || '').match(/^#watch-(.+)$/);
  if(!m) m = location.pathname.match(/^\/watch\/(.+?)\/?$/);
  if(m){
    const id = m[1];
    if(!listings.length) await loadListings();
    const l = listings.find(l=>l.id===id);
    if(l){ openDetail(id, true); return true; }
  }
  return false;
}

function restoreMeta(){
  try {
    document.title = 'Aurex Movement | سوق الساعات الفاخرة في الإمارات والخليج | Luxury Watches UAE';
    const md = document.querySelector('meta[name="description"]');
    if(md && window._defaultMetaDesc) md.setAttribute('content', window._defaultMetaDesc);
  } catch(e){}
}

function swapImg(el, src){
  document.querySelectorAll('.detail-thumb').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('detailMainImg').innerHTML=`<img src="${src}" alt="watch">`;
}

// ════════════════════════════════════════════════
