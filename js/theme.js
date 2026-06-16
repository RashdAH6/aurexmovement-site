// theme.js — language/theme state vars + applyTheme / toggleTheme.

let currentLang = localStorage.getItem('aurex_lang')||'ar';
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

