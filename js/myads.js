// myads.js — my listings: render, mark sold, relist, delete, edit.

// ════════════════════════════════════════════════
// MY ADS
// ════════════════════════════════════════════════
function renderMyAds(){
  const container=document.getElementById('myAdsContent');
  const L=T[currentLang];
  if(!currentUser){ container.innerHTML=`<div class="empty-state"><div class="empty-icon">🔒</div><p class="empty-text">${currentLang==='ar'?'يرجى تسجيل الدخول':'Please log in'}</p></div>`; return; }
  const myListings=listings.filter(l=>l.userId===currentUser.id);
  if(myListings.length===0){
    container.innerHTML=`<div class="empty-state"><div class="empty-icon">⌚</div><p class="empty-text">${L.emptyMyAds}</p><p class="empty-sub">${L.emptyMyAdsSub}</p><button class="btn-primary" onclick="showView('post')">${L.addFirst}</button></div>`;
    return;
  }
  const locale = currentLang==='ar'?'ar-AE':'en-AE';
  container.innerHTML=myListings.map(l=>{
    const priceDisplay=l.price?Number(l.price).toLocaleString(locale)+' AED':(currentLang==='ar'?'تفاوضي':'Negotiable');
    const imgHtml=l.images&&l.images[0]?`<img src="${l.images[0]}">`:`<div class="ph"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg></div>`;
    const statusLabel = l.status==='available'?(currentLang==='ar'?'نشط':'Active'):(currentLang==='ar'?'مُباع':'Sold');
    return `<div class="myad-card">
      <div class="myad-img">${imgHtml}</div>
      <div class="myad-body">
        <div class="myad-brand">${l.brand}</div>
        <div class="myad-model">${l.model}</div>
        <div class="myad-meta">${l.condition||''} ${l.set?'· '+l.set:''} ${l.city?'· '+l.city:''}</div>
        <div style="margin-top:.5rem;font-size:.65rem;color:rgba(167,167,167,.4)">${new Date(l.createdAt).toLocaleDateString(locale)}</div>
      </div>
      <div class="myad-actions">
        <div>
          <div class="myad-status ${l.status==='available'?'status-live':'status-sold-lbl'}">${statusLabel}</div>
          <div class="myad-price">${priceDisplay}</div>
        </div>
        <div class="myad-btns">
          <button class="myad-btn edit" onclick="editListing('${l.id}')">${currentLang==='ar'?'تعديل':'Edit'}</button>
          ${l.status==='available'
            ?`<button class="myad-btn" onclick="markSold('${l.id}')">${L.markSoldBtn}</button>`
            :`<button class="myad-btn" onclick="relistListing('${l.id}')">${L.relistBtn}</button>`}
          <button class="myad-btn del" onclick="deleteListing('${l.id}')">${L.deleteBtn}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

async function markSold(id){
  const l=listings.find(l=>l.id===id);
  if(!l || l.userId !== currentUser?.id){ toast(currentLang==='ar'?'غير مصرح':'Not authorized'); return; }
  try {
    await sb.from('listings').update({status:'sold'}).eq('id',id).eq('user_id',currentUser.id);
    await loadListings(true); renderMyAds(); updateStatCount(); renderHomeGrid();
    toast(currentLang==='ar'?'تم تحديث الإعلان كمُباع':'Listing marked as sold');
  } catch(e){ toast('Error: '+e.message); }
}

async function relistListing(id){
  const l=listings.find(l=>l.id===id);
  if(!l || l.userId !== currentUser?.id){ toast(currentLang==='ar'?'غير مصرح':'Not authorized'); return; }
  try {
    await sb.from('listings').update({status:'available'}).eq('id',id).eq('user_id',currentUser.id);
    await loadListings(true); renderMyAds(); updateStatCount(); renderHomeGrid();
    toast(currentLang==='ar'?'تم إعادة نشر الإعلان':'Listing is live again');
  } catch(e){ toast('Error: '+e.message); }
}

async function deleteListing(id){
  const l=listings.find(l=>l.id===id);
  if(!l || l.userId !== currentUser?.id){ toast(currentLang==='ar'?'غير مصرح':'Not authorized'); return; }
  if(!confirm(currentLang==='ar'?'هل تريد حذف هذا الإعلان؟':'Delete this listing?')) return;
  try {
    await sb.from('listings').delete().eq('id',id).eq('user_id',currentUser.id);
    await loadListings(true); renderMyAds(); updateStatCount(); renderHomeGrid();
    toast(currentLang==='ar'?'تم حذف الإعلان':'Listing deleted');
  } catch(e){ toast('Error: '+e.message); }
}

function editListing(id){
  const l = listings.find(l => l.id === id);
  if(!l || l.userId !== currentUser?.id){ toast(currentLang==='ar'?'غير مصرح':'Not authorized'); return; }

  // showView('post') resets editingListingId — so we set it inside setTimeout
  showView('post');

  setTimeout(() => {
    editingListingId = id; // set AFTER showView resets it

    const set = (elId, val) => { const el = document.getElementById(elId); if(el && val != null) el.value = val; };
    set('pTitle', l.title);
    set('pBrand', l.brand);
    if(typeof populateModelOptions==='function') populateModelOptions(l.brand);
    updateTitleCounter();
    updateDescCounter();
    set('pModel', l.model);
    set('pRef',   l.ref);
    set('pYear',  l.year);
    set('pDial',  l.dial);
    set('pCond',  l.condition);
    set('pSet',   l.set);
    set('pDesc',  l.desc);
    set('pPrice', l.price);
    set('pNeg',   l.negotiable);
    set('pWA',    l.wa);
    set('pCity',  l.city);
    set('pMovement', l.movement);
    set('pMaterial', l.material);
    set('pSize',  l.size);
    set('pGender', l.gender);
    set('pBracelet', l.bracelet);
    document.getElementById('pTerms').checked = true;

    // Load existing images as previews (URLs only, no re-upload unless changed)
    slotImages = [...(l.images || []).slice(0,4), null, null, null, null].slice(0,4);
    slotFiles  = [null, null, null, null];
    renderImgSlots();
    updatePreview();

    // Change the button text and form title
    const btn = document.getElementById('publishBtnEl');
    if(btn) btn.textContent = currentLang==='ar' ? 'حفظ التعديلات' : 'Save Changes';
    const title = document.getElementById('postTitleEl');
    if(title) title.innerHTML = currentLang==='ar' ? 'تعديل <em>إعلانك</em>' : 'Edit Your <em>Listing</em>';
  }, 50);
}

