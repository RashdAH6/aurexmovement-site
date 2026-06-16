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

