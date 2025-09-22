(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();class d{constructor(){this.isOpen=!1,this.currentMode="login",this.isLoading=!1,this.init()}init(){this.createModal(),this.attachEventListeners()}createModal(){document.body.insertAdjacentHTML("beforeend",`
      <div id="auth-modal" class="modern-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="auth-title">Entrar na sua conta</h2>
            <button class="modal-close" id="auth-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="auth-tabs">
              <button class="auth-tab active" data-mode="login">Entrar</button>
              <button class="auth-tab" data-mode="register">Criar Conta</button>
            </div>

            <!-- Login Social -->
            <div class="social-login">
              <button class="social-btn google-btn" id="google-login" type="button">
                <i class="fab fa-google"></i>
                Continuar com Google
              </button>
              <button class="social-btn linkedin-btn" id="linkedin-login" type="button">
                <i class="fab fa-linkedin-in"></i>
                Continuar com LinkedIn
              </button>
            </div>

            <div class="divider">
              <span>ou continue com e-mail</span>
            </div>

            <!-- Formulário -->
            <form id="auth-form" class="modern-form" novalidate>
              <div class="form-group" id="name-group" style="display: none;">
                <label for="full-name">Nome completo</label>
                <input type="text" id="full-name" name="full_name" placeholder="Digite seu nome completo">
                <div class="error-message" id="name-error"></div>
              </div>
              
              <div class="form-group">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" placeholder="Digite seu e-mail" required>
                <div class="error-message" id="email-error"></div>
              </div>
              
              <div class="form-group">
                <label for="password">Senha</label>
                <input type="password" id="password" name="password" placeholder="Digite sua senha" required>
                <div class="error-message" id="password-error"></div>
              </div>

              <button type="submit" class="btn btn-primary btn-full" id="auth-submit">
                <span class="btn-text">
                  <i class="fas fa-sign-in-alt"></i>
                  Entrar
                </span>
                <span class="btn-loading">
                  <i class="fas fa-spinner fa-spin"></i>
                  Processando...
                </span>
              </button>
            </form>

            <div class="auth-footer">
              <p id="auth-switch-text">
                Não tem uma conta? <a href="#" id="switch-mode">Criar conta gratuita</a>
              </p>
            </div>
          </div>

          <div id="auth-message" class="auth-message"></div>
        </div>
      </div>
    `)}attachEventListeners(){const e=document.getElementById("auth-modal"),t=document.getElementById("auth-close");e.addEventListener("click",r=>{r.target===e&&this.close()}),t.addEventListener("click",()=>{this.close()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&this.isOpen&&this.close()}),document.querySelectorAll(".auth-tab").forEach(r=>{r.addEventListener("click",a=>{a.preventDefault();const o=a.target.dataset.mode;this.switchMode(o)})}),document.getElementById("auth-form").addEventListener("submit",r=>{r.preventDefault(),this.handleFormSubmit()}),this.setupRealTimeValidation(),document.getElementById("google-login").addEventListener("click",r=>{r.preventDefault(),this.showMessage("Login social não disponível no momento","info")}),document.getElementById("linkedin-login").addEventListener("click",r=>{r.preventDefault(),this.showMessage("Login social não disponível no momento","info")})}setupRealTimeValidation(){const e=document.getElementById("email"),t=document.getElementById("password"),s=document.getElementById("full-name");e.addEventListener("blur",()=>{this.validateEmail(e.value)}),t.addEventListener("blur",()=>{this.validatePassword(t.value)}),s.addEventListener("blur",()=>{this.currentMode==="register"&&this.validateName(s.value)}),e.addEventListener("input",()=>{this.clearError("email-error"),e.classList.remove("error")}),t.addEventListener("input",()=>{this.clearError("password-error"),t.classList.remove("error")}),s.addEventListener("input",()=>{this.clearError("name-error"),s.classList.remove("error")})}validateEmail(e){const t=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,s=document.getElementById("email");return e?t.test(e)?(this.clearError("email-error"),s.classList.remove("error"),!0):(this.showFieldError("email-error","E-mail inválido"),s.classList.add("error"),!1):(this.showFieldError("email-error","E-mail é obrigatório"),s.classList.add("error"),!1)}validatePassword(e){const t=document.getElementById("password");return e?e.length<6?(this.showFieldError("password-error","Senha deve ter pelo menos 6 caracteres"),t.classList.add("error"),!1):(this.clearError("password-error"),t.classList.remove("error"),!0):(this.showFieldError("password-error","Senha é obrigatória"),t.classList.add("error"),!1)}validateName(e){const t=document.getElementById("full-name");return!e||e.trim().length<2?(this.showFieldError("name-error","Nome deve ter pelo menos 2 caracteres"),t.classList.add("error"),!1):(this.clearError("name-error"),t.classList.remove("error"),!0)}showFieldError(e,t){const s=document.getElementById(e);s.textContent=t,s.style.display="block"}clearError(e){const t=document.getElementById(e);t.textContent="",t.style.display="none"}open(e="login"){this.currentMode=e,this.switchMode(e),document.getElementById("auth-modal").style.display="flex",document.body.style.overflow="hidden",this.isOpen=!0,setTimeout(()=>{const t=document.querySelector('#auth-form input:not([style*="display: none"])');t&&t.focus()},100)}close(){document.getElementById("auth-modal").style.display="none",document.body.style.overflow="auto",this.isOpen=!1,this.clearForm(),this.clearMessage(),this.clearAllErrors()}switchMode(e){this.currentMode=e,document.querySelectorAll(".auth-tab").forEach(i=>{i.classList.toggle("active",i.dataset.mode===e)});const t=document.getElementById("name-group"),s=document.getElementById("auth-title"),r=document.getElementById("auth-submit"),a=document.getElementById("auth-switch-text");e==="login"?(s.textContent="Entrar na sua conta",r.querySelector(".btn-text").innerHTML='<i class="fas fa-sign-in-alt"></i> Entrar',t.style.display="none",a.innerHTML='Não tem uma conta? <a href="#" id="switch-mode">Criar conta gratuita</a>'):(s.textContent="Criar sua conta",r.querySelector(".btn-text").innerHTML='<i class="fas fa-user-plus"></i> Criar Conta',t.style.display="block",a.innerHTML='Já tem uma conta? <a href="#" id="switch-mode">Fazer login</a>'),document.getElementById("switch-mode").addEventListener("click",i=>{i.preventDefault();const n=this.currentMode==="login"?"register":"login";this.switchMode(n)}),this.clearForm(),this.clearMessage(),this.clearAllErrors()}async handleFormSubmit(){if(this.isLoading)return;const e=document.getElementById("email").value.trim(),t=document.getElementById("password").value,s=document.getElementById("full-name").value.trim();let r=!0;if(this.validateEmail(e)||(r=!1),this.validatePassword(t)||(r=!1),this.currentMode==="register"&&!this.validateName(s)&&(r=!1),!!r){this.setLoading(!0),this.showMessage("Processando...","info");try{let a;this.currentMode==="login"?a=await this.performLogin(e,t):a=await this.performRegister(e,t,s),a.success?(this.showMessage(a.message,"success"),this.currentMode==="login"?setTimeout(()=>{this.close(),this.handleSuccessfulAuth(a.user)},1500):setTimeout(()=>{this.close()},3e3)):this.showMessage(a.message,"error")}catch(a){console.error("Erro na autenticação:",a),this.showMessage("Erro inesperado. Tente novamente.","error")}finally{this.setLoading(!1)}}}async performLogin(e,t){if(!supabase)return this.performLocalAuth(e,t,"login");try{const{data:s,error:r}=await supabase.auth.signInWithPassword({email:e,password:t});return r?{success:!1,message:this.getErrorMessage(r)}:{success:!0,message:"Login realizado com sucesso!",user:s.user}}catch(s){return console.error("Erro no login:",s),{success:!1,message:"Erro ao fazer login. Tente novamente."}}}async performRegister(e,t,s){if(!supabase)return this.performLocalAuth(e,t,"register",s);try{const{data:r,error:a}=await supabase.auth.signUp({email:e,password:t,options:{data:{full_name:s}}});return a?{success:!1,message:this.getErrorMessage(a)}:{success:!0,message:"Conta criada com sucesso! Você já pode fazer login.",user:r.user}}catch(r){return console.error("Erro no registro:",r),{success:!1,message:"Erro ao criar conta. Tente novamente."}}}async handleSocialLogin(e){if(!supabase){this.showMessage("Login social não disponível no momento","error");return}this.setLoading(!0),this.showMessage("Redirecionando...","info");try{const{data:t,error:s}=await supabase.auth.signInWithOAuth({provider:e,options:{redirectTo:`${window.location.origin}/auth/callback`}});if(s)throw s}catch(t){console.error("Erro no login social:",t),this.showMessage(`Erro ao conectar com ${e==="google"?"Google":"LinkedIn"}`,"error"),this.setLoading(!1)}}async performLocalAuth(e,t,s,r=null){await this.delay(1e3);const a=JSON.parse(localStorage.getItem("app_users")||"[]");if(s==="login"){const o=a.find(i=>i.email===e&&i.password===t);return o?(localStorage.setItem("current_user",JSON.stringify(o)),{success:!0,message:"Login realizado com sucesso!",user:o}):{success:!1,message:"E-mail ou senha incorretos"}}else{if(a.find(n=>n.email===e))return{success:!1,message:"Este e-mail já está cadastrado"};const i={id:Date.now().toString(),email:e,password:t,user_metadata:{full_name:r},created_at:new Date().toISOString()};return a.push(i),localStorage.setItem("app_users",JSON.stringify(a)),localStorage.setItem("current_user",JSON.stringify(i)),{success:!0,message:"Conta criada com sucesso!",user:i}}}handleSuccessfulAuth(e){const t=new CustomEvent("userAuthenticated",{detail:{user:e}});document.dispatchEvent(t),setTimeout(()=>{window.location.reload()},500)}handleSignOut(){const e=new CustomEvent("userSignedOut");document.dispatchEvent(e)}setLoading(e){this.isLoading=e;const t=document.getElementById("auth-submit"),s=t.querySelector(".btn-text"),r=t.querySelector(".btn-loading");e?(s.style.display="none",r.style.display="inline-flex",t.disabled=!0):(s.style.display="inline-flex",r.style.display="none",t.disabled=!1)}showMessage(e,t){const s=document.getElementById("auth-message");s.textContent=e,s.className=`auth-message ${t}`,s.style.display="block"}clearMessage(){const e=document.getElementById("auth-message");e.style.display="none",e.textContent="",e.className="auth-message"}clearForm(){document.getElementById("auth-form").reset(),this.clearAllErrors()}clearAllErrors(){document.querySelectorAll(".error-message").forEach(e=>{e.textContent="",e.style.display="none"}),document.querySelectorAll(".form-group input").forEach(e=>{e.classList.remove("error")})}getErrorMessage(e){return{"Invalid login credentials":"E-mail ou senha incorretos","User already registered":"Este e-mail já está cadastrado","Password should be at least 6 characters":"A senha deve ter pelo menos 6 caracteres","Invalid email":"E-mail inválido","Email not confirmed":"E-mail não confirmado. Verifique sua caixa de entrada.",signup_disabled:"Cadastro temporariamente desabilitado","Email rate limit exceeded":"Muitas tentativas. Tente novamente em alguns minutos.","Signup requires a valid password":"Senha inválida"}[e.message]||e.message||"Erro desconhecido"}delay(e){return new Promise(t=>setTimeout(t,e))}}class u{constructor(){this.currentUser=null,this.userProfile=null,this.applications=[],this.init()}async init(){await this.checkCurrentUser(),this.setupAuthListeners(),this.updateUI()}setupAuthListeners(){document.addEventListener("userAuthenticated",e=>{this.handleUserSignIn(e.detail.user)}),document.addEventListener("userSignedOut",()=>{this.handleUserSignOut()})}async checkCurrentUser(){try{const e=localStorage.getItem("current_user");e&&(this.currentUser=JSON.parse(e),this.userProfile=this.currentUser)}catch(e){console.error("Erro ao verificar usuário atual:",e)}}async loadUserProfile(){if(!(!this.currentUser||!supabase))try{const{data:e,error:t}=await supabase.from("user_profiles").select("*").eq("id",this.currentUser.id).single();e&&!t?this.userProfile=e:t&&t.code==="PGRST116"&&await this.createUserProfile()}catch(e){console.error("Erro ao carregar perfil:",e)}}async createUserProfile(){var e,t,s;if(!(!this.currentUser||!supabase))try{const r={id:this.currentUser.id,email:this.currentUser.email,full_name:((e=this.currentUser.user_metadata)==null?void 0:e.full_name)||"",avatar_url:((t=this.currentUser.user_metadata)==null?void 0:t.avatar_url)||"",provider:((s=this.currentUser.app_metadata)==null?void 0:s.provider)||"email"},{data:a,error:o}=await supabase.from("user_profiles").insert([r]).select().single();a&&!o&&(this.userProfile=a)}catch(r){console.error("Erro ao criar perfil:",r)}}async loadUserApplications(){if(this.currentUser)try{const e=JSON.parse(localStorage.getItem(`applications_${this.currentUser.id}`)||"[]");this.applications=e}catch(e){console.error("Erro ao carregar candidaturas:",e)}}async handleUserSignIn(e){this.currentUser=e,supabase?(await this.loadUserProfile(),await this.loadUserApplications()):this.userProfile=e,this.updateUI(),this.setupUserPanelListeners()}handleUserSignOut(){var e;this.currentUser=null,this.userProfile=null,this.applications=[],supabase||localStorage.removeItem("current_user"),this.updateUI(),(window.location.hash==="#user-panel"||(e=document.getElementById("user-panel-page"))!=null&&e.classList.contains("active"))&&this.showPage("home")}updateUI(){const e=document.getElementById("login-btn"),t=document.getElementById("user-menu");this.currentUser?(e&&(e.style.display="none"),t?this.updateUserMenu():this.createUserMenu()):(e&&(e.style.display="inline-flex"),t&&t.remove())}createUserMenu(){const e=document.querySelector(".nav-menu"),t=this.getUserDisplayName(),r=`
      <li class="nav-item dropdown" id="user-menu">
        <a class="nav-link dropdown-toggle" href="#" id="user-dropdown-toggle">
          <img src="${this.getUserAvatar()}" 
               alt="Avatar" class="user-avatar"
               onerror="this.src='https://via.placeholder.com/32/004a8d/ffffff?text=${t.charAt(0).toUpperCase()}'">
          <span class="user-name">${t}</span>
          <i class="fas fa-chevron-down"></i>
        </a>
        <div class="dropdown-menu" id="user-dropdown-menu">
          <a href="#" class="dropdown-item" id="user-panel-link">
            <i class="fas fa-tachometer-alt"></i> Meu Painel
          </a>
          <a href="#" class="dropdown-item" id="profile-link">
            <i class="fas fa-user"></i> Meu Perfil
          </a>
          <a href="#" class="dropdown-item" id="applications-link">
            <i class="fas fa-briefcase"></i> Minhas Candidaturas
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item" id="logout-link">
            <i class="fas fa-sign-out-alt"></i> Sair
          </a>
        </div>
      </li>
    `;e.insertAdjacentHTML("beforeend",r),this.attachUserMenuListeners()}attachUserMenuListeners(){const e=document.getElementById("user-panel-link"),t=document.getElementById("profile-link"),s=document.getElementById("applications-link"),r=document.getElementById("logout-link");e==null||e.addEventListener("click",a=>{a.preventDefault(),this.showUserPanel("dashboard")}),t==null||t.addEventListener("click",a=>{a.preventDefault(),this.showUserPanel("profile")}),s==null||s.addEventListener("click",a=>{a.preventDefault(),this.showUserPanel("applications")}),r==null||r.addEventListener("click",async a=>{a.preventDefault(),await this.handleLogout()})}showUserPanel(e="dashboard"){this.showPage("user-panel"),this.updateUserPanelData(),e&&this.showPanelSection(e)}showPage(e){document.querySelectorAll(".page").forEach(s=>{s.classList.remove("active")});const t=document.getElementById(`${e}-page`);t&&t.classList.add("active"),document.querySelectorAll(".nav-link").forEach(s=>{s.classList.remove("active"),s.dataset.page===e&&s.classList.add("active")}),window.scrollTo(0,0)}showPanelSection(e){document.querySelectorAll(".panel-section").forEach(s=>{s.classList.remove("active")});const t=document.getElementById(`${e}-panel`);t&&t.classList.add("active"),document.querySelectorAll(".panel-nav .nav-item").forEach(s=>{s.classList.remove("active"),s.dataset.panel===e&&s.classList.add("active")})}setupUserPanelListeners(){document.querySelectorAll(".panel-nav .nav-item").forEach(i=>{i.addEventListener("click",n=>{n.preventDefault();const c=n.currentTarget.dataset.panel;this.showPanelSection(c)})});const e=document.getElementById("edit-avatar-btn"),t=document.getElementById("avatar-upload");e==null||e.addEventListener("click",()=>{t.click()}),t==null||t.addEventListener("change",i=>{this.handleAvatarUpload(i.target.files[0])});const s=document.getElementById("profile-form");s==null||s.addEventListener("submit",i=>{i.preventDefault(),this.handleProfileUpdate(i.target)});const r=document.getElementById("resume-file"),a=document.getElementById("resume-upload-area"),o=document.getElementById("remove-resume");a==null||a.addEventListener("click",()=>{r.click()}),r==null||r.addEventListener("change",i=>{this.handleResumeUpload(i.target.files[0])}),o==null||o.addEventListener("click",()=>{this.removeResume()})}updateUserPanelData(){if(!this.currentUser)return;const e=document.getElementById("user-name-display"),t=document.getElementById("user-email-display"),s=document.getElementById("user-avatar-display");e&&(e.textContent=this.getUserDisplayName()),t&&(t.textContent=this.currentUser.email),s&&(s.src=this.getUserAvatar(),s.onerror=()=>{s.src=`https://via.placeholder.com/80/004a8d/ffffff?text=${this.getUserDisplayName().charAt(0).toUpperCase()}`});const r=document.getElementById("applications-count"),a=document.getElementById("profile-views"),o=document.getElementById("resume-status");if(r&&(r.textContent=this.applications.length),a&&(a.textContent=Math.floor(Math.random()*50)+10),o){const i=localStorage.getItem(`resume_${this.currentUser.id}`);o.textContent=i?"Completo":"Incompleto"}this.fillProfileForm(),this.loadApplicationsList()}fillProfileForm(){if(!this.userProfile||!document.getElementById("profile-form"))return;const t={"profile-name":this.userProfile.full_name||"","profile-nickname":this.userProfile.nickname||"","profile-email":this.userProfile.email||"","profile-phone":this.userProfile.phone||"","profile-gender":this.userProfile.gender||"","profile-birthdate":this.userProfile.birth_date||"","profile-address":this.userProfile.address||""};Object.entries(t).forEach(([s,r])=>{const a=document.getElementById(s);a&&(a.value=r)})}loadApplicationsList(){const e=document.getElementById("applications-list");if(!e)return;if(this.applications.length===0){e.innerHTML=`
        <div class="empty-state">
          <i class="fas fa-briefcase"></i>
          <h3>Nenhuma candidatura ainda</h3>
          <p>Você ainda não se candidatou a nenhuma vaga. Explore nossas oportunidades!</p>
          <a href="#" class="btn btn-primary" data-page="vagas">Ver Vagas Disponíveis</a>
        </div>
      `;return}const t=this.applications.map(s=>`
      <div class="application-card">
        <div class="application-header">
          <div>
            <div class="application-title">${s.position}</div>
            <div class="application-date">Candidatura enviada em ${new Date(s.date).toLocaleDateString("pt-BR")}</div>
          </div>
          <span class="application-status status-${s.status}">${this.getStatusText(s.status)}</span>
        </div>
        <div class="application-details">
          <p><strong>Local:</strong> ${s.location||"Serra - ES"}</p>
          <p><strong>Tipo:</strong> ${s.type||"CLT"}</p>
          ${s.notes?`<p><strong>Observações:</strong> ${s.notes}</p>`:""}
        </div>
      </div>
    `).join("");e.innerHTML=t}getStatusText(e){return{pending:"Pendente",reviewing:"Em Análise",approved:"Aprovado",rejected:"Rejeitado"}[e]||"Pendente"}async handleAvatarUpload(e){if(e){if(!e.type.startsWith("image/")){this.showNotification("Por favor, selecione uma imagem válida","error");return}if(e.size>5*1024*1024){this.showNotification("A imagem deve ter no máximo 5MB","error");return}try{const t=new FileReader;t.onload=s=>{const r=s.target.result,a=document.getElementById("user-avatar-display");a&&(a.src=r),localStorage.setItem(`avatar_${this.currentUser.id}`,r),this.showNotification("Avatar atualizado com sucesso!","success")},t.readAsDataURL(e)}catch(t){console.error("Erro ao fazer upload do avatar:",t),this.showNotification("Erro ao atualizar avatar","error")}}}async handleProfileUpdate(e){const t=new FormData(e),s=Object.fromEntries(t);try{if(supabase&&this.userProfile){const{data:r,error:a}=await supabase.from("user_profiles").update({full_name:s.full_name,nickname:s.nickname,phone:s.phone,gender:s.gender,birth_date:s.birth_date||null,address:s.address,updated_at:new Date().toISOString()}).eq("id",this.currentUser.id).select().single();if(a)throw a;this.userProfile=r}else this.userProfile={...this.userProfile,...s},localStorage.setItem("current_user",JSON.stringify(this.userProfile));this.updateUI(),this.showNotification("Perfil atualizado com sucesso!","success")}catch(r){console.error("Erro ao atualizar perfil:",r),this.showNotification("Erro ao atualizar perfil","error")}}async handleResumeUpload(e){if(e){if(e.type!=="application/pdf"){this.showNotification("Por favor, selecione um arquivo PDF","error");return}if(e.size>10*1024*1024){this.showNotification("O arquivo deve ter no máximo 10MB","error");return}try{const t={name:e.name,size:e.size,uploadDate:new Date().toISOString()};localStorage.setItem(`resume_${this.currentUser.id}`,JSON.stringify(t)),this.showResumePreview(t),this.showNotification("Currículo enviado com sucesso!","success")}catch(t){console.error("Erro ao fazer upload do currículo:",t),this.showNotification("Erro ao enviar currículo","error")}}}showResumePreview(e){const t=document.getElementById("resume-upload-area"),s=document.getElementById("resume-preview"),r=document.getElementById("resume-filename"),a=document.getElementById("resume-filesize");t&&(t.style.display="none"),s&&(s.style.display="block"),r&&(r.textContent=e.name),a&&(a.textContent=this.formatFileSize(e.size))}removeResume(){localStorage.removeItem(`resume_${this.currentUser.id}`);const e=document.getElementById("resume-upload-area"),t=document.getElementById("resume-preview");e&&(e.style.display="block"),t&&(t.style.display="none"),this.showNotification("Currículo removido","info")}formatFileSize(e){if(e===0)return"0 Bytes";const t=1024,s=["Bytes","KB","MB","GB"],r=Math.floor(Math.log(e)/Math.log(t));return parseFloat((e/Math.pow(t,r)).toFixed(2))+" "+s[r]}async handleLogout(){if(confirm("Tem certeza que deseja sair?"))try{if(supabase){const{error:t}=await supabase.auth.signOut();if(t)throw t}else localStorage.removeItem("current_user"),this.handleUserSignOut();this.showNotification("Logout realizado com sucesso!","success"),setTimeout(()=>{window.location.reload()},1e3)}catch(t){console.error("Erro ao fazer logout:",t),this.showNotification("Erro ao fazer logout","error")}}addApplication(e){var s;const t={id:Date.now().toString(),...e,date:new Date().toISOString(),status:"pending"};this.applications.push(t),localStorage.setItem(`applications_${this.currentUser.id}`,JSON.stringify(this.applications)),(s=document.getElementById("applications-panel"))!=null&&s.classList.contains("active")&&this.loadApplicationsList()}updateUserMenu(){const e=document.querySelector(".user-name"),t=document.querySelector(".user-avatar");if(e&&(e.textContent=this.getUserDisplayName()),t){const s=this.getUserAvatar();t.src=s,t.onerror=()=>{t.src=`https://via.placeholder.com/32/004a8d/ffffff?text=${this.getUserDisplayName().charAt(0).toUpperCase()}`}}}getUserDisplayName(){var e,t,s,r;return(e=this.userProfile)!=null&&e.full_name?this.userProfile.full_name:(s=(t=this.currentUser)==null?void 0:t.user_metadata)!=null&&s.full_name?this.currentUser.user_metadata.full_name:(r=this.currentUser)!=null&&r.email?this.currentUser.email.split("@")[0]:"Usuário"}getUserAvatar(){var t,s,r,a;const e=localStorage.getItem(`avatar_${(t=this.currentUser)==null?void 0:t.id}`);return e||((s=this.userProfile)!=null&&s.avatar_url?this.userProfile.avatar_url:(a=(r=this.currentUser)==null?void 0:r.user_metadata)!=null&&a.avatar_url?this.currentUser.user_metadata.avatar_url:`https://via.placeholder.com/32/004a8d/ffffff?text=${this.getUserDisplayName().charAt(0).toUpperCase()}`)}showNotification(e,t="info"){const s=document.createElement("div");s.className=`notification notification-${t}`,s.innerHTML=`
      <div class="notification-content">
        <i class="fas fa-${t==="success"?"check-circle":t==="error"?"exclamation-circle":"info-circle"}"></i>
        <span>${e}</span>
      </div>
    `,s.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 20px;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      background: ${t==="success"?"#28a745":t==="error"?"#dc3545":"#007bff"};
    `,document.body.appendChild(s),setTimeout(()=>{s.style.animation="slideOutRight 0.3s ease-out",setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},300)},4e3)}isLoggedIn(){return!!this.currentUser}getUser(){return this.currentUser}getUserProfile(){return this.userProfile}getUserId(){var e;return((e=this.currentUser)==null?void 0:e.id)||null}getUserEmail(){var e;return((e=this.currentUser)==null?void 0:e.email)||null}}document.addEventListener("DOMContentLoaded",()=>{console.log("Inicializando sistema local...");const l=new d,e=new u,t=document.getElementById("login-btn");t?t.addEventListener("click",()=>{l.open("login")}):console.warn("Botão de login não encontrado"),typeof window<"u"&&(window.authModal=l,window.userManager=e,window.testAuth=()=>{console.log("Estado atual da autenticação:"),console.log("- Usuário logado:",e.isLoggedIn()),console.log("- Usuário atual:",e.getUser()),console.log("- Perfil do usuário:",e.getUserProfile()),console.log("- Sistema local ativo")})});
