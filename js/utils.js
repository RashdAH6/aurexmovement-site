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
function canonCond(v){ return COND_CANON[v] || v || ''; }
function canonSet(v){ return SET_CANON[v] || v || ''; }
function tCond(v){ const c=canonCond(v); return currentLang==='ar' ? (COND_AR[c]||c) : c; }
function tSet(v){ const c=canonSet(v); return currentLang==='ar' ? (SET_AR[c]||c) : c; }


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

