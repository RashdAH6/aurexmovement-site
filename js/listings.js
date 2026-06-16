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
    const { data, error } = await sb.from('listings').select('*').order('created_at', { ascending: false }).limit(500);
    if(error) throw error;
    listings = (data||[]).map(l=>({
      id: l.id,
      userId: l.user_id,
      userName: l.user_name,
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
      verified: l.seller_verified === true,
      createdAt: new Date(l.created_at).getTime(),
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
    ? `<img src="${l.images[0]}" alt="${l.brand} ${l.model}">`
    : `<div class="placeholder-svg"><svg viewBox="0 0 80 80" fill="none" stroke="rgba(201,161,91,0.5)" stroke-width="1"><circle cx="40" cy="40" r="28"/><circle cx="40" cy="40" r="20"/><line x1="40" y1="20" x2="40" y2="25"/><line x1="40" y1="55" x2="40" y2="60"/><line x1="20" y1="40" x2="25" y2="40"/><line x1="55" y1="40" x2="60" y2="40"/><line x1="40" y1="40" x2="40" y2="30"/><line x1="40" y1="40" x2="48" y2="43"/></svg></div>`;
  const badge = l.status==='available'
    ? `<span class="wcard-badge badge-available">${L.available}</span>`
    : `<span class="wcard-badge badge-sold">${L.sold}</span>`;
  const isNew = (Date.now()-l.createdAt)<86400000 && l.status==='available'
    ? `<span class="wcard-featured">${L.newBadge}</span>` : '';
  const priceDisplay = l.price ? Number(l.price).toLocaleString(locale)+' AED' : (currentLang==='ar'?'تفاوضي':'Negotiable');
  return `
  <div class="wcard" onclick="openDetail('${l.id}')">
    <div class="wcard-img">${isNew}${badge}${favBtnHtml(l.id)}${imgHtml}</div>
    <div class="wcard-body">
      <div class="wcard-brand">${l.brand}${l.verified?` <span class="verified-mini" title="${currentLang==='ar'?'تاجر موثق':'Verified'}"><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>`:''}</div>
      <div class="wcard-model">${l.title || l.model}</div>
      <div class="wcard-price ${l.negotiable==='yes'?'negotiable':''}">${priceDisplay}</div>
    </div>
  </div>`;
}

function renderHomeGrid(){
  const grid = document.getElementById('homeGrid');
  const empty = document.getElementById('homeEmpty');
  if(!grid) return;
  const recent = [...listings].filter(l=>l.status==='available').sort((a,b)=>b.createdAt-a.createdAt).slice(0,6);
  if(recent.length===0){ grid.style.display='none'; empty.style.display='block'; }
  else { grid.style.display='grid'; empty.style.display='none'; grid.innerHTML=recent.map(l=>renderCard(l)).join(''); }
  renderTopDealers();
  renderVerified();
}

// Verified tab = watches from verified sellers
function renderVerified(){
  const wrap = document.getElementById('verifiedGrid');
  if(!wrap) return;
  const v = listings.filter(l=>l.verified && l.status==='available');
  if(v.length===0){
    wrap.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--grey);font-size:.85rem">${currentLang==='ar'?'لا توجد ساعات من تجار موثّقين بعد':'No watches from verified dealers yet'}</div>`;
    return;
  }
  wrap.innerHTML = v.map(l=>renderCard(l)).join('');
}

// Switch the home content tab (Latest / Top Dealers / Brands / Verified)
function homeTab(name){
  document.querySelectorAll('.home-tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===name));
  document.querySelectorAll('.home-panel').forEach(p=>p.classList.toggle('panel-active', p.dataset.panel===name));
}

// Top dealers = sellers with the most active listings (derived from listings data)
function renderTopDealers(){
  const wrap = document.getElementById('topDealers');
  if(!wrap) return;
  const map = {};
  listings.filter(l=>l.status==='available' && l.userName).forEach(l=>{
    if(!map[l.userName]) map[l.userName] = { name:l.userName, count:0, verified:false };
    map[l.userName].count++;
    if(l.verified) map[l.userName].verified = true;
  });
  const dealers = Object.values(map).sort((a,b)=>b.count-a.count).slice(0,8);
  if(dealers.length===0){
    wrap.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--grey);font-size:.85rem">${currentLang==='ar'?'لا يوجد تجار بعد':'No dealers yet'}</div>`;
    return;
  }
  wrap.innerHTML = dealers.map(d=>`
    <div class="dealer-card">
      <div class="dealer-avatar">${(d.name||'?').charAt(0).toUpperCase()}</div>
      <div class="dealer-name">${d.name}${d.verified?` <svg viewBox="0 0 24 24" width="12" height="12" fill="var(--gold)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`:''}</div>
      <div class="dealer-count">${d.count} ${currentLang==='ar'?'إعلان':(d.count===1?'listing':'listings')}</div>
    </div>`).join('');
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
    if(brand && l.brand!==brand) return false;
    if(cond && l.condition!==cond) return false;
    if(set && !l.set?.includes(set)) return false;
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

  if(sort==='price_asc') results.sort((a,b)=>Number(a.price||0)-Number(b.price||0));
  else if(sort==='price_desc') results.sort((a,b)=>Number(b.price||0)-Number(a.price||0));
  else results.sort((a,b)=>b.createdAt-a.createdAt);

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
