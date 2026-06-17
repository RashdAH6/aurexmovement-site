// post.js — post/edit listing form: char counters, images, upload, submit.

// POST LISTING
// ════════════════════════════════════════════════
function updateTitleCounter(){
  const el = document.getElementById('pTitle');
  const c  = document.getElementById('titleCounter');
  if(el && c) c.textContent = 100 - el.value.length;
}

function updateDescCounter(){
  const el = document.getElementById('pDesc');
  const c  = document.getElementById('descCounter');
  if(el && c) c.textContent = 1000 - el.value.length;
}

function resetPostForm(){
  slotImages=[null,null,null,null];
  slotFiles=[null,null,null,null];
  ['pTitle','pBrand','pModel','pRef','pYear','pDial','pCond','pSet','pDesc','pPrice','pWA','pCity','pMovement','pMaterial','pSize','pGender','pBracelet'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  updateTitleCounter();
  updateDescCounter();
  document.getElementById('pNeg').value='no';
  const pw=document.getElementById('pWarranty'); if(pw) pw.value='no';
  document.getElementById('pTerms').checked=false;
  document.getElementById('postPreview').classList.remove('show');
  document.getElementById('successBox').classList.remove('show');
  document.getElementById('postFormWrap').style.display='block';
  renderImgSlots();
  selectedPlan='free';
  if(typeof wizShow==='function') wizShow(1);
}

// ════════════════════════════════════════════════
// POST WIZARD (multi-step) + plan picker
// ════════════════════════════════════════════════
let wizStep = 1;
const WIZ_TOTAL = 4;
function wizShow(n){
  wizStep = Math.max(1, Math.min(WIZ_TOTAL, n));
  document.querySelectorAll('#postFormWrap .wstep').forEach(s=>{ s.hidden = (parseInt(s.dataset.step,10) !== wizStep); });
  const back=document.getElementById('wizBackBtn'), next=document.getElementById('wizNextBtn'), pub=document.getElementById('publishBtnEl');
  if(back) back.style.display = wizStep>1 ? '' : 'none';
  if(next) next.style.display = wizStep<WIZ_TOTAL ? '' : 'none';
  if(pub)  pub.style.display  = wizStep===WIZ_TOTAL ? '' : 'none';
  renderWizProgress();
  if(wizStep===WIZ_TOTAL){ renderPlanPicker(); if(typeof updatePreview==='function') updatePreview(); }
  const wrap=document.getElementById('post-page'); if(wrap) wrap.scrollIntoView({behavior:'smooth', block:'start'});
}
function wizBack(){ wizShow(wizStep-1); }
function wizNext(){ if(!wizValidate(wizStep)) return; wizShow(wizStep+1); }
function wizValidate(n){
  const ar = currentLang==='ar';
  const v = id => { const e=document.getElementById(id); return e ? e.value.trim() : ''; };
  if(n===1){
    if(!v('pTitle')){ toast(ar?'أدخل عنوان الإعلان':'Enter a listing title'); return false; }
    if(!v('pBrand')){ toast(ar?'اختر الماركة':'Choose a brand'); return false; }
    if(!v('pModel')){ toast(ar?'أدخل الموديل':'Enter the model'); return false; }
    if(!v('pCond')){ toast(ar?'اختر الحالة':'Choose the condition'); return false; }
  }
  if(n===2){
    if(!v('pPrice')){ toast(ar?'أدخل السعر':'Enter the price'); return false; }
    if((v('pWA')||'').replace(/\D/g,'').length<7){ toast(ar?'أدخل رقم واتساب صحيح':'Enter a valid WhatsApp number'); return false; }
  }
  return true;
}
function renderWizProgress(){
  const el=document.getElementById('wizProgress'); if(!el) return;
  const ar=currentLang==='ar';
  const labels = ar ? ['التفاصيل','السعر','الصور','الباقة'] : ['Details','Price','Photos','Plan'];
  el.innerHTML = labels.map((l,i)=>`<div class="wiz-pill ${i+1===wizStep?'active':''} ${i+1<wizStep?'done':''}"><span class="wiz-num">${i+1}</span>${l}</div>`).join('');
}

// Plans (Phase 1: static display; Phase 2 makes these admin-editable + enforced)
const AUREX_PLANS = [
  { id:'free',     name:{ar:'مجاني',en:'Free'},     price:0,     was:9.99, days:7,  featured:0,  refreshes:0, note:{ar:'مجاناً لفترة محدودة عند الإطلاق',en:'Free for a limited launch period'} },
  { id:'basic',    name:{ar:'أساسي',en:'Basic'},    price:19.99, days:30, featured:0,  refreshes:1 },
  { id:'featured', name:{ar:'مميّز',en:'Featured'}, price:29.99, days:30, featured:7,  refreshes:2, recommended:true },
  { id:'premium',  name:{ar:'بريميوم',en:'Premium'},price:59.99, days:60, featured:30, refreshes:4 },
];
let selectedPlan = 'free';
function selectPlan(id){ selectedPlan = id; renderPlanPicker(); }
function renderPlanPicker(){
  const wrap=document.getElementById('planGrid'); if(!wrap) return;
  const ar=currentLang==='ar';
  const plans = (typeof PLANS!=='undefined' && PLANS && PLANS.length) ? PLANS : AUREX_PLANS;
  wrap.innerHTML = plans.map(p=>{
    const price = p.price===0 ? (ar?'مجاني':'FREE') : p.price.toFixed(2)+' AED';
    const was = p.was ? `<span class="plan-was">${p.was.toFixed(2)} AED</span>` : '';
    const feats = [
      `${p.days} ${ar?'يوم':'days'}`,
      p.featured ? `${p.featured} ${ar?'يوم في المقدمة':'days at the top'}` : null,
      p.refreshes ? `${p.refreshes}× ${ar?'تحديث للأعلى':'refresh to top'}` : null,
    ].filter(Boolean);
    return `<div class="plan-card${selectedPlan===p.id?' sel':''}${p.recommended?' rec':''}" onclick="selectPlan('${p.id}')">
      ${p.recommended?`<div class="plan-badge">${ar?'موصى به':'Recommended'}</div>`:''}
      <div class="plan-name">${p.name[ar?'ar':'en']}</div>
      <div class="plan-price">${was}${price}</div>
      <ul class="plan-feats">${feats.map(f=>`<li>${f}</li>`).join('')}</ul>
      ${p.note?`<div class="plan-note">${p.note[ar?'ar':'en']}</div>`:''}
    </div>`;
  }).join('');
}

function renderImgSlots(){
  const mainLbl = currentLang==='ar'?'الصورة الرئيسية':'Main Photo';
  const addLbl = currentLang==='ar'?'إضافة':'Add';
  for(let i=0;i<4;i++){
    const slot=document.getElementById('slot'+i);
    if(!slot) continue;
    if(slotImages[i]){
      slot.innerHTML=`<img src="${slotImages[i]}"><div class="img-del" onclick="delImg(event,${i})">✕</div>`;
    } else {
      if(i===0) slot.innerHTML=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--grey)" stroke-width="1.5"><path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14l4-4 3 3 4-5z"/><circle cx="8.5" cy="8.5" r="1.5"/></svg><span>${mainLbl}</span>`;
      else slot.innerHTML=`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--grey)" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>${addLbl}</span>`;
    }
  }
}

function triggerImg(slot){ currentImgSlot=slot; document.getElementById('imgInput').click(); }

function handleImg(input){
  const file = input.files[0]; if(!file) return;
  slotFiles[currentImgSlot]=file;
  const reader=new FileReader();
  reader.onload=e=>{
    slotImages[currentImgSlot]=e.target.result;
    renderImgSlots();
    updatePreview();
  };
  reader.readAsDataURL(file);
  input.value='';
}

function delImg(e,i){ e.stopPropagation(); slotImages[i]=null; slotFiles[i]=null; renderImgSlots(); updatePreview(); }

async function uploadImages(){
  const urls = [];
  for(let i=0;i<4;i++){
    const file = slotFiles[i];
    if(file){
      try {
        const ext = (file.name.split('.').pop()||'jpg').toLowerCase();
        const path = `${currentUser.id}/${Date.now()}_${i}.${ext}`;
        const { error } = await sb.storage.from('listing-images')
          .upload(path, file, { contentType:file.type, upsert:false });
        if(error) throw error;
        const { data } = sb.storage.from('listing-images').getPublicUrl(path);
        urls.push(data.publicUrl);
      } catch(err){
        console.warn('Storage upload failed, using inline image:', err);
        if(slotImages[i]) urls.push(slotImages[i]);
      }
    } else if(slotImages[i]){
      urls.push(slotImages[i]);
    }
  }
  return urls;
}

function updatePreview(){
  const brand=document.getElementById('pBrand').value;
  const model=document.getElementById('pModel').value;
  const price=document.getElementById('pPrice').value;
  if(!brand&&!model) return;
  document.getElementById('postPreview').classList.add('show');
  document.getElementById('previewBrand').textContent=brand||'—';
  document.getElementById('previewModel').textContent=model||'—';
  document.getElementById('previewPrice').textContent=price?Number(price).toLocaleString('ar-AE')+' AED':'—';
  const pi=document.getElementById('previewImg');
  if(slotImages[0]) pi.innerHTML=`<img src="${slotImages[0]}" style="width:100%;height:100%;object-fit:cover">`;
}

async function submitListing(){
  const brand=document.getElementById('pBrand').value;
  const model=document.getElementById('pModel').value;
  const cond=document.getElementById('pCond').value;
  const price=document.getElementById('pPrice').value;
  const wa=document.getElementById('pWA').value.trim().replace(/\D/g,'');
  const terms=document.getElementById('pTerms').checked;

  if(!brand){ toast(currentLang==='ar'?'يرجى اختيار الماركة':'Please select a brand'); return; }
  if(!model){ toast(currentLang==='ar'?'يرجى إدخال الموديل':'Please enter the model'); return; }
  if(!wa||wa.length<7){ toast(currentLang==='ar'?'يرجى إدخال رقم الواتساب':'Please enter your WhatsApp number'); return; }
  if(!terms){ toast(currentLang==='ar'?'يرجى الموافقة على الشروط':'Please agree to the terms'); return; }

  const btn=document.getElementById('publishBtnEl');
  btn.textContent=currentLang==='ar'?'جاري النشر...':'Publishing...';
  btn.disabled=true;

  try {
    const newImageUrls = await uploadImages();

    // Keep existing images for slots where no new file was chosen
    let imageUrls = newImageUrls;
    if(editingListingId){
      const existing = listings.find(l => l.id === editingListingId);
      imageUrls = slotImages.map((img, i) => {
        if(slotFiles[i]) return newImageUrls.shift();  // new upload
        if(img && !img.startsWith('data:')) return img; // existing URL
        return null;
      }).filter(Boolean);
      if(!imageUrls.length && existing?.images?.length) imageUrls = existing.images;
    }

    const payload = {
      title: document.getElementById('pTitle').value.trim() || null,
      brand, model,
      ref_number: document.getElementById('pRef').value.trim(),
      year: document.getElementById('pYear').value.trim(),
      dial_color: document.getElementById('pDial').value.trim(),
      condition: cond,
      box_papers: document.getElementById('pSet').value,
      description: document.getElementById('pDesc').value.trim(),
      price: price||null,
      negotiable: document.getElementById('pNeg').value==='yes',
      whatsapp: wa,
      city: document.getElementById('pCity').value,
      movement: document.getElementById('pMovement').value,
      case_material: document.getElementById('pMaterial').value,
      case_size: document.getElementById('pSize').value ? parseInt(document.getElementById('pSize').value) : null,
      gender: document.getElementById('pGender').value,
      bracelet: document.getElementById('pBracelet').value,
      warranty: (document.getElementById('pWarranty')||{}).value === 'yes',
      images: imageUrls,
    };

    let error;
    if(editingListingId){
      ({ error } = await sb.from('listings').update(payload).eq('id', editingListingId).eq('user_id', currentUser.id));
    } else {
      const _plans = (typeof PLANS!=='undefined' && PLANS && PLANS.length) ? PLANS : (typeof AUREX_PLANS!=='undefined' ? AUREX_PLANS : []);
      const _plan = _plans.find(p=>p.id===selectedPlan) || _plans[0] || {id:'free',price:0,days:7,refreshes:0};
      const _free = (Number(_plan.price)||0) === 0;
      ({ error } = await sb.from('listings').insert([{
        ...payload,
        user_id: String(currentUser.id),
        user_name: currentUser.name,
        status: 'available',
        plan: _plan.id,
        plan_status: _free ? 'active' : 'pending',
        expires_at: new Date(Date.now() + (_plan.days||7)*86400000).toISOString(),
        refreshes_left: _plan.refreshes||0,
      }]));
    }
    if(error) throw error;

    const isEdit = !!editingListingId;
    editingListingId = null;
    document.getElementById('postFormWrap').style.display='none';
    document.getElementById('successBox').classList.add('show');
    toast(isEdit
      ? (currentLang==='ar'?'تم حفظ التعديلات ✦':'Changes saved ✦')
      : (currentLang==='ar'?'نُشر إعلانك بنجاح! ✦':'Listing published! ✦'));
    await loadListings(true); renderHomeGrid(); updateStatCount();
  } catch(e){
    console.error(e);
    toast(currentLang==='ar'?'خطأ: '+e.message:'Error: '+e.message);
    btn.textContent = editingListingId
      ? (currentLang==='ar'?'حفظ التعديلات':'Save Changes')
      : T[currentLang].publishBtn;
    btn.disabled=false;
  }
}

