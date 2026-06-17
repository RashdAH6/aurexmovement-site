// auth.js — auth modal, login, register, forgot-password, logout, nav state.


// ════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════
function openModal(tab){
  document.getElementById('authModal').classList.add('open');
  switchTab(tab);
}
function closeModal(){
  document.getElementById('authModal').classList.remove('open');
  clearAuthError();
}
function switchTab(tab){
  document.getElementById('formLogin').style.display = tab==='login'?'block':'none';
  document.getElementById('formRegister').style.display = tab==='register'?'block':'none';
  document.getElementById('tabLogin').classList.toggle('active',tab==='login');
  document.getElementById('tabRegister').classList.toggle('active',tab==='register');
  clearAuthError();
}
function showAuthError(msg){ const e=document.getElementById('authError'); e.textContent=msg; e.classList.add('show'); }
function clearAuthError(){ document.getElementById('authError').classList.remove('show'); }

async function doRegister(){
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const wa = document.getElementById('regWA').value.trim().replace(/\D/g,'');
  const pass = document.getElementById('regPass').value;
  if(!name){ showAuthError(currentLang==='ar'?'يرجى إدخال الاسم':'Please enter your name'); return; }
  if(!email||!email.includes('@')){ showAuthError(currentLang==='ar'?'يرجى إدخال إيميل صحيح':'Please enter a valid email'); return; }
  if(wa.length < 7){ showAuthError(currentLang==='ar'?'يرجى إدخال رقم واتساب صحيح':'Please enter a valid WhatsApp number'); return; }
  if(pass.length < 6){ showAuthError(currentLang==='ar'?'كلمة المرور 6 أحرف على الأقل':'Password must be at least 6 characters'); return; }

  try {
    const {data, error} = await sb.auth.signUp({
      email, password: pass,
      options: { data: { name, whatsapp: wa } }
    });
    if(error) throw error;
    showAuthError(currentLang==='ar'
      ?'✅ تم التسجيل! تحقق من إيميلك لتأكيد الحساب'
      :'✅ Registered! Check your email to confirm your account');
    document.getElementById('authError').style.background='rgba(39,174,96,.12)';
    document.getElementById('authError').style.borderColor='rgba(39,174,96,.3)';
    document.getElementById('authError').style.color='#4ecb71';
  } catch(e){
    showAuthError(currentLang==='ar'?'خطأ: '+e.message:'Error: '+e.message);
  }
}

async function doLogin(){
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  if(!email){ showAuthError(currentLang==='ar'?'يرجى إدخال الإيميل':'Please enter your email'); return; }
  try {
    const {data, error} = await sb.auth.signInWithPassword({ email, password: pass });
    if(error) throw error;
    const user = data.user;
    const meta = user.user_metadata;
    loginUser({
      id: user.id,
      name: meta.name || email.split('@')[0],
      wa: meta.whatsapp || '',
      bio: meta.bio || '',
      avatar: meta.avatar_url || '',
      email: user.email
    });
  } catch(e){
    showAuthError(currentLang==='ar'?'إيميل أو كلمة مرور غير صحيحة':'Incorrect email or password');
  }
}

async function doForgotPassword(){
  const email = document.getElementById('loginEmail').value.trim();
  if(!email){ showAuthError(currentLang==='ar'?'أدخل إيميلك أولاً':'Enter your email first'); return; }
  try {
    await sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.href
    });
    showAuthError(currentLang==='ar'
      ?'✅ تم إرسال رابط إعادة تعيين كلمة المرور على إيميلك'
      :'✅ Password reset link sent to your email');
    document.getElementById('authError').style.background='rgba(39,174,96,.12)';
    document.getElementById('authError').style.borderColor='rgba(39,174,96,.3)';
    document.getElementById('authError').style.color='#4ecb71';
  } catch(e){
    showAuthError('Error: '+e.message);
  }
}

function loginUser(user){
  currentUser = user;
  localStorage.setItem('aurex_session', JSON.stringify(user));
  updateNavForUser();
  closeModal();
  toast((currentLang==='ar'?'أهلاً ':'Welcome ')+user.name+' 👋');
  if(postAfterAuth){ showView(postAfterAuth); postAfterAuth=null; }
}

function updateNavForUser(){
  const g = document.getElementById('navGuest');
  const u = document.getElementById('navUser');
  const a = document.getElementById('navAvatar');
  const dn = document.getElementById('dropdownName');
  const dw = document.getElementById('dropdownWa');
  if(currentUser){
    g.style.display='none'; u.style.display='flex';
    if(a){
      if(currentUser.avatar){ a.style.backgroundImage=`url("${currentUser.avatar}")`; a.style.backgroundSize='cover'; a.style.backgroundPosition='center'; a.textContent=''; }
      else { a.style.backgroundImage=''; a.textContent = currentUser.name.charAt(0).toUpperCase(); }
    }
    if(dn) dn.textContent = currentUser.name;
    if(dw) dw.textContent = '+971 '+currentUser.wa;
  } else {
    g.style.display='flex'; u.style.display='none';
    if(a){ a.style.backgroundImage=''; a.textContent='?'; }
  }
  refreshAdminUI();
}

async function logout(){
  if(!confirm(currentLang==='ar'?'تسجيل الخروج؟':'Log out?')) return;
  await sb.auth.signOut();
  currentUser = null;
  localStorage.removeItem('aurex_session');
  updateNavForUser();
  showView('home');
  toast(currentLang==='ar'?'تم تسجيل الخروج':'Logged out');
}
