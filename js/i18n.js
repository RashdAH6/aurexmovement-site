// i18n.js — translation table T + setLang / t / applyTranslations / renderTerms.

// ════════════════════════════════════════════════
// SETTINGS — THEME & LANGUAGE
// ════════════════════════════════════════════════
const T = {
  ar:{
    siteName:'Aurex Movement',
    heroBadge:'UAE & GCC · سوق الساعات الفاخرة',
    heroH1:'سوق <em>الساعات</em><br>الفاخرة',
    heroSub:'منصة حصرية لبيع وشراء الساعات الفاخرة الأصيلة في الإمارات والخليج',
    heroDivider:'بيع · شراء · تواصل مباشر',
    heroBrowse:'تصفح الإعلانات',
    heroPost:'+ أضف إعلانك',
    statLabel:'إعلان نشط',
    navMarket:'السوق',
    navLogin:'دخول',
    navRegister:'تسجيل',
    navAddAd:'+ أضف إعلان',
    navMyAds:'إعلاناتي',
    searchPlaceholder:'ابحث عن ساعة...',
    themeLabel:'الوضع الليلي',
    browseByBrand:'تصفح حسب الماركة',
    latestAds:'آخر الإعلانات',
    howTitle:'كيف يعمل السوق',
    howSub:'ثلاث خطوات <em>بسيطة</em>',
    step1t:'سجّل حسابك', step1s:'أنشئ حساباً بالاسم والواتساب في ثوانٍ',
    step2t:'أضف إعلانك', step2s:'ارفع صور ساعتك وحدد السعر والتفاصيل',
    step3t:'تواصل مباشرة', step3s:'المشترون يتواصلون معك عبر الواتساب مباشرة',
    viewAll:'عرض الكل',
    postTitle:'أضف <em>إعلانك</em>',
    postSub:'أضف تفاصيل ساعتك وسيظهر الإعلان فوراً في السوق',
    available:'متاحة', sold:'مُباعة', newBadge:'جديد',
    whatsapp:'واتساب', enquire:'استفسار', negotiable:'قابل',
    brandLabel:'الماركة', modelLabel:'الموديل', condLabel:'الحالة',
    priceLabel:'السعر (AED)', waLabel:'رقم الواتساب للتواصل',
    publishBtn:'نشر الإعلان الآن',
    successTitle:'نُشر الإعلان!',
    successText:'ساعتك الآن مرئية في سوق Aurex Movement. المشترون سيتواصلون معك مباشرة عبر الواتساب.',
    myAdsTitle:'إعلاناتي <em>الخاصة</em>',
    loginTab:'دخول', registerTab:'تسجيل جديد',
    loginBtn:'دخول', registerBtn:'إنشاء الحساب',
    markSoldBtn:'مُباع', deleteBtn:'حذف', relistBtn:'إعادة نشر',
    backBtn:'العودة', contactWa:'تواصل عبر الواتساب',
    filterBrand:'الماركة', filterCond:'الحالة', filterSet:'البوكس والأوراق',
    filterPrice:'نطاق السعر (AED)', resetFilter:'إعادة ضبط الفلاتر',
    sortNewest:'الأحدث', sortPriceAsc:'السعر: الأقل', sortPriceDesc:'السعر: الأعلى',
    noResults:'لا توجد نتائج', noResultsSub:'جرب تغيير الفلاتر',
    emptyMyAds:'لا توجد إعلانات بعد', emptyMyAdsSub:'أضف ساعتك الأولى الآن',
    addFirst:'أضف إعلاناً',
    specsBrand:'الماركة', specsModel:'الموديل', specsRef:'رقم المرجع',
    specsYear:'سنة الإنتاج', specsCond:'الحالة', specsSet:'البوكس والأوراق',
    specsDial:'لون الديال', specsCity:'الإمارة',
    sellerLabel:'بائع موثق', priceFixed:'السعر ثابت', priceNeg:'قابل للتفاوض',
    termsText:'أؤكد أن المعلومات المدخلة صحيحة وأن الساعة أصيلة 100%. أوافق على قواعد Aurex Movement للبيع والشراء.',
    emptyTitle:'لا توجد إعلانات بعد',
    emptySubTitle:'كن أول من ينشر ساعته!',
    emptyBtn:'أضف إعلانك الآن',
    listingsPageTitle:'سوق <em>الساعات</em>',
    listingsAddBtn:'+ أضف إعلانك',
    myadsNewBtn:'+ إعلان جديد',
    allListings:'جميع الإعلانات',
    postPreviewTitle:'◈ معاينة الإعلان',
    footerTerms:'الأمان والشروط',
    footerPrivacy:'سياسة الخصوصية',
    acctModalLogout:'تسجيل الخروج',
    dir:'rtl', lang:'ar',
  },
  en:{
    siteName:'Aurex Movement',
    heroBadge:'UAE & GCC · Luxury Watch Marketplace',
    heroH1:'Luxury <em>Watch</em><br>Marketplace',
    heroSub:'The exclusive platform to buy and sell authentic luxury watches in the UAE and GCC.',
    heroDivider:'Buy · Sell · Direct Contact',
    heroBrowse:'Browse Listings',
    heroPost:'+ List Your Watch',
    statLabel:'Active Listings',
    navMarket:'Market',
    navLogin:'Login',
    navRegister:'Register',
    navAddAd:'+ Add Listing',
    navMyAds:'My Ads',
    searchPlaceholder:'Search for a watch...',
    themeLabel:'Dark Mode',
    browseByBrand:'Browse by Brand',
    latestAds:'Latest Listings',
    howTitle:'How It Works',
    howSub:'Three <em>simple</em> steps',
    step1t:'Create Account', step1s:'Sign up with your name and WhatsApp in seconds',
    step2t:'Add Your Listing', step2s:'Upload photos, set your price and details',
    step3t:'Connect Directly', step3s:'Buyers contact you directly via WhatsApp',
    viewAll:'View All',
    postTitle:'Add Your <em>Listing</em>',
    postSub:'Add your watch details and your listing will appear in the market immediately',
    available:'Available', sold:'Sold', newBadge:'New',
    whatsapp:'WhatsApp', enquire:'Enquire', negotiable:'OBO',
    brandLabel:'Brand', modelLabel:'Model', condLabel:'Condition',
    priceLabel:'Price (AED)', waLabel:'WhatsApp Number for Contact',
    publishBtn:'Publish Listing Now',
    successTitle:'Listing Published!',
    successText:'Your watch is now live on the Aurex Movement marketplace. Buyers will contact you directly via WhatsApp.',
    myAdsTitle:'My <em>Listings</em>',
    loginTab:'Login', registerTab:'New Account',
    loginBtn:'Login', registerBtn:'Create Account',
    markSoldBtn:'Mark Sold', deleteBtn:'Delete', relistBtn:'Relist',
    backBtn:'Back', contactWa:'Contact on WhatsApp',
    filterBrand:'Brand', filterCond:'Condition', filterSet:'Box & Papers',
    filterPrice:'Price Range (AED)', resetFilter:'Reset Filters',
    sortNewest:'Newest', sortPriceAsc:'Price: Low to High', sortPriceDesc:'Price: High to Low',
    noResults:'No Results Found', noResultsSub:'Try adjusting your filters',
    emptyMyAds:'No listings yet', emptyMyAdsSub:'Add your first watch now',
    addFirst:'Add a Listing',
    specsBrand:'Brand', specsModel:'Model', specsRef:'Reference No.',
    specsYear:'Year', specsCond:'Condition', specsSet:'Box & Papers',
    specsDial:'Dial Color', specsCity:'Emirate',
    sellerLabel:'Verified Seller', priceFixed:'Fixed Price', priceNeg:'Price Negotiable',
    termsText:'I confirm that all information is accurate and the watch is 100% authentic. I agree to Aurex Movement\'s terms.',
    emptyTitle:'No listings yet',
    emptySubTitle:'Be the first to list your watch!',
    emptyBtn:'Add Your Listing Now',
    listingsPageTitle:'Watch <em>Market</em>',
    listingsAddBtn:'+ Add Listing',
    myadsNewBtn:'+ New Listing',
    allListings:'All Listings',
    postPreviewTitle:'◈ Listing Preview',
    footerTerms:'Safety & Terms',
    footerPrivacy:'Privacy Policy',
    acctModalLogout:'Log Out',
    dir:'ltr', lang:'en',
  }
};


function setLang(lang){
  currentLang = lang;
  localStorage.setItem('aurex_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', T[lang].dir);
  document.querySelectorAll('input,select,textarea,button').forEach(el=>{ el.style.fontFamily = lang==='ar'?"'Tajawal',sans-serif":"'Montserrat',sans-serif"; });
  document.body.style.fontFamily = lang==='ar'?"'Tajawal',sans-serif":"'Montserrat',sans-serif";
  document.getElementById('pillAr').classList.toggle('active', lang==='ar');
  document.getElementById('pillEn').classList.toggle('active', lang==='en');
  applyTranslations();
}

function t(key){ return T[currentLang][key]||T['ar'][key]||key; }

function applyTranslations(){
  const L = T[currentLang];
  // Back buttons
  safeText('detailBackTxt', L.backBtn);
  // Nav
  safeText('navSellBtn', currentLang==='ar'?'بيع ساعتك':'Sell a Watch');
  safeText('navLoginBtn', L.navLogin);
  safeText('navRegisterBtn', L.navRegister);
  safeText('navMyAdsBtn', L.navMyAds);
  // Sub-nav menu bar (desktop) — slimmed to 4: Buy · Brands · Top Dealers · Price Guide
  safeText('subMarket', currentLang==='ar'?'اشترِ ساعة':'Buy a Watch');
  safeText('subBrands', currentLang==='ar'?'الماركات':'Brands');
  safeText('subDealers', currentLang==='ar'?'كبار التجار':'Top Dealers');
  safeText('subAI', currentLang==='ar'?'دليل الأسعار':'Price Guide');
  // Bottom navigation labels
  safeText('bnavHomeLbl', currentLang==='ar'?'الرئيسية':'Home');
  safeText('bnavFavLbl', currentLang==='ar'?'المفضلة':'Saved');
  safeText('bnavSellLbl', currentLang==='ar'?'أضف':'Sell');
  safeText('bnavAILbl', currentLang==='ar'?'المساعد':'AI');
  safeText('bnavAccountLbl', currentLang==='ar'?'حسابي':'Profile');
  // AI price assistant view
  safeText('aiTitle', currentLang==='ar'?'المساعد الذكي':'AI Assistant');
  safeText('aiSub', currentLang==='ar'?'اسأل عن سعر أي ساعة وسأعطيك نطاق الأسعار على Aurex':'Ask about any watch’s price and I’ll give you the range on Aurex');
  const aiIn = document.getElementById('aiInput');
  if(aiIn) aiIn.placeholder = currentLang==='ar'?'مثال: Rolex Submariner':'e.g. Rolex Submariner';
  // Profile form labels (also set in loadProfile, but keep in sync on language switch)
  safeText('profileBackBtn', currentLang==='ar'?'العودة':'Back');
  safeText('editProfileTitle', currentLang==='ar'?'تعديل الملف الشخصي':'Edit Profile');
  safeText('profileNameLabel', currentLang==='ar'?'الاسم':'Name');
  safeText('profileBioLabel', currentLang==='ar'?'البايو':'Bio');
  safeText('profileWaLabel', currentLang==='ar'?'رقم الواتساب':'WhatsApp Number');
  safeText('saveProfileBtn', currentLang==='ar'?'حفظ التغييرات':'Save Changes');
  safeText('changePassTitle', currentLang==='ar'?'تغيير كلمة المرور':'Change Password');
  safeText('newPassLabel', currentLang==='ar'?'كلمة المرور الجديدة':'New Password');
  safeText('changePassBtn', currentLang==='ar'?'تغيير كلمة المرور':'Change Password');
  safeText('profileMyAdsTitle', currentLang==='ar'?'إعلاناتي':'My Listings');
  safeText('profileAdsLabel', currentLang==='ar'?'إعلان':'Listing');
  const _eb = document.getElementById('editBio'); if(_eb) _eb.placeholder = currentLang==='ar'?'أخبر الناس عنك...':'Tell people about yourself...';
  // Account-info modal
  safeText('acctTitle', currentLang==='ar'?'معلومات الحساب':'Account Info');
  safeText('acctNameLabel', currentLang==='ar'?'الاسم':'Name');
  safeText('acctWaLabel', currentLang==='ar'?'رقم الواتساب':'WhatsApp');
  safeText('acctAdsLabel', currentLang==='ar'?'إعلاناتي':'My Listings');
  // FAB settings panel
  safeText('settingsTitle', currentLang==='ar'?'⚙ الإعدادات':'⚙ Settings');
  safeText('settingsLangLabel', currentLang==='ar'?'اللغة':'Language');
  // Profile: settings + support sections
  safeText('profileSettingsTitle', currentLang==='ar'?'الإعدادات':'Settings');
  safeText('profileLangLabel', currentLang==='ar'?'اللغة':'Language');
  safeText('profileThemeLabel', currentLang==='ar'?'الوضع الليلي':'Dark Mode');
  safeText('profileSupportTitle', currentLang==='ar'?'الدعم والمعلومات':'Support & Info');
  safeText('profileHowLink', currentLang==='ar'?'كيف يعمل التطبيق':'How It Works');
  safeText('profileAccountLink', currentLang==='ar'?'معلومات الحساب':'Account Information');
  // How It Works / FAQ modal
  safeText('infoTitle', currentLang==='ar'?'كيف يعمل التطبيق':'How It Works');
  safeText('infoStep1T', currentLang==='ar'?'سجّل حسابك':'Create Account');
  safeText('infoStep1S', currentLang==='ar'?'أنشئ حساباً بالاسم والواتساب في ثوانٍ':'Sign up with your name and WhatsApp in seconds');
  safeText('infoStep2T', currentLang==='ar'?'أضف إعلانك':'Add Your Listing');
  safeText('infoStep2S', currentLang==='ar'?'ارفع صور ساعتك وحدد السعر والتفاصيل':'Upload photos, set your price and details');
  safeText('infoStep3T', currentLang==='ar'?'تواصل مباشرة':'Connect Directly');
  safeText('infoStep3S', currentLang==='ar'?'المشترون يتواصلون معك عبر الواتساب مباشرة':'Buyers contact you directly via WhatsApp');
  safeText('infoContact', currentLang==='ar'?'تواصل مع الدعم':'Contact Support');
  safeText('profileTermsLink', currentLang==='ar'?'الشروط والأحكام':'Terms & Conditions');
  safeText('profilePrivacyLink', currentLang==='ar'?'سياسة الخصوصية':'Privacy Policy');
  safeText('profileContactLink', currentLang==='ar'?'تواصل مع الدعم':'Contact Support');
  safeText('profileLogoutBtn', currentLang==='ar'?'تسجيل الخروج':'Log Out');
  const ppAr=document.getElementById('profilePillAr'); if(ppAr) ppAr.classList.toggle('active', currentLang==='ar');
  const ppEn=document.getElementById('profilePillEn'); if(ppEn) ppEn.classList.toggle('active', currentLang==='en');
  const si = document.getElementById('globalSearch');
  if(si) si.placeholder = L.searchPlaceholder;
  // Hero
  safeHTML('heroBadgeEl', L.heroBadge);
  safeHTML('heroH1El', L.heroH1);
  safeText('heroSubEl', L.heroSub);
  safeText('heroDividerEl', L.heroDivider);
  safeText('heroBrowseBtn', L.heroBrowse);
  safeText('heroPostBtn', L.heroPost);
  // Hero search
  safeText('heroSearchBtnLbl', currentLang==='ar'?'بحث':'Search');
  safeText('heroPopularLbl', currentLang==='ar'?'شائع:':'Popular:');
  safeText('heroPriceLbl', currentLang==='ar'?'حسب السعر:':'By price:');
  const hsi = document.getElementById('heroSearchInput');
  if(hsi) hsi.placeholder = currentLang==='ar'?'ابحث عن ساعة، ماركة، موديل...':'Search by watch, brand, model...';
  safeText('heroStatLabel', L.statLabel);
  safeText('howTitleEl', L.howTitle);
  safeHTML('howSubEl', L.howSub);
  safeText('step1Title', L.step1t); safeText('step1Sub', L.step1s);
  safeText('step2Title', L.step2t); safeText('step2Sub', L.step2s);
  safeText('step3Title', L.step3t); safeText('step3Sub', L.step3s);
  safeText('viewAllBtn', L.viewAll);
  safeHTML('postTitleEl', L.postTitle);
  safeText('postSubEl', L.postSub);
  safeHTML('myAdsTitleEl', L.myAdsTitle);
  safeText('publishBtnEl', L.publishBtn);
  safeText('themeLabel', L.themeLabel);
  safeHTML('browseByBrandEl', L.browseByBrand);
  safeHTML('latestAdsEl', L.latestAds);
  safeHTML('latestHeadingEl', currentLang==='ar'?'أحدث <em style="color:var(--gold);font-style:italic">الساعات</em>':'Latest <em style="color:var(--gold);font-style:italic">Watches</em>');
  safeText('topDealersTag', currentLang==='ar'?'كبار التجار':'Top Dealers');
  safeHTML('topDealersHeading', currentLang==='ar'?'أبرز <em style="color:var(--gold);font-style:italic">التجار</em>':'Top <em style="color:var(--gold);font-style:italic">Dealers</em>');
  // Home content tabs
  safeText('homeTabLatest', currentLang==='ar'?'أحدث':'Latest');
  safeText('homeTabDealers', currentLang==='ar'?'كبار التجار':'Top Dealers');
  safeText('homeTabBrands', currentLang==='ar'?'الماركات':'Brands');
  safeText('homeTabVerified', currentLang==='ar'?'موثّق':'Verified');
  safeText('brandsAllName', currentLang==='ar'?'عرض الكل':'View All');
  // Sidebar filter labels
  safeText('filterBrandLabel', L.filterBrand);
  safeText('filterCondLabel', L.filterCond);
  safeText('filterSetLabel', L.filterSet);
  safeText('filterPriceLabel', L.filterPrice);
  // Chrono24-style extra filters
  safeText('filterYearLabel', currentLang==='ar'?'سنة الإنتاج':'Year of Production');
  safeText('filterDialLabel', currentLang==='ar'?'لون الديال':'Dial Color');
  safeText('filterCityLabel', currentLang==='ar'?'الإمارة':'Emirate');
  safeText('filterRefLabel', currentLang==='ar'?'رقم المرجع':'Reference No.');
  safeText('filterMovementLabel', currentLang==='ar'?'الحركة':'Movement');
  safeText('filterMaterialLabel', currentLang==='ar'?'مادة العلبة':'Case Material');
  safeText('filterSizeLabel', currentLang==='ar'?'قياس العلبة (مم)':'Case Size (mm)');
  safeText('filterGenderLabel', currentLang==='ar'?'لمن':'Gender');
  safeText('filterBraceletLabel', currentLang==='ar'?'السوار':'Bracelet');
  safeText('filterToggleLbl', currentLang==='ar'?'الفلاتر':'Filters');
  safeText('drawerFilterTitle', currentLang==='ar'?'الفلاتر':'Filters');
  const fYearMin = document.getElementById('fYearMin'); if(fYearMin) fYearMin.placeholder = currentLang==='ar'?'من':'From';
  const fYearMax = document.getElementById('fYearMax'); if(fYearMax) fYearMax.placeholder = currentLang==='ar'?'إلى':'To';
  const fRef = document.getElementById('fRef'); if(fRef) fRef.placeholder = currentLang==='ar'?'مثال: 116610LN':'e.g. 116610LN';
  const fDialSel = document.getElementById('fDial');
  if(fDialSel){
    const dialNames = {Black:['أسود','Black'],Blue:['أزرق','Blue'],Green:['أخضر','Green'],White:['أبيض','White'],Silver:['فضي','Silver'],Grey:['رمادي','Grey'],Gold:['ذهبي','Gold'],Brown:['بني','Brown']};
    fDialSel.options[0].text = currentLang==='ar'?'الكل':'All';
    Array.from(fDialSel.options).forEach(o=>{ const m=dialNames[o.value]; if(m) o.text = currentLang==='ar'?m[0]:m[1]; });
  }
  const fCitySel = document.getElementById('fCity');
  if(fCitySel){
    const cityNames = {'دبي':'Dubai','أبوظبي':'Abu Dhabi','الشارقة':'Sharjah','عجمان':'Ajman','رأس الخيمة':'Ras Al Khaimah','الفجيرة':'Fujairah','أم القيوين':'Umm Al Quwain'};
    fCitySel.options[0].text = currentLang==='ar'?'الكل':'All';
    Array.from(fCitySel.options).forEach(o=>{ if(cityNames[o.value]) o.text = currentLang==='ar'?o.value:cityNames[o.value]; });
  }
  // Watch-spec dropdowns (movement/material/gender/bracelet) — filter + post forms
  const _movAr = {Automatic:'أوتوماتيك',Manual:'يدوي',Quartz:'كوارتز'};
  const _matAr = {'Steel':'ستيل','Yellow Gold':'ذهب أصفر','Rose Gold':'ذهب وردي','White Gold':'ذهب أبيض','Two-Tone':'مزدوج','Platinum':'بلاتين','Titanium':'تيتانيوم','Ceramic':'سيراميك'};
  const _genAr = {Men:'رجالي',Women:'نسائي',Unisex:'للجنسين'};
  const _braAr = {Steel:'ستيل',Gold:'ذهب',Leather:'جلد',Rubber:'مطاط',Other:'أخرى'};
  const _specSel = (id, fAr, fEn, map)=>{
    const s = document.getElementById(id); if(!s) return;
    Array.from(s.options).forEach(o=>{
      o.text = o.value==='' ? (currentLang==='ar'?fAr:fEn) : (currentLang==='ar'?(map[o.value]||o.value):o.value);
    });
  };
  _specSel('fMovement','الكل','All',_movAr);   _specSel('pMovement','اختر','Select',_movAr);
  _specSel('fMaterial','الكل','All',_matAr);   _specSel('pMaterial','اختر','Select',_matAr);
  _specSel('fGender','الكل','All',_genAr);     _specSel('pGender','اختر','Select',_genAr);
  _specSel('fBracelet','الكل','All',_braAr);   _specSel('pBracelet','اختر','Select',_braAr);
  safeText('resetFilterBtn', L.resetFilter);
  // Sort
  const sort = document.getElementById('sortSel');
  if(sort){ sort.options[0].text=L.sortNewest; sort.options[1].text=L.sortPriceAsc; sort.options[2].text=L.sortPriceDesc; }
  // Auth modal
  safeText('tabLogin', L.loginTab);
  safeText('tabRegister', L.registerTab);
  safeText('loginBtnEl', L.loginBtn);
  safeText('registerBtnEl', L.registerBtn);
  // Terms
  safeText('termsLabelEl', L.termsText);
  safeText('emptyTitle', L.emptyTitle);
  safeText('emptySubTitle', L.emptySubTitle);
  safeText('emptyBtn', L.emptyBtn);
  safeHTML('listingsPageTitle', L.listingsPageTitle);
  safeText('listingsAddBtn', L.listingsAddBtn);
  safeText('myadsNewBtn', L.myadsNewBtn);
  safeText('listingsCount', L.allListings);

  // Translate filter dropdown options
  const fBrand = document.getElementById('fBrand');
  if(fBrand){ 
    fBrand.options[0].text = currentLang==='ar'?'الكل':'All';
    // translate second to last option (أخرى)
    const lastOpt = fBrand.options[fBrand.options.length-1];
    if(lastOpt) lastOpt.text = currentLang==='ar'?'أخرى':'Other';
  }

  // Translate post brand select
  const pBrand = document.getElementById('pBrand');
  if(pBrand){ 
    pBrand.options[0].text = currentLang==='ar'?'اختر الماركة':'Select Brand';
    const lastPBrand = pBrand.options[pBrand.options.length-1];
    if(lastPBrand) lastPBrand.text = currentLang==='ar'?'أخرى':'Other';
  }

  const fCond = document.getElementById('fCond');
  if(fCond){
    const condOpts = currentLang==='ar'
      ?['الكل','جديدة','شبه جديدة','ممتازة','جيدة']
      :['All','New','Like New','Excellent','Good'];
    Array.from(fCond.options).forEach((o,i)=>{ if(condOpts[i]) o.text=condOpts[i]; });
  }

  const fSet = document.getElementById('fSet');
  if(fSet){
    const setOpts = currentLang==='ar'
      ?['الكل','Full Set','بدون بوكس','بوكس فقط','أوراق فقط']
      :['All','Full Set','No Box','Box Only','Papers Only'];
    Array.from(fSet.options).forEach((o,i)=>{ if(setOpts[i]) o.text=setOpts[i]; });
  }

  // Translate price placeholders
  const fMin = document.getElementById('fPriceMin');
  const fMax = document.getElementById('fPriceMax');
  if(fMin) fMin.placeholder = currentLang==='ar'?'من':'From';
  if(fMax) fMax.placeholder = currentLang==='ar'?'إلى':'To';

  // Translate listings empty state
  const lEmpty = document.getElementById('listingsEmpty');
  if(lEmpty){
    const p1 = lEmpty.querySelector('p:first-of-type');
    const p2 = lEmpty.querySelector('p:last-of-type');
    if(p1) p1.textContent = currentLang==='ar'?'لا توجد نتائج':'No Results Found';
    if(p2) p2.textContent = currentLang==='ar'?'جرب تغيير الفلاتر':'Try adjusting your filters';
  }

  const pCond = document.getElementById('pCond');
  if(pCond){
    const opts = currentLang==='ar'
      ?['اختر الحالة','جديدة','شبه جديدة','ممتازة','جيدة']
      :['Select Condition','New','Like New','Excellent','Good'];
    Array.from(pCond.options).forEach((o,i)=>{ if(opts[i]) o.text=opts[i]; });
  }

  const pSet = document.getElementById('pSet');
  if(pSet){
    const opts = currentLang==='ar'
      ?['اختر','Full Set (بوكس + أوراق)','بوكس فقط','أوراق فقط','بدون بوكس أو أوراق']
      :['Select','Full Set (Box + Papers)','Box Only','Papers Only','No Box or Papers'];
    Array.from(pSet.options).forEach((o,i)=>{ if(opts[i]) o.text=opts[i]; });
  }

  const pNeg = document.getElementById('pNeg');
  if(pNeg){
    pNeg.options[0].text = currentLang==='ar'?'السعر ثابت':'Fixed Price';
    pNeg.options[1].text = currentLang==='ar'?'قابل للتفاوض':'Negotiable';
  }

  const pCity = document.getElementById('pCity');
  if(pCity){
    const opts = currentLang==='ar'
      ?['اختر الإمارة','دبي','أبوظبي','الشارقة','عجمان','رأس الخيمة','الفجيرة','أم القيوين']
      :['Select Emirate','Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'];
    Array.from(pCity.options).forEach((o,i)=>{ if(opts[i]) o.text=opts[i]; });
  }

  // Translate auth modal labels
  safeText('loginEmailLabel', currentLang==='ar'?'الإيميل':'Email');
  safeText('forgotPassBtn', currentLang==='ar'?'نسيت كلمة المرور؟':'Forgot password?');
  safeText('switchToRegister', currentLang==='ar'?'سجّل الآن':'Register now');

  // Translate dropdown menu items
  safeText('dropMenuMyAds', currentLang==='ar'?'إعلاناتي':'My Listings');
  safeText('dropMenuFav', currentLang==='ar'?'المفضلة':'Favorites');
  safeHTML('favTitleEl', currentLang==='ar'?'المفضلة <em>الخاصة</em>':'My <em>Favorites</em>');
  safeText('favBrowseBtn', currentLang==='ar'?'تصفح السوق':'Browse Market');
  safeText('dropMenuAccount', currentLang==='ar'?'معلومات الحساب':'Account Info');
  safeText('dropMenuSettings', currentLang==='ar'?'ملفي الشخصي':'My Profile');
  safeText('dropMenuLogout', currentLang==='ar'?'تسجيل الخروج':'Log Out');

  // Auth modal full translation
  safeText('modalTitle', currentLang==='ar'?'مرحباً بك':'Welcome');
  safeText('modalSub', currentLang==='ar'?'سجّل دخولك للبيع والشراء':'Sign in to buy and sell');
  safeText('tabLogin', currentLang==='ar'?'دخول':'Login');
  safeText('tabRegister', currentLang==='ar'?'تسجيل جديد':'New Account');
  safeText('loginEmailLabel', currentLang==='ar'?'الإيميل':'Email');
  safeText('loginPassLabel', currentLang==='ar'?'كلمة المرور':'Password');
  safeText('loginBtnEl', currentLang==='ar'?'دخول':'Login');
  safeText('forgotPassBtn', currentLang==='ar'?'نسيت كلمة المرور؟':'Forgot password?');
  safeHTML('loginSwitchText', currentLang==='ar'
    ?'ليس لديك حساب؟ <a onclick="switchTab(\'register\')" id="switchToRegister">سجّل الآن</a>'
    :'Don\'t have an account? <a onclick="switchTab(\'register\')" id="switchToRegister">Register</a>');
  safeText('regNameLabel', currentLang==='ar'?'الاسم':'Name');
  safeText('regEmailLabel', currentLang==='ar'?'الإيميل':'Email');
  safeText('regWALabel', currentLang==='ar'?'رقم الواتساب':'WhatsApp Number');
  safeText('regWAHint', currentLang==='ar'?'سيظهر هذا الرقم للمشترين':'This number will be visible to buyers');
  safeText('regPassLabel', currentLang==='ar'?'كلمة المرور':'Password');
  safeText('registerBtnEl', currentLang==='ar'?'إنشاء الحساب':'Create Account');
  safeHTML('regTermsNote', currentLang==='ar'
    ?'بإنشاء حسابك، أنت توافق على <a href="/terms" target="_blank" rel="noopener" style="color:var(--gold);cursor:pointer;text-decoration:underline">الشروط والأحكام</a>'
    :'By creating an account, you agree to our <a href="/terms" target="_blank" rel="noopener" style="color:var(--gold);cursor:pointer;text-decoration:underline">Terms & Conditions</a>');
  safeHTML('registerSwitchText', currentLang==='ar'
    ?'لديك حساب؟ <a onclick="switchTab(\'login\')" id="switchToLogin">دخول</a>'
    :'Already have an account? <a onclick="switchTab(\'login\')" id="switchToLogin">Login</a>');

  // Register input placeholders
  const rn = document.getElementById('regName'); if(rn) rn.placeholder = currentLang==='ar'?'اسمك الكامل':'Full name';
  const rp = document.getElementById('regPass'); if(rp) rp.placeholder = currentLang==='ar'?'6 أحرف على الأقل':'At least 6 characters';

  // Hero stats
  safeText('heroStatGCC', currentLang==='ar'?'الإمارات والخليج':'UAE & GCC');
  safeText('heroStatDirect', currentLang==='ar'?'تواصل مباشر':'Direct Contact');

  // Brands section
  safeHTML('brandsTitle', currentLang==='ar'?'الماركات <em style="color:var(--gold);font-style:italic">المتاحة</em>':'Available <em style="color:var(--gold);font-style:italic">Brands</em>');
  const brandAll = document.getElementById('brandPillAll');
  if(brandAll){
    const nm = brandAll.querySelector('.brand-card-name');
    const sb2 = brandAll.querySelector('.brand-card-sub');
    if(nm) nm.textContent = currentLang==='ar'?'عرض الكل':'View All';
    if(sb2) sb2.textContent = currentLang==='ar'?'جميع الماركات':'All Brands';
  }
  // Localize brand-card location subtitles (skip the View All card handled above)
  document.querySelectorAll('.brand-card-sub[data-ar]').forEach(el=>{
    const txt = currentLang==='ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if(txt) el.textContent = txt;
  });

  // Contact translations
  safeText('contactFormTitle', currentLang==='ar'?'تواصل معنا':'Contact Us');
  safeText('contactBlurb', currentLang==='ar'?'عندك سؤال أو ملاحظة؟ راسلنا مباشرة وبنرد عليك بأسرع وقت':'Have a question or feedback? Email us directly and we\'ll get back to you soon');
  const ceb = document.getElementById('contactEmailBtn');
  if(ceb){
    const icon = ceb.querySelector('svg').outerHTML;
    ceb.innerHTML = icon + (currentLang==='ar'?'راسلنا عبر الإيميل':'Email Us');
  }

  // Post form — section titles
  safeText('postSecImages', currentLang==='ar'?'الصور':'Photos');
  safeText('postSecDetails', currentLang==='ar'?'تفاصيل الساعة':'Watch Details');
  safeText('postSecPrice', currentLang==='ar'?'السعر والتواصل':'Price & Contact');

  // Post form — image notes
  safeText('imgNote', currentLang==='ar'?'JPG, PNG حتى 10MB لكل صورة':'JPG, PNG up to 10MB per image');
  safeText('imgMainNote', currentLang==='ar'?'◈ الصورة الأولى ستظهر كصورة رئيسية في الإعلان':'◈ The first photo will be the main image of the listing');

  // Post form — image slot labels
  const slot0span = document.querySelector('#slot0 span:last-child');
  if(slot0span && !slotImages[0]) slot0span.textContent = currentLang==='ar'?'الصورة الرئيسية':'Main Photo';
  [1,2,3].forEach(i=>{ const s=document.querySelector('#slot'+i+' span:last-child'); if(s && !slotImages[i]) s.textContent = currentLang==='ar'?'إضافة':'Add'; });

  // Post form — field labels (with required asterisk)
  const req = '<span>*</span>';
  safeHTML('lblTitle', (currentLang==='ar'?'عنوان الإعلان ':'Listing Title ')+req);
  safeText('titleHint', currentLang==='ar'
    ?'اكتب العنوان بالإنجليزي — الماركة + الموديل + الرقم المرجعي + السنة + المدينة'
    :'Write in English — Brand + Model + Ref + Year + City');
  const pTitleEl = document.getElementById('pTitle');
  if(pTitleEl) pTitleEl.placeholder = currentLang==='ar'
    ?'مثال: Rolex Datejust 126300 Silver 2022 Full Set Dubai'
    :'e.g. Rolex Datejust 126300 Silver 2022 Full Set Dubai';
  safeHTML('lblBrand', (currentLang==='ar'?'الماركة ':'Brand ')+req);
  safeHTML('lblModel', (currentLang==='ar'?'الموديل ':'Model ')+req);
  safeText('lblRef', currentLang==='ar'?'رقم المرجع (Ref.)':'Reference No. (Ref.)');
  safeText('lblYear', currentLang==='ar'?'سنة الإنتاج':'Year');
  safeText('lblDial', currentLang==='ar'?'لون الديال':'Dial Color');
  safeText('lblMovement', currentLang==='ar'?'الحركة':'Movement');
  safeText('lblMaterial', currentLang==='ar'?'مادة العلبة':'Case Material');
  safeText('lblSize', currentLang==='ar'?'قياس العلبة (مم)':'Case Size (mm)');
  safeText('lblGender', currentLang==='ar'?'لمن':'Gender');
  safeText('lblBracelet', currentLang==='ar'?'السوار':'Bracelet');
  safeHTML('lblCond', (currentLang==='ar'?'الحالة ':'Condition ')+req);
  safeText('lblSet', currentLang==='ar'?'البوكس والأوراق':'Box & Papers');
  safeText('lblDesc', currentLang==='ar'?'وصف الساعة':'Watch Description');
  safeHTML('lblPrice', (currentLang==='ar'?'السعر (AED) ':'Price (AED) ')+req);
  safeText('lblNeg', currentLang==='ar'?'قابلية التفاوض':'Negotiable');
  safeHTML('lblWA', (currentLang==='ar'?'رقم الواتساب للتواصل ':'WhatsApp Number ')+req);
  safeText('hintWA', currentLang==='ar'?'سيظهر هذا الرقم للمشترين للتواصل معك مباشرة':'This number will be shown to buyers to contact you directly');
  safeText('lblCity', currentLang==='ar'?'الإمارة':'Emirate');

  // Post form — input placeholders
  const ph = (id,ar,en)=>{ const el=document.getElementById(id); if(el) el.placeholder = currentLang==='ar'?ar:en; };
  ph('pModel','مثال: Submariner، Nautilus...','e.g. Submariner, Nautilus...');
  ph('pRef','مثال: 116610LN','e.g. 116610LN');
  ph('pYear','مثال: 2021','e.g. 2021');
  ph('pDial','مثال: أسود، أزرق...','e.g. Black, Blue...');
  ph('pDesc','اكتب أي تفاصيل إضافية تريد أن يعرفها المشتري...','Add any extra details you want buyers to know...');
  ph('pPrice','مثال: 45000','e.g. 45000');
  ph('pSize','مثال: 41','e.g. 41');

  // Post form — pSet box/papers options
  const pSetEl = document.getElementById('pSet');
  if(pSetEl){
    const o = currentLang==='ar'
      ?['اختر','Full Set (بوكس + أوراق)','بوكس فقط','أوراق فقط','بدون بوكس أو أوراق']
      :['Select','Full Set (Box + Papers)','Box Only','Papers Only','No Box or Papers'];
    Array.from(pSetEl.options).forEach((opt,i)=>{ if(o[i]) opt.text=o[i]; });
  }

  // Post form — publish helper note
  safeText('publishHint', currentLang==='ar'?'سيظهر إعلانك فوراً في السوق بعد النشر':'Your listing will appear in the market immediately after publishing');

  // Success page (after publishing)
  safeText('successTitleEl', currentLang==='ar'?'نُشر الإعلان!':'Listing Published!');
  safeText('successTextEl', currentLang==='ar'?'ساعتك الآن مرئية في سوق Aurex Movement. المشترون سيتواصلون معك مباشرة عبر الواتساب.':'Your watch is now live on the Aurex Movement marketplace. Buyers will contact you directly via WhatsApp.');
  safeText('successBrowseBtn', currentLang==='ar'?'تصفح السوق':'Browse Market');
  safeText('successMyAdsBtn', currentLang==='ar'?'إعلاناتي':'My Listings');

  // Terms page
  safeText('termsBackTxt', currentLang==='ar'?'العودة':'Back');
  safeText('termsPageTitle', currentLang==='ar'?'الشروط والأحكام':'Terms & Conditions');
  safeText('termsUpdated', currentLang==='ar'?'آخر تحديث: يونيو 2026':'Last updated: June 2026');
  renderTerms();

  // Footer links
  safeText('footerHowLink', currentLang==='ar'?'كيف يعمل':'How It Works');
  safeText('footerTermsLink', L.footerTerms);
  safeText('footerPrivacyLink', L.footerPrivacy);
  // Admin dashboard (admin only)
  safeText('adminTitle', currentLang==='ar'?'لوحة الإدارة':'Admin dashboard');
  safeText('dropMenuAdmin', currentLang==='ar'?'لوحة الإدارة':'Admin dashboard');
  safeText('profileAdminLbl', currentLang==='ar'?'لوحة الإدارة':'Admin dashboard');
  const _adminS = document.getElementById('adminSearch'); if(_adminS) _adminS.placeholder = currentLang==='ar'?'ابحث عن ساعة أو تاجر...':'Search watches or dealers...';
  if(typeof currentView!=='undefined' && currentView==='admin' && typeof renderAdmin==='function') renderAdmin();
  // Dealer storefront
  safeText('dealerBackLbl', currentLang==='ar'?'‹ رجوع':'‹ Back');
  // Google sign-in labels
  safeText('googleLoginLbl', currentLang==='ar'?'المتابعة مع Google':'Continue with Google');
  safeText('googleRegisterLbl', currentLang==='ar'?'المتابعة مع Google':'Continue with Google');
  safeText('authOrLbl1', currentLang==='ar'?'أو':'or');
  safeText('authOrLbl2', currentLang==='ar'?'أو':'or');
  if(typeof currentView!=='undefined' && currentView==='dealer' && typeof renderDealer==='function') renderDealer();

  // Post preview title
  safeText('postPreviewTitle', L.postPreviewTitle);

  // Account modal logout
  safeText('acctModalLogout', L.acctModalLogout);

  // Re-render grids to pick up new labels
  renderHomeGrid();
  if(currentView==='listings') filterListings();
  if(currentView==='myads') renderMyAds();
}

function renderTerms(){
  const body = document.getElementById('termsBody');
  if(!body) return;
  const ar = [
    ['طبيعة المنصة','Aurex Movement منصة إعلانات تتيح لأصحاب الساعات عرض ساعاتهم للبيع والتواصل مع المشترين مباشرةً. نحن وسيط عرض فقط، ولسنا طرفاً في أي عملية بيع أو شراء، ولا نملك أو نبيع أو نضمن أي ساعة معروضة على المنصة.'],
    ['مسؤولية البائع','البائع وحده مسؤول عن صحة المعلومات والصور وأصالة الساعة وحالتها وسعرها. بنشر أي إعلان، يقرّ البائع أن الساعة أصلية وأن جميع التفاصيل صحيحة، وأنه يملك الحق في بيعها.'],
    ['الصفقات بين الطرفين','جميع المفاوضات والمدفوعات والتسليم تتم مباشرةً بين البائع والمشتري خارج المنصة. Aurex Movement لا تتدخل في الدفع ولا تتحمّل أي مسؤولية عن الأموال أو السلع أو أي نزاع ينشأ بين الطرفين.'],
    ['التحقق والاحتيال','ننصح المشترين بفحص الساعة والتحقق من أصالتها قبل الدفع. نحتفظ بحق حذف أي إعلان مخالف أو مشبوه أو كاذب دون إشعار مسبق.'],
    ['المحتوى الممنوع','يُمنع نشر إعلانات لساعات مقلّدة أو مسروقة أو غير قانونية، أو أي محتوى مخالف للأنظمة في دولة الإمارات. أي مخالفة قد تؤدي لحذف الحساب.'],
    ['حدود المسؤولية','تُقدَّم المنصة "كما هي". لا نضمن استمرار الخدمة دون انقطاع، ولا نتحمّل أي خسائر مباشرة أو غير مباشرة ناتجة عن استخدام الموقع أو التعامل مع المستخدمين الآخرين.'],
    ['الخصوصية','نجمع فقط البيانات اللازمة لتشغيل المنصة (الاسم، الإيميل، رقم الواتساب). رقم الواتساب يظهر للمشترين بغرض التواصل. لا نبيع بياناتك لأي طرف ثالث.'],
    ['التواصل','لأي استفسار أو بلاغ عن إعلان مخالف، راسلنا على support@aurexmovement.com']
  ];
  const en = [
    ['Nature of the Platform','Aurex Movement is a listings platform that lets watch owners showcase their watches for sale and connect with buyers directly. We are a listing intermediary only — not a party to any sale, and we do not own, sell, or guarantee any watch listed on the platform.'],
    ['Seller Responsibility','The seller is solely responsible for the accuracy of the information, photos, authenticity, condition, and price of the watch. By posting a listing, the seller confirms the watch is authentic, all details are correct, and they have the right to sell it.'],
    ['Transactions Between Parties','All negotiations, payments, and delivery happen directly between buyer and seller, off the platform. Aurex Movement is not involved in payment and bears no responsibility for funds, goods, or any dispute arising between the parties.'],
    ['Verification & Fraud','We advise buyers to inspect the watch and verify its authenticity before paying. We reserve the right to remove any violating, suspicious, or fraudulent listing without prior notice.'],
    ['Prohibited Content','Listings for counterfeit, stolen, or illegal watches — or any content that violates UAE laws — are prohibited. Any violation may result in account removal.'],
    ['Limitation of Liability','The platform is provided "as is". We do not guarantee uninterrupted service, and we are not liable for any direct or indirect losses arising from using the site or dealing with other users.'],
    ['Privacy','We collect only the data needed to run the platform (name, email, WhatsApp number). Your WhatsApp number is shown to buyers for contact purposes. We do not sell your data to any third party.'],
    ['Contact','For any inquiry or to report a violating listing, email us at support@aurexmovement.com']
  ];
  const items = currentLang==='ar'?ar:en;
  body.innerHTML = items.map((s,i)=>`
    <div style="margin-bottom:1.8rem">
      <h3 style="font-family:var(--serif);font-size:1.25rem;color:var(--gold);font-weight:400;margin-bottom:.5rem">${i+1}. ${s[0]}</h3>
      <p style="font-size:.88rem;color:var(--grey);line-height:1.9">${s[1]}</p>
    </div>
  `).join('');
}

