// profile.js — profile load/save, change password, account info modal.

// ════════════════════════════════════════════════
// PROFILE
// ════════════════════════════════════════════════
async function loadProfile(){
  if(!currentUser) return;
  const L = T[currentLang];

  // Prefer Supabase metadata, fall back to localStorage cache
  const saved = JSON.parse(localStorage.getItem('aurex_profile_'+currentUser.id)||'{}');
  const bio = currentUser.bio || saved.bio || '';
  const wa = currentUser.wa || saved.wa || '';
  const name = currentUser.name || saved.name || '';

  // Update avatar
  const av = document.getElementById('profileAvatar');
  if(av) av.textContent = name.charAt(0).toUpperCase();

  // Update display
  safeText('profileName', name);
  safeText('profileWa', wa ? '+971 '+wa : '');
  safeText('profileEmail', currentUser.email || '');
  safeText('profileBio', bio);

  // Count ads
  const myAds = listings.filter(l=>l.userId===currentUser.id);
  safeText('profileAdsCount', myAds.length.toString());
  safeText('profileAdsLabel', currentLang==='ar'?'إعلان':'Listing');

  // Fill edit form
  const en = document.getElementById('editName'); if(en) en.value = name;
  const eb = document.getElementById('editBio'); if(eb) eb.value = bio;
  const ew = document.getElementById('editWa'); if(ew) ew.value = wa;

  // Translate labels
  safeText('editProfileTitle', currentLang==='ar'?'تعديل الملف الشخصي':'Edit Profile');
  safeText('profileNameLabel', currentLang==='ar'?'الاسم':'Name');
  safeText('profileBioLabel', currentLang==='ar'?'البايو':'Bio');
  safeText('profileWaLabel', currentLang==='ar'?'رقم الواتساب':'WhatsApp Number');
  safeText('saveProfileBtn', currentLang==='ar'?'حفظ التغييرات':'Save Changes');
  safeText('changePassTitle', currentLang==='ar'?'تغيير كلمة المرور':'Change Password');
  safeText('newPassLabel', currentLang==='ar'?'كلمة المرور الجديدة':'New Password');
  safeText('changePassBtn', currentLang==='ar'?'تغيير كلمة المرور':'Change Password');
  safeText('profileMyAdsTitle', currentLang==='ar'?'إعلاناتي':'My Listings');
  safeText('profileBackBtn', currentLang==='ar'?'العودة':'Back');

  const bio_ph = document.getElementById('editBio');
  if(bio_ph) bio_ph.placeholder = currentLang==='ar'?'أخبر الناس عنك...':'Tell people about yourself...';

  // Render my ads
  const container = document.getElementById('profileMyAds');
  if(!container) return;
  if(myAds.length===0){
    container.innerHTML=`<div style="text-align:center;padding:2rem;color:var(--grey)"><div style="font-size:2rem;opacity:.2;margin-bottom:.5rem">⌚</div><p style="font-size:.85rem">${currentLang==='ar'?'لا توجد إعلانات بعد':'No listings yet'}</p></div>`;
  } else {
    container.innerHTML = myAds.map(l=>{
      const locale = currentLang==='ar'?'ar-AE':'en-AE';
      const price = l.price?Number(l.price).toLocaleString(locale)+' AED':(currentLang==='ar'?'تفاوضي':'Negotiable');
      const img = l.images&&l.images[0]?`<img src="${l.images[0]}" style="width:60px;height:60px;object-fit:cover">`:`<div style="width:60px;height:60px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:1.2rem;opacity:.3">⌚</div>`;
      const statusLabel = l.status==='available'?(currentLang==='ar'?'نشط':'Active'):(currentLang==='ar'?'مُباع':'Sold');
      const statusColor = l.status==='available'?'var(--gold)':'var(--grey)';
      return `<div style="display:flex;align-items:center;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--border2);cursor:pointer" onclick="openDetail('${l.id}')">
        ${img}
        <div style="flex:1">
          <div style="font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)">${l.brand}</div>
          <div style="font-family:var(--serif);font-size:1rem;color:var(--white)">${l.model}</div>
          <div style="font-size:.75rem;color:var(--grey)">${price}</div>
        </div>
        <div style="font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:${statusColor}">${statusLabel}</div>
      </div>`;
    }).join('');
  }
}

async function saveProfile(){
  if(!currentUser) return;
  const name = document.getElementById('editName').value.trim();
  const bio = document.getElementById('editBio').value.trim();
  const wa = document.getElementById('editWa').value.trim().replace(/\D/g,'');

  if(!name){ toast(currentLang==='ar'?'يرجى إدخال الاسم':'Please enter your name'); return; }

  const btn = document.getElementById('saveProfileBtn');
  if(btn){ btn.disabled = true; btn.textContent = currentLang==='ar'?'جاري الحفظ...':'Saving...'; }

  try {
    // Persist to Supabase auth metadata
    const { error } = await sb.auth.updateUser({ data: { name, whatsapp: wa, bio } });
    if(error) throw error;
  } catch(e){
    toast('Error: '+e.message);
    if(btn){ btn.disabled = false; btn.textContent = currentLang==='ar'?'حفظ التغييرات':'Save Changes'; }
    return;
  }

  // Save to localStorage (for bio which isn't in auth metadata)
  localStorage.setItem('aurex_profile_'+currentUser.id, JSON.stringify({ name, bio, wa }));

  // Update currentUser in memory + session
  currentUser.name = name;
  currentUser.wa = wa;
  currentUser.bio = bio;
  localStorage.setItem('aurex_session', JSON.stringify(currentUser));
  updateNavForUser();

  if(btn){ btn.disabled = false; btn.textContent = currentLang==='ar'?'حفظ التغييرات':'Save Changes'; }
  loadProfile();
  toast(currentLang==='ar'?'تم حفظ التغييرات ✦':'Changes saved ✦');
}

async function changePassword(){
  const newPass = document.getElementById('newPass').value;
  if(newPass.length < 6){ toast(currentLang==='ar'?'كلمة المرور 6 أحرف على الأقل':'Password must be at least 6 characters'); return; }
  try {
    const {error} = await sb.auth.updateUser({ password: newPass });
    if(error) throw error;
    document.getElementById('newPass').value = '';
    toast(currentLang==='ar'?'تم تغيير كلمة المرور ✦':'Password changed ✦');
  } catch(e){
    toast('Error: '+e.message);
  }
}



function openAccountInfo(){
  if(!currentUser) return;
  const myAds = listings.filter(l=>l.userId===currentUser.id).length;
  document.getElementById('acctNameVal').textContent = currentUser.name;
  document.getElementById('acctWaVal').textContent = '+971 '+currentUser.wa;
  document.getElementById('acctAdsVal').textContent = myAds + (currentLang==='ar'?' إعلان':' listing(s)');
  document.getElementById('acctTitle').textContent = currentLang==='ar'?'معلومات الحساب':'Account Info';
  document.getElementById('acctNameLabel').textContent = currentLang==='ar'?'الاسم':'Name';
  document.getElementById('acctWaLabel').textContent = currentLang==='ar'?'رقم الواتساب':'WhatsApp';
  document.getElementById('acctAdsLabel').textContent = currentLang==='ar'?'إعلاناتي':'My Listings';
  document.getElementById('accountModal').classList.add('open');
}
