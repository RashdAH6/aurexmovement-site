// listings.js — load + cache listings, stat counter, card render, filters, sort.

// Bilingual synonyms so the dial-colour dropdown matches free-text dials (AR or EN)
const DIAL_SYNONYMS = {
  Black:['black','أسود'], Blue:['blue','أزرق','ازرق'], Green:['green','أخضر','اخضر'],
  White:['white','أبيض','ابيض'], Silver:['silver','فضي'], Grey:['grey','gray','رمادي'],
  Gold:['gold','ذهبي'], Brown:['brown','بني']
};


let _listingsCacheTime = 0;
const LISTINGS_TTL = 60000; // 60 seconds

async function loadListings(force = false){
  const now = Date.now();
  if(!force && listings.length > 0 && (now - _listingsCacheTime) < LISTINGS_TTL) return;
  try {
    const [listRes, featRes, verRes, profRes, planRes] = await Promise.all([
      sb.from('listings').select('*').order('created_at', { ascending: false }).limit(500),
      sb.from('featured_listings').select('listing_id,until'),   // may not exist yet — handled gracefully
      sb.from('verified_sellers').select('user_id'),             // may not exist yet — handled gracefully
      sb.from('profiles').select('user_id,name,avatar_url'),     // may not exist yet — handled gracefully
      sb.from('plans').select('*').order('sort')                 // may not exist yet — handled gracefully
    ]);
    if(listRes.error) throw listRes.error;
    const featMap = {};
    (featRes.data||[]).forEach(f=>{ if(!f.until || Date.parse(f.until) > now) featMap[f.listing_id] = true; });
    const verSet = new Set((verRes.data||[]).map(v=>v.user_id));
    const profMap = {};
    (profRes.data||[]).forEach(p=>{ profMap[p.user_id] = p; });
    if(planRes.data && planRes.data.length){
      PLANS = planRes.data.filter(p=>p.active!==false).map(p=>({
        id:p.id, name:{ar:p.label_ar||p.id, en:p.label_en||p.id}, price:Number(p.price)||0,
        days:p.days||0, featured:p.featured_days||0, refreshes:p.refreshes||0, recommended:!!p.recommended,
        was:(Number(p.price)||0)===0?9.99:null,
        note:(Number(p.price)||0)===0?{ar:'مجاناً لفترة محدودة عند الإطلاق',en:'Free for a limited launch period'}:null
      }));
    }
    listings = (listRes.data||[]).map(l=>({
      id: l.id,
      userId: l.user_id,
      userName: (profMap[l.user_id] && profMap[l.user_id].name) || l.user_name,
      sellerAvatar: (profMap[l.user_id] && profMap[l.user_id].avatar_url) || '',
      title: l.title || '',
      brand: l.brand,
      model: l.model,
      ref: l.ref_number,
      year: l.year,
      dial: l.dial_color,
      condition: l.condition,
      set: l.box_papers,
      desc: l.description,
      price: l.price,
      negotiable: l.negotiable ? 'yes' : 'no',
      wa: l.whatsapp,
      city: l.city,
      movement: l.movement || '',
      material: l.case_material || '',
      size: l.case_size || '',
      gender: l.gender || '',
      bracelet: l.bracelet || '',
      images: l.images || [],
      status: l.status,
      verified: verSet.has(l.user_id) || l.seller_verified === true,
      createdAt: new Date(l.created_at).getTime(),
      featured: !!featMap[l.id],
      plan: l.plan || null,
      planStatus: l.plan_status || 'active',
      expiresAt: l.expires_at || null,
      refreshesLeft: l.refreshes_left || 0,
      warranty: l.warranty === true,
    }));
    _listingsCacheTime = now;
  } catch(e) {
    console.error('Supabase load error:', e);
    if(!listings.length) listings = JSON.parse(localStorage.getItem('aurex_listings_cache') || '[]');
  }
}


function updateStatCount(){
  const el = document.getElementById('statCount');
  if(!el) return;
  const target = listings.filter(l=>l.status==='available').length;
  let n=0; const step = Math.max(1,Math.ceil(target/30));
  const t = setInterval(()=>{ n=Math.min(n+step,target); el.textContent=n; if(n>=target)clearInterval(t); },40);
}


// ════════════════════════════════════════════════
// LISTINGS RENDER
// ════════════════════════════════════════════════
function renderCard(l, mini=false){
  const L = T[currentLang];
  const locale = currentLang==='ar'?'ar-AE':'en-AE';
  const imgHtml = l.images && l.images[0]
    ? `<img src="${escapeHtml(l.images[0])}" alt="${escapeHtml(l.brand)} ${escapeHtml(l.model)}" loading="lazy">`
    : `<div class="placeholder-svg"><svg viewBox="0 0 80 80" fill="none" stroke="rgba(201,161,91,0.5)" stroke-width="1"><circle cx="40" cy="40" r="28"/><circle cx="40" cy="40" r="20"/><line x1="40" y1="20" x2="40" y2="25"/><line x1="40" y1="55" x2="40" y2="60"/><line x1="20" y1="40" x2="25" y2="40"/><line x1="55" y1="40" x2="60" y2="40"/><line x1="40" y1="40" x2="40" y2="30"/><line x1="40" y1="40" x2="48" y2="43"/></svg></div>`;
  const badge = l.status==='available'
    ? `<span class="wcard-badge badge-available">${L.available}</span>`
    : `<span class="wcard-badge badge-sold">${L.sold}</span>`;
  const isNew = (Date.now()-l.createdAt)<86400000 && l.status==='available'
    ? `<span class="wcard-featured">${L.newBadge}</span>` : '';
  const feat = isFeatured(l) ? `<span class="feat-badge">★ ${currentLang==='ar'?'مميّز':'Featured'}</span>` : '';
  const priceDisplay = l.price ? Number(l.price).toLocaleString(locale)+' AED' : (currentLang==='ar'?'تفاوضي':'Negotiable');
  return `
  <div class="wcard${isFeatured(l)?' wcard-feat':''}" onclick="openDetail('${l.id}')">
    <div class="wcard-img">${feat}${isNew}${badge}${favBtnHtml(l.id)}${imgHtml}</div>
    <div class="wcard-body">
      <div class="wcard-brand">${escapeHtml(l.brand)}${l.verified?` <span class="verified-mini" title="${currentLang==='ar'?'تاجر موثق':'Verified'}"><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>`:''}</div>
      <div class="wcard-model">${escapeHtml(l.title || l.model)}</div>
      <div class="wcard-price ${l.negotiable==='yes'?'negotiable':''}">${priceDisplay}</div>
    </div>
  </div>`;
}

function renderHomeGrid(){
  const grid = document.getElementById('homeGrid');
  const empty = document.getElementById('homeEmpty');
  if(!grid) return;
  const recent = [...listings].filter(l=>isLive(l)).sort((a,b)=> ((isFeatured(b)?1:0)-(isFeatured(a)?1:0)) || (b.createdAt-a.createdAt)).slice(0,6);
  if(recent.length===0){ grid.style.display='none'; empty.style.display='block'; }
  else { grid.style.display='grid'; empty.style.display='none'; grid.innerHTML=recent.map(l=>renderCard(l)).join(''); }
  renderTopDealers();
  renderVerified();
}

// Verified tab = watches from verified sellers
function renderVerified(){
  const wrap = document.getElementById('verifiedGrid');
  if(!wrap) return;
  const v = listings.filter(l=>l.verified && isLive(l));
  if(v.length===0){
    wrap.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--grey);font-size:.85rem">${currentLang==='ar'?'لا توجد ساعات من تجار موثّقين بعد':'No watches from verified dealers yet'}</div>`;
    return;
  }
  wrap.innerHTML = v.map(l=>renderCard(l)).join('');
}

// ── Admin: feature / unfeature a listing (RLS lets ONLY the admin email write) ──
async function adminSetFeatured(id, days){
  if(!isAdmin()) return;
  const row = { listing_id: id };
  if(days > 0){ row.until = new Date(Date.now() + days*86400000).toISOString(); }
  const { error } = await sb.from('featured_listings').upsert(row, { onConflict: 'listing_id' });
  if(error){ toast('Error: ' + error.message); return; }
  await loadListings(true);
  toast(currentLang==='ar' ? 'تم التمييز ✦' : 'Featured ✦');
  _adminAfter();
}
async function adminUnfeature(id){
  if(!isAdmin()) return;
  const { error } = await sb.from('featured_listings').delete().eq('listing_id', id);
  if(error){ toast('Error: ' + error.message); return; }
  await loadListings(true);
  toast(currentLang==='ar' ? 'أُزيل التمييز' : 'Removed from featured');
  _adminAfter();
}

// ── Admin: verify / unverify a SELLER (per-seller; badge shows on ALL their listings) ──
async function adminVerifySeller(userId){
  if(!isAdmin() || !userId) return;
  const name = (listings.find(l=>l.userId===userId)||{}).userName || null;
  const { error } = await sb.from('verified_sellers').upsert({ user_id: userId, name }, { onConflict: 'user_id' });
  if(error){ toast('Error: ' + error.message); return; }
  await loadListings(true);
  toast(currentLang==='ar' ? 'تم توثيق البائع ✦' : 'Seller verified ✦');
  _adminAfter();
}
async function adminUnverifySeller(userId){
  if(!isAdmin() || !userId) return;
  const { error } = await sb.from('verified_sellers').delete().eq('user_id', userId);
  if(error){ toast('Error: ' + error.message); return; }
  await loadListings(true);
  toast(currentLang==='ar' ? 'أُلغي التوثيق' : 'Verification removed');
  _adminAfter();
}

// After an admin action, refresh whatever admin surface is currently open.
function _adminAfter(){
  if(currentView==='admin') renderAdmin();
  else if(currentDetailId) openDetail(currentDetailId, true);
}

// Admin dashboard: metrics + pending approvals + plans editor + listing rows.
function renderAdmin(){
  const ar = currentLang==='ar';
  const live = listings.filter(l=>isLive(l)).length;
  const featCount = listings.filter(l=>isFeatured(l)).length;
  const pending = listings.filter(l=>l.planStatus==='pending');
  const verDealers = new Set(listings.filter(l=>l.verified && l.userId).map(l=>l.userId)).size;
  const m = document.getElementById('adminMetrics');
  if(m) m.innerHTML = [
    [ar?'إعلانات حيّة':'Live', live],
    [ar?'مميّزة':'Featured', featCount],
    [ar?'بانتظار الدفع':'Pending', pending.length],
    [ar?'تجار موثّقون':'Verified', verDealers]
  ].map(x=>`<div class="admin-metric"><div class="am-lbl">${x[0]}</div><div class="am-num">${x[1]}</div></div>`).join('');
  _renderAdminPanels(pending);
  _renderAdminRows();
}

function _renderAdminPanels(pending){
  const el=document.getElementById('adminPanels'); if(!el) return;
  const ar=currentLang==='ar';
  let html='';
  if(pending && pending.length){
    html += `<div class="admin-panel"><div class="admin-panel-t">${ar?'بانتظار تأكيد الدفع':'Awaiting payment confirmation'}</div>`;
    html += pending.map(l=>{
      const pl=(PLANS||[]).find(p=>p.id===l.plan); const pn=pl?(pl.name[ar?'ar':'en']+' · '+pl.price+' AED'):(l.plan||'');
      return `<div class="am-row">
        <div class="am-info"><div class="am-name">${escapeHtml(l.brand)} ${escapeHtml(l.model||'')}</div>
        <div class="am-sub">${escapeHtml(l.userName||'')} · ${escapeHtml(pn)}</div></div>
        <button class="am-tg on" onclick="adminApprove('${l.id}')">✓ ${ar?'تأكيد ونشر':'Approve'}</button>
      </div>`;
    }).join('') + `</div>`;
  }
  const plans = (PLANS && PLANS.length) ? PLANS : [];
  if(plans.length){
    html += `<div class="admin-panel"><div class="admin-panel-t">${ar?'الباقات والأسعار':'Plans & pricing'}</div>`;
    html += plans.map(p=>`<div class="plan-edit">
      <div class="plan-edit-name">${p.name[ar?'ar':'en']}</div>
      <label>${ar?'السعر':'Price'}<input type="number" step="0.01" value="${p.price}" id="pe_price_${p.id}"></label>
      <label>${ar?'أيام':'Days'}<input type="number" value="${p.days}" id="pe_days_${p.id}"></label>
      <label>${ar?'أيام التميّز':'Feat.'}<input type="number" value="${p.featured}" id="pe_feat_${p.id}"></label>
      <label>${ar?'تحديثات':'Refresh'}<input type="number" value="${p.refreshes}" id="pe_ref_${p.id}"></label>
      <label class="plan-edit-chk"><input type="checkbox" id="pe_rec_${p.id}" ${p.recommended?'checked':''}> ${ar?'موصى':'Rec'}</label>
      <button class="am-tg" onclick="adminSavePlan('${p.id}')">${ar?'حفظ':'Save'}</button>
    </div>`).join('') + `</div>`;
  } else {
    html += `<div class="admin-panel"><div class="admin-panel-t">${ar?'الباقات':'Plans'}</div><div style="font-size:.78rem;color:var(--grey);padding:.4rem">${ar?'شغّل AUREX_add_plans.sql لإدارة الأسعار هنا':'Run AUREX_add_plans.sql to manage pricing here'}</div></div>`;
  }
  el.innerHTML = html;
}

function filterAdminList(){ _renderAdminRows(); }
function _renderAdminRows(){
  const wrap=document.getElementById('adminList'); if(!wrap) return;
  const ar=currentLang==='ar';
  const q=(document.getElementById('adminSearch')?.value||'').trim().toLowerCase();
  let rows=listings.slice();
  if(q) rows=rows.filter(l=>((l.brand||'')+' '+(l.model||'')+' '+(l.title||'')+' '+(l.userName||'')).toLowerCase().includes(q));
  if(!rows.length){ wrap.innerHTML=`<div class="admin-empty">${ar?'لا توجد نتائج':'No results'}</div>`; return; }
  wrap.innerHTML = rows.map(l=>{
    const price = l.price ? Number(l.price).toLocaleString(ar?'ar-AE':'en-AE')+' AED' : (ar?'تفاوضي':'Negotiable');
    const thumb = (l.images && l.images[0]) ? `<img src="${escapeHtml(l.images[0])}" alt="" loading="lazy">` : `<span class="am-ph">◷</span>`;
    let tags='';
    if(l.status==='sold') tags+=`<span class="am-sold">${ar?'مُباع':'Sold'}</span>`;
    if(l.planStatus==='pending') tags+=`<span class="am-sold" style="color:#e0a64b;border-color:#e0a64b">${ar?'بانتظار الدفع':'Pending'}</span>`;
    if(isExpired(l)) tags+=`<span class="am-sold">${ar?'منتهٍ':'Expired'}</span>`;
    const featBtn = isFeatured(l)
      ? `<button class="am-tg on" onclick="adminUnfeature('${l.id}')">★ ${ar?'مميّز':'Featured'}</button>`
      : `<button class="am-tg" onclick="adminSetFeatured('${l.id}',30)">★ ${ar?'تمييز':'Feature'}</button>`;
    const verBtn = l.userId ? (l.verified
      ? `<button class="am-tg on" onclick="adminUnverifySeller('${l.userId}')">✓ ${ar?'موثّق':'Verified'}</button>`
      : `<button class="am-tg" onclick="adminVerifySeller('${l.userId}')">✓ ${ar?'توثيق':'Verify'}</button>`) : '';
    return `<div class="am-row">
      <div class="am-thumb" onclick="openDetail('${l.id}')">${thumb}</div>
      <div class="am-info" onclick="openDetail('${l.id}')">
        <div class="am-name">${escapeHtml(l.brand)} ${escapeHtml(l.model||'')}${tags}</div>
        <div class="am-sub">${escapeHtml(l.userName||(ar?'بائع':'Seller'))} · ${price}</div>
      </div>
      <div class="am-actions">${featBtn}${verBtn}</div>
    </div>`;
  }).join('');
}

// Approve a paid listing: mark active, set the plan duration, apply featured days.
async function adminApprove(id){
  if(!isAdmin()) return;
  const l = listings.find(x=>x.id===id); if(!l) return;
  const plan = (PLANS||[]).find(p=>p.id===l.plan) || { days:30, featured:0 };
  const { error } = await sb.from('listings').update({
    plan_status:'active',
    expires_at:new Date(Date.now()+(plan.days||30)*86400000).toISOString(),
    bumped_at:new Date().toISOString()
  }).eq('id', id);
  if(error){ toast('Error: '+error.message); return; }
  if((plan.featured||0) > 0){
    await sb.from('featured_listings').upsert({ listing_id:id, until:new Date(Date.now()+plan.featured*86400000).toISOString() }, { onConflict:'listing_id' });
  }
  await loadListings(true);
  toast(currentLang==='ar'?'تم التأكيد والنشر ✦':'Approved & published ✦');
  renderAdmin();
}

// Save a plan's price/features (admin only).
async function adminSavePlan(id){
  if(!isAdmin()) return;
  const num = el => { const e=document.getElementById(el); return e ? (parseFloat(e.value)||0) : 0; };
  const { error } = await sb.from('plans').update({
    price: num('pe_price_'+id),
    days: Math.round(num('pe_days_'+id)),
    featured_days: Math.round(num('pe_feat_'+id)),
    refreshes: Math.round(num('pe_ref_'+id)),
    recommended: !!(document.getElementById('pe_rec_'+id)||{}).checked
  }).eq('id', id);
  if(error){ toast('Error: '+error.message); return; }
  await loadListings(true);
  toast(currentLang==='ar'?'تم حفظ الباقة ✦':'Plan saved ✦');
  renderAdmin();
}

// Switch the home content tab (Latest / Top Dealers / Brands / Verified)
function homeTab(name){
  document.querySelectorAll('.home-tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===name));
  document.querySelectorAll('.home-panel').forEach(p=>p.classList.toggle('panel-active', p.dataset.panel===name));
  if(name==='brands' && typeof renderBrandDirectory==='function') renderBrandDirectory();
}

// Top dealers = sellers with the most active listings (derived from listings data)
function renderTopDealers(){
  const wrap = document.getElementById('topDealers');
  if(!wrap) return;
  const map = {};
  listings.filter(l=>isLive(l) && l.userId).forEach(l=>{
    if(!map[l.userId]) map[l.userId] = { id:l.userId, name:l.userName||(currentLang==='ar'?'بائع':'Seller'), avatar:l.sellerAvatar||'', count:0, verified:false };
    map[l.userId].count++;
    if(l.verified) map[l.userId].verified = true;
    if(!map[l.userId].avatar && l.sellerAvatar) map[l.userId].avatar = l.sellerAvatar;
  });
  const dealers = Object.values(map).sort((a,b)=>b.count-a.count).slice(0,8);
  if(dealers.length===0){
    wrap.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--grey);font-size:.85rem">${currentLang==='ar'?'لا يوجد تجار بعد':'No dealers yet'}</div>`;
    return;
  }
  wrap.innerHTML = dealers.map(d=>`
    <div class="dealer-card" onclick="openDealer('${d.id}')">
      <div class="dealer-avatar">${d.avatar?`<img src="${escapeHtml(d.avatar)}" alt="">`:escapeHtml((d.name||'?').charAt(0).toUpperCase())}</div>
      <div class="dealer-name">${escapeHtml(d.name)}${d.verified?` <svg viewBox="0 0 24 24" width="12" height="12" fill="var(--gold)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`:''}</div>
      <div class="dealer-count">${d.count} ${currentLang==='ar'?'إعلان':(d.count===1?'listing':'listings')}</div>
    </div>`).join('');
}

// ── Dealer storefront: a seller's photo + name + their available listings ──
let currentDealerId = null;
function openDealer(id){ currentDealerId = id; showView('dealer'); }
function renderDealer(){
  const head = document.getElementById('dealerHeader');
  const grid = document.getElementById('dealerGrid');
  if(!head || !grid) return;
  const mine = listings.filter(l=>l.userId===currentDealerId);
  if(!mine.length){ head.innerHTML=''; grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--grey)">${currentLang==='ar'?'لا توجد إعلانات':'No listings'}</div>`; return; }
  const ref = mine[0];
  const avail = mine.filter(isLive);
  const name = ref.userName || (currentLang==='ar'?'بائع':'Seller');
  const av = ref.sellerAvatar ? `<img src="${escapeHtml(ref.sellerAvatar)}" alt="">` : escapeHtml(name.charAt(0).toUpperCase());
  head.innerHTML = `
    <div class="dealer-hero-avatar">${av}</div>
    <h1 class="dealer-hero-name">${escapeHtml(name)}${ref.verified?` <span class="verified-badge" title="${currentLang==='ar'?'تاجر موثق':'Verified'}"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>`:''}</h1>
    <div class="dealer-hero-sub">${ref.verified?(currentLang==='ar'?'تاجر موثّق':'Verified Dealer'):(currentLang==='ar'?'بائع':'Seller')} · ${avail.length} ${currentLang==='ar'?'إعلان متاح':'available'}</div>`;
  grid.innerHTML = avail.length ? avail.map(l=>renderCard(l)).join('') : `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--grey)">${currentLang==='ar'?'لا توجد إعلانات متاحة':'No available listings'}</div>`;
}

function filterListings(){
  const brand = document.getElementById('fBrand')?.value||'';
  const cond = document.getElementById('fCond')?.value||'';
  const set = document.getElementById('fSet')?.value||'';
  const pMin = parseFloat(document.getElementById('fPriceMin')?.value||0)||0;
  const pMax = parseFloat(document.getElementById('fPriceMax')?.value||0)||Infinity;
  const yMin = parseInt(document.getElementById('fYearMin')?.value||0)||0;
  const yMax = parseInt(document.getElementById('fYearMax')?.value||0)||Infinity;
  const dial = document.getElementById('fDial')?.value||'';
  const city = document.getElementById('fCity')?.value||'';
  const ref = (document.getElementById('fRef')?.value||'').trim().toLowerCase();
  const movement = document.getElementById('fMovement')?.value||'';
  const material = document.getElementById('fMaterial')?.value||'';
  const gender = document.getElementById('fGender')?.value||'';
  const bracelet = document.getElementById('fBracelet')?.value||'';
  const sMin = parseInt(document.getElementById('fSizeMin')?.value||0)||0;
  const sMax = parseInt(document.getElementById('fSizeMax')?.value||0)||Infinity;
  const sort = document.getElementById('sortSel')?.value||'newest';
  const search = document.getElementById('globalSearch')?.value?.toLowerCase()||'';

  let results = listings.filter(l=>{
    if(isExpired(l)) return false;
    if(brand && l.brand!==brand) return false;
    if(cond && canonCond(l.condition)!==cond) return false;
    if(set && canonSet(l.set)!==set) return false;
    if(pMin>0 || pMax<Infinity){
      const pr = Number(l.price);
      if(!l.price || isNaN(pr) || pr<pMin || pr>pMax) return false;
    }
    if(yMin>0 || yMax<Infinity){
      const y = parseInt(l.year)||0;
      if(!y || y<yMin || y>yMax) return false;
    }
    if(dial){
      const syns = DIAL_SYNONYMS[dial] || [dial.toLowerCase()];
      const dd = (l.dial||'').toLowerCase();
      if(!syns.some(s=>dd.includes(s))) return false;
    }
    if(city && l.city!==city) return false;
    if(ref && !((l.ref||'').toLowerCase().includes(ref))) return false;
    if(movement && l.movement!==movement) return false;
    if(material && l.material!==material) return false;
    if(gender && l.gender!==gender) return false;
    if(bracelet && l.bracelet!==bracelet) return false;
    if(sMin>0 || sMax<Infinity){
      const sz = parseInt(l.size)||0;
      if(!sz || sz<sMin || sz>sMax) return false;
    }
    if(search){
      const hay = (l.brand+' '+l.model+' '+l.ref+' '+l.desc).toLowerCase();
      if(!hay.includes(search)) return false;
    }
    return true;
  });

  const _bySort = (a,b)=> sort==='price_asc' ? Number(a.price||0)-Number(b.price||0)
    : sort==='price_desc' ? Number(b.price||0)-Number(a.price||0)
    : b.createdAt-a.createdAt;
  // Featured (paid) listings are always pinned first, then the chosen sort within each group.
  results.sort((a,b)=> ((isFeatured(b)?1:0)-(isFeatured(a)?1:0)) || _bySort(a,b));

  const grid = document.getElementById('listingsGrid');
  const empty = document.getElementById('listingsEmpty');
  const count = document.getElementById('resultsCount');
  if(!grid) return;

  document.getElementById('listingsCount').textContent = listings.length===0
    ?(currentLang==='ar'?'لا توجد إعلانات':'No listings')
    :results.length+' '+(currentLang==='ar'?'إعلان':'Listing'+(results.length!==1?'s':''));
  count.textContent = results.length+' '+(currentLang==='ar'?'نتيجة':'Result'+(results.length!==1?'s':''));

  // Mobile "Filters" button badge — number of active filter groups
  const _active = [brand,cond,set,dial,city,movement,material,gender,bracelet,ref].filter(Boolean).length
    + ((pMin>0||pMax<Infinity)?1:0) + ((yMin>0||yMax<Infinity)?1:0) + ((sMin>0||sMax<Infinity)?1:0);
  const _fc = document.getElementById('filterCount');
  if(_fc){ _fc.textContent=_active; _fc.style.display=_active>0?'inline-flex':'none'; }

  if(results.length===0){ grid.style.display='none'; empty.style.display='block'; }
  else { grid.style.display='grid'; empty.style.display='none'; grid.innerHTML=results.map(l=>renderCard(l)).join(''); }
}

function handleSearch(val){
  if(currentView==='listings') filterListings();
}

// ════════════════════════════════════════════════
// AI PRICE ASSISTANT (answers from live Aurex listings)
// ════════════════════════════════════════════════
function renderAI(){
  const chat = document.getElementById('aiChat');
  const sug  = document.getElementById('aiSuggest');
  if(chat && !chat.dataset.init){
    chat.dataset.init = '1';
    aiSay(currentLang==='ar'
      ?'مرحباً 👋 اسألني عن سعر أي ساعة (مثلاً: Rolex Submariner) وراح أعطيك نطاق الأسعار والمتوسط من إعلانات Aurex.'
      :'Hi 👋 Ask me about any watch (e.g. Rolex Submariner) and I\'ll give you the price range and average from Aurex listings.');
  }
  if(sug && !sug.dataset.init){
    sug.dataset.init = '1';
    let brands = [...new Set(listings.map(l=>l.brand).filter(Boolean))].slice(0,6);
    if(!brands.length) brands = ['Rolex','Omega','Patek Philippe','Audemars Piguet'];
    sug.innerHTML = brands.map(b=>`<span class="ai-chip" onclick="aiAsk('${b.replace(/['"\\]/g,'')}')">${b}</span>`).join('');
  }
}

function aiAsk(q){ const el=document.getElementById('aiInput'); if(el){ el.value=q; askAI(); } }

function aiSay(html, who){
  const chat = document.getElementById('aiChat'); if(!chat) return;
  const b = document.createElement('div');
  b.className = 'ai-bubble ai-' + (who||'ai');
  b.innerHTML = html;
  chat.appendChild(b);
  b.scrollIntoView({behavior:'smooth', block:'end'});
}

async function askAI(){
  const inp = document.getElementById('aiInput');
  const q = (inp?.value||'').trim();
  if(!q) return;
  const safe = q.replace(/[<>]/g,'');
  aiSay(safe, 'user');
  inp.value = '';
  await loadListings();
  const ql = q.toLowerCase();
  const matches = listings.filter(l =>
    (l.brand+' '+l.model+' '+(l.ref||'')+' '+(l.title||'')).toLowerCase().includes(ql));
  const locale = currentLang==='ar'?'ar-AE':'en-AE';
  const fmt = n => Number(n).toLocaleString(locale)+' AED';

  if(matches.length===0){
    aiSay(currentLang==='ar'
      ?`ما لقيت إعلانات تطابق "<b>${safe}</b>" حالياً على Aurex. جرّب ماركة أو موديل ثاني 👆`
      :`No current listings match "<b>${safe}</b>" on Aurex yet. Try another brand or model 👆`);
    return;
  }
  const prices = matches.map(l=>Number(l.price)).filter(p=>p>0);
  if(prices.length===0){
    aiSay(currentLang==='ar'
      ?`عندنا <b>${matches.length}</b> إعلان لـ "${safe}" بسعر تفاوضي (بدون سعر ثابت).`
      :`We have <b>${matches.length}</b> listing(s) for "${safe}", all priced as negotiable.`);
  } else {
    const min=Math.min(...prices), max=Math.max(...prices);
    const avg=Math.round(prices.reduce((a,b)=>a+b,0)/prices.length);
    aiSay(currentLang==='ar'
      ?`بناءً على <b>${matches.length}</b> إعلان على Aurex:<br>◈ النطاق: <b>${fmt(min)}</b> – <b>${fmt(max)}</b><br>◈ المتوسط: <b>${fmt(avg)}</b>`
      :`Based on <b>${matches.length}</b> listing(s) on Aurex:<br>◈ Range: <b>${fmt(min)}</b> – <b>${fmt(max)}</b><br>◈ Average: <b>${fmt(avg)}</b>`);
  }
  const top = matches.filter(l=>l.status==='available').slice(0,4);
  if(top.length) aiSay('<div class="cards-grid">'+top.map(l=>renderCard(l)).join('')+'</div>');
}

function resetFilters(){
  ['fBrand','fCond','fSet','fDial','fCity','fMovement','fMaterial','fGender','fBracelet'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  ['fPriceMin','fPriceMax','fYearMin','fYearMax','fRef','fSizeMin','fSizeMax'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  filterListings();
}

function setView(mode){
  const grid = document.getElementById('listingsGrid');
  document.getElementById('gridBtn').classList.toggle('active',mode==='grid');
  document.getElementById('listBtn').classList.toggle('active',mode==='list');
  grid.classList.toggle('list-view',mode==='list');
}
