// main.js — init() boot sequence + popstate handler + start call. Load LAST.

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
async function init(){
  // Check Supabase auth session
  const { data: { session } } = await sb.auth.getSession();
  if(session){
    const meta = session.user.user_metadata;
    currentUser = {
      id: session.user.id,
      name: meta.name || session.user.email.split('@')[0],
      wa: meta.whatsapp || '',
      bio: meta.bio || '',
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
  await loadListings();
  await loadFavorites();
  renderHomeGrid();
  updateStatCount();
  // If opened via a shared #watch-{id} link, jump straight to it
  await handleHashRoute();
  window.scrollTo(0,0);

  // Listen for auth changes
  sb.auth.onAuthStateChange(async (event, session) => {
    if(session){
      const meta = session.user.user_metadata;
      currentUser = {
        id: session.user.id,
        name: meta.name || session.user.email.split('@')[0],
        wa: meta.whatsapp || '',
        bio: meta.bio || '',
        email: session.user.email
      };
      localStorage.setItem('aurex_session', JSON.stringify(currentUser));
    } else {
      currentUser = null;
      localStorage.removeItem('aurex_session');
    }
    await loadFavorites();
    updateNavForUser();
  });
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
