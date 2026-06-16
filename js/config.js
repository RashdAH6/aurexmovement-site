// config.js — Supabase client, early UI toggles, and global state.
// Part of the Aurex Movement app. Classic (non-module) script — load FIRST.

// ════════════════════════════════════════════════
// SUPABASE CONFIG
// ════════════════════════════════════════════════
const SUPABASE_URL = 'https://udfpwakssijojlsuvqjm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_pheGlJPG-oM5oPJqQAI1kQ_gYX7lnc_';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Early function definitions (needed before DOM ready)
function toggleSettings(){
  const panel = document.getElementById('settingsPanel');
  if(panel) panel.classList.toggle('open');
}
function toggleAvatarMenu(){
  const d = document.getElementById('avatarDropdown');
  if(d) d.classList.toggle('open');
}
function closeAvatarMenu(){
  const d = document.getElementById('avatarDropdown');
  if(d) d.classList.remove('open');
}

// ════════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════════
let currentUser = null;
let listings = [];
let favorites = [];
let currentView = 'home';
let previousView = 'home';
let currentDetailId = null;
let currentImgSlot = 0;
let slotImages = [null,null,null,null];
let slotFiles = [null,null,null,null];
let postAfterAuth = null;
let editingListingId = null;

