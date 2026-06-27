// utils.js — toast, safeText/safeHTML helpers, and the global outside-click handler.

// ════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}


function safeText(id, val){ const el=document.getElementById(id); if(el) el.textContent=val; }
function safeHTML(id, val){ const el=document.getElementById(id); if(el) el.innerHTML=val; }

// HTML-escape any user-controlled text before injecting it via innerHTML (anti stored-XSS).
function escapeHtml(s){
  return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

// Normalize a UAE WhatsApp number to wa.me form (971XXXXXXXXX). Tolerates +971 / 00971 /
// a leading 971 / a leading 0 / spaces & symbols so the country code is never doubled.
function waNumber(raw){
  let d = String(raw==null?'':raw).replace(/\D/g,'');
  if(d.startsWith('00971')) d = d.slice(5);
  else if(d.startsWith('971')) d = d.slice(3);
  d = d.replace(/^0+/, '');
  return d ? '971'+d : '';
}

// Condition & Box/Papers values may be stored in Arabic OR English (sellers post in either
// language). Canonicalize to one English key for filtering; translate back for display.
const COND_CANON = {'جديدة':'New','New':'New','شبه جديدة':'Like New','Like New':'Like New','ممتازة':'Excellent','Excellent':'Excellent','جيدة':'Good','Good':'Good'};
const SET_CANON  = {'Full Set (بوكس + أوراق)':'Full Set','Full Set':'Full Set','بوكس فقط':'Box Only','Box Only':'Box Only','أوراق فقط':'Papers Only','Papers Only':'Papers Only','بدون بوكس أو أوراق':'No Box','بدون بوكس':'No Box','No Box':'No Box'};
const COND_AR = {'New':'جديدة','Like New':'شبه جديدة','Excellent':'ممتازة','Good':'جيدة'};
const SET_AR  = {'Full Set':'فل سيت','Box Only':'بوكس فقط','Papers Only':'أوراق فقط','No Box':'بدون بوكس'};
// A listing is "featured" (paid placement) when it has an active row in featured_listings
// (computed at load in loadListings). Sellers cannot set this — only the owner can, via Supabase.
function isFeatured(l){ return !!(l && l.featured); }
// A listing is expired once its plan duration (expires_at) has passed; live = available & not expired.
function isExpired(l){ return !!(l && l.expiresAt && Date.parse(l.expiresAt) < Date.now()); }
function isLive(l){ return !!(l && l.status==='available' && !isExpired(l) && l.planStatus!=='pending'); }
function canonCond(v){ return COND_CANON[v] || v || ''; }
function canonSet(v){ return SET_CANON[v] || v || ''; }
function tCond(v){ const c=canonCond(v); return currentLang==='ar' ? (COND_AR[c]||c) : c; }
function tSet(v){ const c=canonSet(v); return currentLang==='ar' ? (SET_AR[c]||c) : c; }
// Emirate/city is stored in Arabic; show the English name when the UI is in English.
const CITY_EN = {'دبي':'Dubai','أبوظبي':'Abu Dhabi','الشارقة':'Sharjah','عجمان':'Ajman','رأس الخيمة':'Ras Al Khaimah','الفجيرة':'Fujairah','أم القيوين':'Umm Al Quwain'};
function tCity(v){ return currentLang==='en' ? (CITY_EN[v]||v) : (v||''); }

// ════════════════════════════════════════════════
// PLAN PAYMENT (off-platform, via WhatsApp) — reads admin-editable SETTINGS
// (pay_whatsapp / pay_note_ar / pay_note_en, loaded in loadListings).
// ════════════════════════════════════════════════
function _settings(){ return (typeof SETTINGS!=='undefined' && SETTINGS) ? SETTINGS : {}; }
// The seller-facing "your paid listing is pending until payment" note, bilingual + falls back.
function payNote(){
  const ar = currentLang==='ar'; const s=_settings();
  const fallback = ar
    ? 'إعلانك المدفوع قيد الانتظار حتى يتم تأكيد الدفع. راسلنا على واتساب لإتمام الدفع وسنقوم بتفعيله.'
    : "Your paid listing is pending until payment is confirmed. Message us on WhatsApp to pay and we'll activate it.";
  return (ar ? s.pay_note_ar : s.pay_note_en) || fallback;
}
// wa.me link with a pre-filled payment message; '' when no payment number is set yet.
function payWaLink(planName, priceTxt, itemTxt){
  const num = waNumber(_settings().pay_whatsapp || '');
  if(!num) return '';
  const ar = currentLang==='ar';
  const msg = ar
    ? `مرحباً، أريد دفع رسوم باقة ${planName} (${priceTxt}) لإعلاني: ${itemTxt}`
    : `Hi, I'd like to pay for my ${planName} plan (${priceTxt}) for my listing: ${itemTxt}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}
// Full payment block (note + WhatsApp button) shown on the success screen for paid plans.
function payBlockHtml(planName, priceTxt, itemTxt){
  const ar = currentLang==='ar';
  const link = payWaLink(planName, priceTxt, itemTxt);
  const wa = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="flex:none"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.737-.979z"/></svg>`;
  const btn = link
    ? `<a class="pay-wa-btn" href="${link}" target="_blank" rel="noopener">${wa}<span>${ar?`ادفع عبر واتساب — ${priceTxt}`:`Pay on WhatsApp — ${priceTxt}`}</span></a>`
    : `<div class="pay-soon">${ar?'سيتم تزويدك بتفاصيل الدفع قريباً.':'Payment details will be shared with you shortly.'}</div>`;
  return `<div class="pay-note">${escapeHtml(payNote())}</div>${btn}`;
}


// Close dropdowns on outside click - unified handler
document.addEventListener('click', e=>{
  const wrap = document.getElementById('avatarWrap');
  if(wrap && !wrap.contains(e.target)){
    closeAvatarMenu();
  }
  const panel = document.getElementById('settingsPanel');
  const fab = document.getElementById('settingsFab');
  if(panel && fab && panel.classList.contains('open') && !panel.contains(e.target) && !fab.contains(e.target)){
    panel.classList.remove('open');
  }
});

