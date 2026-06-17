// views.js — SPA router: showView / goBack / requireAuth / filterByBrand.


// ════════════════════════════════════════════════
// VIEWS
// ════════════════════════════════════════════════
async function showView(v){
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  const target = document.getElementById('view-'+v);
  if(!target) return;
  previousView = currentView;
  currentView = v;
  updateBottomNav();
  refreshAdminUI();
  if(v!=='detail'){
    restoreMeta();
    if(location.hash.startsWith('#watch-')){
      try { history.pushState('', '', location.pathname); } catch(e){ location.hash=''; }
    }
  }
  target.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(v==='listings'){ await loadListings(); filterListings(); }
  if(v==='myads'){ await loadListings(); renderMyAds(); }
  if(v==='favorites'){ await loadListings(); await loadFavorites(); renderFavorites(); }
  if(v==='ai'){ await loadListings(); renderAI(); }
  if(v==='home'){ await loadListings(); renderHomeGrid(); updateStatCount(); }
  if(v==='post'){ editingListingId = null; resetPostForm(); }
  if(v==='profile'){ await loadListings(); loadProfile(); }
  if(v==='admin'){ if(!isAdmin()) return showView('home'); await loadListings(); renderAdmin(); }
  if(v==='terms'){ renderTerms(); }
}

function goBack(){
  if(location.hash.startsWith('#watch-')){
    try { history.pushState('', '', location.pathname); } catch(e){ location.hash=''; }
  }
  restoreMeta();
  showView(previousView==='detail'?'listings':previousView);
}

function requireAuth(target){
  if(currentUser){ showView(target); }
  else{ postAfterAuth=target; openModal('register'); }
}

function filterByBrand(brand){
  showView('listings');
  setTimeout(()=>{
    document.getElementById('fBrand').value = brand;
    filterListings();
  },100);
}

// Open Home and switch to a content panel (Latest / Brands / Top Dealers / Verified).
// On desktop the home-tabs row is hidden, so the logo + sub-nav use this to reach the
// panels reliably (awaits the home view, then sets the panel — no setTimeout race).
async function goHomePanel(panel){
  await showView('home');
  homeTab(panel || 'latest');
}

// Hero search box → open Market with the query applied
function heroSearch(){
  const v = (document.getElementById('heroSearchInput')?.value||'').trim();
  showView('listings');
  setTimeout(()=>{
    const gs = document.getElementById('globalSearch'); if(gs) gs.value = v;
    filterListings();
  },100);
}

// Browse-by-price shortcut → open Market filtered by a price band (0 = unbounded)
function browsePrice(min, max){
  showView('listings');
  setTimeout(()=>{
    const a = document.getElementById('fPriceMin'); if(a) a.value = min || '';
    const b = document.getElementById('fPriceMax'); if(b) b.value = max || '';
    filterListings();
  },100);
}

// Bottom-nav account button: profile if logged in, else login modal
function goAccount(){
  if(currentUser){ showView('profile'); }
  else{ openModal('login'); }
}

// How It Works / FAQ modal (reachable from Profile → Support)
function openInfo(){ document.getElementById('infoModal')?.classList.add('open'); }
function closeInfo(){ document.getElementById('infoModal')?.classList.remove('open'); }

// Highlight the active bottom-nav tab
function updateBottomNav(){
  const map = { home:'bnavHome', favorites:'bnavFav', post:'bnavSell', ai:'bnavAI', profile:'bnavAccount' };
  document.querySelectorAll('.bnav-item').forEach(b=>b.classList.remove('active'));
  const id = map[currentView];
  if(id){ const el=document.getElementById(id); if(el) el.classList.add('active'); }
}

// ── Filter: collapsible category accordion + mobile drawer ──
function openFilterDrawer(){
  document.getElementById('filterSidebar')?.classList.add('open');
  document.getElementById('filterOverlay')?.classList.add('open');
}
function closeFilterDrawer(){
  document.getElementById('filterSidebar')?.classList.remove('open');
  document.getElementById('filterOverlay')?.classList.remove('open');
}
// Collapse every filter category by default; tapping its header expands/collapses it.
(function initFilterAccordion(){
  document.querySelectorAll('.sidebar-section').forEach(s=>s.classList.add('collapsed'));
  document.addEventListener('click', e=>{
    const lbl = e.target.closest('.sidebar-label');
    if(lbl && lbl.parentElement && lbl.parentElement.classList.contains('sidebar-section')){
      lbl.parentElement.classList.toggle('collapsed');
    }
  });
})();
