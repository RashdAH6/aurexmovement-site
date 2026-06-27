// config.js — Supabase client, early UI toggles, and global state.
// Part of the Aurex Movement app. Classic (non-module) script — load FIRST.

// Capture any OAuth return params (#error / #access_token) synchronously, BEFORE the
// Supabase client auto-processes and clears the URL — so login errors can be surfaced.
window.__authReturn = (location.hash || '') + (location.search || '');

// Running inside the Aurex native app? React Native WebView injects window.ReactNativeWebView.
// Google OAuth is blocked by Google inside embedded WebViews, so we hide those buttons there
// (CSS: body.in-app .btn-google) and rely on email/password.
window.IS_IN_APP = !!window.ReactNativeWebView;
if (window.IS_IN_APP) {
  document.addEventListener('DOMContentLoaded', () => document.body.classList.add('in-app'));
}

// "Write with AI" seller helper — hidden until you add ANTHROPIC_API_KEY in Cloudflare.
// When the key is live, set AI_ENABLED to true and redeploy; the button reappears.
window.AI_ENABLED = false;
document.addEventListener('DOMContentLoaded', () => {
  if (!window.AI_ENABLED) { const b = document.getElementById('aiWriteBtn'); if (b) b.style.display = 'none'; }
});

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
// The OWNERS (super-admins): always full admin, and the only ones who manage staff.
const OWNER_EMAILS = ['rashed.alshamsi731@gmail.com', 'rashed@aurexmovement.com'];
const ADMIN_EMAIL = OWNER_EMAILS[0]; // primary owner (kept for legacy references)
function isOwner(){ return !!(currentUser && currentUser.email && OWNER_EMAILS.includes(currentUser.email.toLowerCase())); }
function isAdmin(){ return isOwner() || currentRole === 'admin'; }            // full access
function canModerate(){ return isAdmin() || currentRole === 'moderator'; }     // can hide/delete listings
// Show/hide UI by role: .admin-only = full admins; .mod-only = moderators + admins.
function refreshAdminUI(){
  document.querySelectorAll('.admin-only').forEach(e=>{ e.style.display = isAdmin() ? (e.getAttribute('data-disp') || 'block') : 'none'; });
  document.querySelectorAll('.mod-only').forEach(e=>{ e.style.display = canModerate() ? (e.getAttribute('data-disp') || 'block') : 'none'; });
}
// Look up the logged-in user's role from the DB (owner is always admin).
async function refreshRole(){
  if(!currentUser){ currentRole = null; refreshAdminUI(); return; }
  if(isOwner()){ currentRole = 'admin'; refreshAdminUI(); return; }
  try { const { data } = await sb.rpc('aurex_role'); currentRole = data || null; }
  catch(e){ currentRole = null; }
  refreshAdminUI();
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
let PLANS = null; // listing plans loaded from DB (falls back to the static AUREX_PLANS)
let favorites = [];
let currentView = 'home';
let previousView = 'home';
let currentDetailId = null;
let currentImgSlot = 0;
let slotImages = [null,null,null,null];
let slotFiles = [null,null,null,null];
let postAfterAuth = null;
let editingListingId = null;
let currentRole = null;   // 'admin' | 'moderator' | null — fetched from the staff list
let STAFF = [];           // staff list (owner view only)
let ANALYTICS = { views:0, contacts:0 };  // 7-day counts shown in the admin dashboard
let SETTINGS = {};        // app_settings key/value (payment info) — admin-editable, loaded in loadListings

