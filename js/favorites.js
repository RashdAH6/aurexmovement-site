// favorites.js — load/toggle favorites, heart button, favorites page.


// ════════════════════════════════════════════════
// FAVORITES
// ════════════════════════════════════════════════
async function loadFavorites(){
  if(!currentUser){ favorites = []; return; }
  try {
    const { data, error } = await sb.from('favorites').select('listing_id').eq('user_id', currentUser.id);
    if(error) throw error;
    favorites = (data||[]).map(f=>f.listing_id);
  } catch(e){
    console.error('Favorites load error:', e);
    favorites = [];
  }
}

function isFavorited(id){ return favorites.includes(id); }

async function toggleFavorite(e, id){
  if(e){ e.stopPropagation(); }
  if(!currentUser){
    postAfterAuth = currentView;
    openModal('login');
    toast(currentLang==='ar'?'سجّل الدخول لحفظ المفضلة':'Log in to save favorites');
    return;
  }
  const fav = isFavorited(id);
  // Update local state + heart visuals immediately (optimistic)
  if(fav){ favorites = favorites.filter(f=>f!==id); }
  else if(!favorites.includes(id)){ favorites.push(id); }
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(el=>{
    el.classList.toggle('active', isFavorited(id));
  });
  toast(fav
    ? (currentLang==='ar'?'أُزيلت من المفضلة':'Removed from favorites')
    : (currentLang==='ar'?'أُضيفت للمفضلة ♥':'Added to favorites ♥'));
  // Only the favorites page needs a re-render (item leaves the list)
  if(currentView==='favorites') renderFavorites();
  // Persist to Supabase
  try {
    if(fav){
      const { error } = await sb.from('favorites').delete().eq('user_id', currentUser.id).eq('listing_id', id);
      if(error) throw error;
    } else {
      const { error } = await sb.from('favorites').insert([{ user_id: currentUser.id, listing_id: id }]);
      if(error) throw error;
    }
  } catch(err){
    // Revert on failure
    if(fav){ if(!favorites.includes(id)) favorites.push(id); }
    else { favorites = favorites.filter(f=>f!==id); }
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(el=>{
      el.classList.toggle('active', isFavorited(id));
    });
    if(currentView==='favorites') renderFavorites();
    toast('Error: '+err.message);
  }
}

function favBtnHtml(id){
  const active = isFavorited(id) ? ' active' : '';
  return `<button class="fav-btn${active}" data-fav="${id}" onclick="toggleFavorite(event,'${id}')" title="${currentLang==='ar'?'المفضلة':'Favorite'}">
    <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
  </button>`;
}

function renderFavorites(){
  const container = document.getElementById('favoritesContent');
  if(!container) return;
  const L = T[currentLang];
  if(!currentUser){
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔒</div><p class="empty-text">${currentLang==='ar'?'يرجى تسجيل الدخول':'Please log in'}</p></div>`;
    return;
  }
  const favListings = listings.filter(l=>favorites.includes(l.id));
  if(favListings.length===0){
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">♡</div><p class="empty-text">${currentLang==='ar'?'لا توجد ساعات محفوظة':'No saved watches yet'}</p><p class="empty-sub">${currentLang==='ar'?'اضغط القلب على أي إعلان لحفظه هنا':'Tap the heart on any listing to save it here'}</p><button class="btn-primary" onclick="showView('listings')">${currentLang==='ar'?'تصفح السوق':'Browse Market'}</button></div>`;
    return;
  }
  container.innerHTML = `<div class="cards-grid" style="gap:1.5px;background:var(--border)">${favListings.map(l=>renderCard(l)).join('')}</div>`;
}
