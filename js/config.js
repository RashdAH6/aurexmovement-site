// config.js — Supabase client, early UI toggles, and global state.
// Part of the Aurex Movement app. Classic (non-module) script — load FIRST.

// ════════════════════════════════════════════════
// SUPABASE CONFIG
// ════════════════════════════════════════════════
const SUPABASE_URL = 'https://udfpwakssijojlsuvqjm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_pheGlJPG-oM5oPJqQAI1kQ_gYX7lnc_';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    flowType: 'implicit',        // token returned directly in the URL — robust for a static SPA
    detectSessionInUrl: true,    // auto-read the OAuth token on return
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Admin (you) — gates the in-app "Feature" controls. The REAL security is the RLS policy
// on featured_listings (admin email only); this check just shows/hides the buttons.
const ADMIN_EMAIL = 'rashed.alshamsi731@gmail.com';
function isAdmin(){ return !!(currentUser && currentUser.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()); }
// Show/hide elements tagged .admin-only depending on whether the current user is the admin.
function refreshAdminUI(){
  const show = isAdmin();
  document.querySelectorAll('.admin-only').forEach(e=>{ e.style.display = show ? (e.getAttribute('data-disp') || 'block') : 'none'; });
}

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

