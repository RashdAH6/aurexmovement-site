// theme.js — language/theme state vars + applyTheme / toggleTheme.

let currentLang = window.__aurexLang || localStorage.getItem('aurex_lang') || ((navigator.language||'en').toLowerCase().indexOf('ar')===0?'ar':'en');
let currentTheme = localStorage.getItem('aurex_theme')||'dark';

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme==='light'?'light':'dark');
  document.getElementById('themeToggle').checked = (theme==='dark');
  const pt = document.getElementById('profileThemeToggle'); if(pt) pt.checked = (theme==='dark');
  document.getElementById('themeLabel').textContent = T[currentLang].themeLabel;
  currentTheme = theme;
  localStorage.setItem('aurex_theme', theme);
}

function toggleTheme(isDark){
  applyTheme(isDark?'dark':'light');
}

