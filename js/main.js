// main.js — init() boot sequence + popstate handler + start call. Load LAST.

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
// Lightweight event tracking — no-op unless an events tool (e.g. Plausible) is loaded.
// Page views come from Cloudflare Web Analytics (enable it in the Cloudflare dashboard).
function track(name, props){
  try { if(window.plausible) window.plausible(name, props ? { props } : undefined); } catch(e){}
  try {
    const type = name==='contact_reveal' ? 'contact' : (name==='listing_view' ? 'view' : null);
    if(type && typeof sb!=='undefined' && sb.from){
      sb.from('events').insert({ type, listing_id:(props&&props.id)||null, brand:(props&&props.brand)||null });
    }
  } catch(e){}
}

async function init(){
  // Listen for auth changes FIRST — so a Google sign-in that completes while the page is
  // still loading isn't missed (registering this late caused "returns but logged out").
  sb.auth.onAuthStateChange(async (event, session) => {
    if(session){
      const meta = session.user.user_metadata;
      currentUser = {
        id: session.user.id,
        name: meta.name || session.user.email.split('@')[0],
        wa: meta.whatsapp || '',
        bio: meta.bio || '',
        avatar: meta.avatar_url || '',
        email: session.user.email
      };
      localStorage.setItem('aurex_session', JSON.stringify(currentUser));
    } else {
      currentUser = null;
      localStorage.removeItem('aurex_session');
    }
    await loadFavorites();
    // repaint the current grid so saved-favorite hearts fill in immediately
    if(currentView==='home' && typeof renderHomeGrid==='function') renderHomeGrid();
    else if(currentView==='listings' && typeof filterListings==='function') filterListings();
    else if(currentView==='favorites' && typeof renderFavorites==='function') renderFavorites();
    updateNavForUser();
  });

  // Check Supabase auth session
  const { data: { session } } = await sb.auth.getSession();
  if(session){
    const meta = session.user.user_metadata;
    currentUser = {
      id: session.user.id,
      name: meta.name || session.user.email.split('@')[0],
      wa: meta.whatsapp || '',
      bio: meta.bio || '',
      avatar: meta.avatar_url || '',
      email: session.user.email
    };
    localStorage.setItem('aurex_session', JSON.stringify(currentUser));
  } else {
    const saved = localStorage.getItem('aurex_session');
    if(saved) localStorage.removeItem('aurex_session');
    currentUser = null;
  }
  updateNavForUser();
  applyTheme(currentTheme);
  setLang(currentLang);
  // Surface any OAuth login error returned in the URL (e.g. a Google sign-in failure),
  // so it's visible instead of silently cleared.
  try {
    const ret = window.__authReturn || '';
    const m = ret.match(/error_description=([^&]+)/) || ret.match(/[#&?]error=([^&]+)/);
    if(m && !currentUser){ toast((currentLang==='ar'?'خطأ الدخول: ':'Login error: ') + decodeURIComponent(m[1].replace(/\+/g,' ')).slice(0,140)); }
  } catch(e){}
  await loadListings();
  await loadFavorites();
  renderHomeGrid();
  // If opened via a shared #watch-{id} link, jump straight to it
  await handleHashRoute();
  window.scrollTo(0,0);
}

// ════════════════════════════════════════════════
// START
// ════════════════════════════════════════════════
// Browser back/forward: open watch from hash, or return to listings
window.addEventListener('popstate', async ()=>{
  const matched = await handleHashRoute();
  if(!matched && currentView==='detail'){
    showView('listings');
  }
});

init();
