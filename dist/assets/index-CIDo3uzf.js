(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();class d{constructor(){this.isOpen=!1,this.currentMode="login",this.isLoading=!1,this.init()}init(){this.createModal(),this.attachEventListeners()}createModal(){document.body.insertAdjacentHTML("beforeend",`
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
    `)}attachEventListeners(){const e=document.getElementById("auth-modal"),t=document.getElementById("auth-close");e.addEventListener("click",a=>{a.target===e&&this.close()}),t.addEventListener("click",()=>{this.close()}),document.addEventListener("keydown",a=>{a.key==="Escape"&&this.isOpen&&this.close()}),document.querySelectorAll(".auth-tab").forEach(a=>{a.addEventListener("click",r=>{r.preventDefault();const i=r.target.dataset.mode;this.switchMode(i)})}),document.getElementById("auth-form").addEventListener("submit",a=>{a.preventDefault(),this.handleFormSubmit()}),this.setupRealTimeValidation(),document.getElementById("google-login").addEventListener("click",a=>{a.preventDefault(),this.handleSocialLogin("google")}),document.getElementById("linkedin-login").addEventListener("click",a=>{a.preventDefault(),this.handleSocialLogin("linkedin")})}setupRealTimeValidation(){const e=document.getElementById("email"),t=document.getElementById("password"),s=document.getElementById("full-name");e.addEventListener("blur",()=>{this.validateEmail(e.value)}),t.addEventListener("blur",()=>{this.validatePassword(t.value)}),s.addEventListener("blur",()=>{this.currentMode==="register"&&this.validateName(s.value)}),e.addEventListener("input",()=>{this.clearError("email-error"),e.classList.remove("error")}),t.addEventListener("input",()=>{this.clearError("password-error"),t.classList.remove("error")}),s.addEventListener("input",()=>{this.clearError("name-error"),s.classList.remove("error")})}validateEmail(e){const t=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,s=document.getElementById("email");return e?t.test(e)?(this.clearError("email-error"),s.classList.remove("error"),!0):(this.showFieldError("email-error","E-mail inválido"),s.classList.add("error"),!1):(this.showFieldError("email-error","E-mail é obrigatório"),s.classList.add("error"),!1)}validatePassword(e){const t=document.getElementById("password");return e?e.length<6?(this.showFieldError("password-error","Senha deve ter pelo menos 6 caracteres"),t.classList.add("error"),!1):(this.clearError("password-error"),t.classList.remove("error"),!0):(this.showFieldError("password-error","Senha é obrigatória"),t.classList.add("error"),!1)}validateName(e){const t=document.getElementById("full-name");return!e||e.trim().length<2?(this.showFieldError("name-error","Nome deve ter pelo menos 2 caracteres"),t.classList.add("error"),!1):(this.clearError("name-error"),t.classList.remove("error"),!0)}showFieldError(e,t){const s=document.getElementById(e);s.textContent=t,s.style.display="block"}clearError(e){const t=document.getElementById(e);t.textContent="",t.style.display="none"}open(e="login"){this.currentMode=e,this.switchMode(e),document.getElementById("auth-modal").style.display="flex",document.body.style.overflow="hidden",this.isOpen=!0,setTimeout(()=>{const t=document.querySelector('#auth-form input:not([style*="display: none"])');t&&t.focus()},100)}close(){document.getElementById("auth-modal").style.display="none",document.body.style.overflow="auto",this.isOpen=!1,this.clearForm(),this.clearMessage(),this.clearAllErrors()}switchMode(e){this.currentMode=e,document.querySelectorAll(".auth-tab").forEach(o=>{o.classList.toggle("active",o.dataset.mode===e)});const t=document.getElementById("name-group"),s=document.getElementById("auth-title"),a=document.getElementById("auth-submit"),r=document.getElementById("auth-switch-text");e==="login"?(s.textContent="Entrar na sua conta",a.querySelector(".btn-text").innerHTML='<i class="fas fa-sign-in-alt"></i> Entrar',t.style.display="none",r.innerHTML='Não tem uma conta? <a href="#" id="switch-mode">Criar conta gratuita</a>'):(s.textContent="Criar sua conta",a.querySelector(".btn-text").innerHTML='<i class="fas fa-user-plus"></i> Criar Conta',t.style.display="block",r.innerHTML='Já tem uma conta? <a href="#" id="switch-mode">Fazer login</a>'),document.getElementById("switch-mode").addEventListener("click",o=>{o.preventDefault();const l=this.currentMode==="login"?"register":"login";this.switchMode(l)}),this.clearForm(),this.clearMessage(),this.clearAllErrors()}async handleFormSubmit(){if(this.isLoading)return;const e=document.getElementById("email").value.trim(),t=document.getElementById("password").value,s=document.getElementById("full-name").value.trim();let a=!0;if(this.validateEmail(e)||(a=!1),this.validatePassword(t)||(a=!1),this.currentMode==="register"&&!this.validateName(s)&&(a=!1),!!a){this.setLoading(!0),this.showMessage("Processando...","info");try{let r;this.currentMode==="login"?r=await this.performLogin(e,t):r=await this.performRegister(e,t,s),r.success?(this.showMessage(r.message,"success"),this.currentMode==="login"?setTimeout(()=>{this.close(),this.handleSuccessfulAuth(r.user)},1500):setTimeout(()=>{this.switchMode("login"),this.showMessage("Conta criada! Faça login para continuar.","success")},2e3)):this.showMessage(r.message,"error")}catch(r){console.error("Erro na autenticação:",r),this.showMessage("Erro inesperado. Tente novamente.","error")}finally{this.setLoading(!1)}}}async performLogin(e,t){await this.delay(1e3);const a=JSON.parse(localStorage.getItem("app_users")||"[]").find(r=>r.email===e&&r.password===t);return a?(localStorage.setItem("current_user",JSON.stringify(a)),{success:!0,message:"Login realizado com sucesso!",user:a}):{success:!1,message:"E-mail ou senha incorretos"}}async performRegister(e,t,s){await this.delay(1e3);const a=JSON.parse(localStorage.getItem("app_users")||"[]");if(a.find(o=>o.email===e))return{success:!1,message:"Este e-mail já está cadastrado"};const i={id:Date.now().toString(),email:e,password:t,user_metadata:{full_name:s},created_at:new Date().toISOString()};return a.push(i),localStorage.setItem("app_users",JSON.stringify(a)),{success:!0,message:"Conta criada com sucesso!",user:i}}async handleSocialLogin(e){this.setLoading(!0),this.showMessage("Conectando...","info");try{await this.delay(2e3);const t={id:Date.now().toString(),email:`usuario.${e}@exemplo.com`,user_metadata:{full_name:`Usuário ${e.charAt(0).toUpperCase()+e.slice(1)}`,avatar_url:`https://via.placeholder.com/100/4285f4/ffffff?text=${e.charAt(0).toUpperCase()}`},provider:e,created_at:new Date().toISOString()},s=JSON.parse(localStorage.getItem("app_users")||"[]");s.find(r=>r.email===t.email)||(s.push(t),localStorage.setItem("app_users",JSON.stringify(s))),localStorage.setItem("current_user",JSON.stringify(t)),this.showMessage(`Login com ${e} realizado com sucesso!`,"success"),setTimeout(()=>{this.close(),this.handleSuccessfulAuth(t)},1500)}catch(t){console.error("Erro no login social:",t),this.showMessage(`Erro ao conectar com ${e}`,"error")}finally{this.setLoading(!1)}}handleSuccessfulAuth(e){const t=new CustomEvent("userAuthenticated",{detail:{user:e}});document.dispatchEvent(t),setTimeout(()=>{window.location.reload()},500)}setLoading(e){this.isLoading=e;const t=document.getElementById("auth-submit"),s=t.querySelector(".btn-text"),a=t.querySelector(".btn-loading"),r=document.querySelectorAll(".social-btn");e?(s.style.display="none",a.style.display="inline-flex",t.disabled=!0,r.forEach(i=>i.disabled=!0)):(s.style.display="inline-flex",a.style.display="none",t.disabled=!1,r.forEach(i=>i.disabled=!1))}showMessage(e,t){const s=document.getElementById("auth-message");s.textContent=e,s.className=`auth-message ${t}`,s.style.display="block"}clearMessage(){const e=document.getElementById("auth-message");e.style.display="none",e.textContent="",e.className="auth-message"}clearForm(){document.getElementById("auth-form").reset(),this.clearAllErrors()}clearAllErrors(){document.querySelectorAll(".error-message").forEach(e=>{e.textContent="",e.style.display="none"}),document.querySelectorAll(".form-group input").forEach(e=>{e.classList.remove("error")})}delay(e){return new Promise(t=>setTimeout(t,e))}}class u{constructor(){this.currentUser=null,this.userProfile=null,this.applications=[],this.init()}async init(){await this.checkCurrentUser(),this.setupAuthListeners(),this.updateUI()}setupAuthListeners(){document.addEventListener("userAuthenticated",e=>{this.handleUserSignIn(e.detail.user)}),document.addEventListener("userSignedOut",()=>{this.handleUserSignOut()})}async checkCurrentUser(){try{const e=localStorage.getItem("current_user");e&&(this.currentUser=JSON.parse(e),this.userProfile=this.currentUser,await this.loadUserApplications())}catch(e){console.error("Erro ao verificar usuário atual:",e)}}async loadUserApplications(){if(this.currentUser)try{const e=JSON.parse(localStorage.getItem(`applications_${this.currentUser.id}`)||"[]");this.applications=e}catch(e){console.error("Erro ao carregar candidaturas:",e)}}async handleUserSignIn(e){this.currentUser=e,this.userProfile=e,await this.loadUserApplications(),this.updateUI(),this.setupUserPanelListeners()}handleUserSignOut(){var e;this.currentUser=null,this.userProfile=null,this.applications=[],localStorage.removeItem("current_user"),this.updateUI(),(window.location.hash==="#user-panel"||(e=document.getElementById("user-panel-page"))!=null&&e.classList.contains("active"))&&this.showPage("home")}updateUI(){const e=document.getElementById("login-btn"),t=document.getElementById("user-menu");this.currentUser?(e&&(e.style.display="none"),t?this.updateUserMenu():this.createUserMenu()):(e&&(e.style.display="inline-flex"),t&&t.remove())}createUserMenu(){const e=document.querySelector(".nav-menu"),t=this.getUserDisplayName(),a=`
      <li class="nav-item dropdown" id="user-menu">
        <a class="nav-link dropdown-toggle" href="#" id="user-dropdown-toggle">
          <img src="${this.getUserAvatar()}" 
               alt="Avatar" class="user-avatar"
               onerror="this.src='https://via.placeholder.com/32/1e3a8a/ffffff?text=${t.charAt(0).toUpperCase()}'">
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
    `;e.insertAdjacentHTML("beforeend",a),this.attachUserMenuListeners()}attachUserMenuListeners(){const e=document.getElementById("user-panel-link"),t=document.getElementById("profile-link"),s=document.getElementById("applications-link"),a=document.getElementById("logout-link");e==null||e.addEventListener("click",r=>{r.preventDefault(),this.showUserPanel("dashboard")}),t==null||t.addEventListener("click",r=>{r.preventDefault(),this.showUserPanel("profile")}),s==null||s.addEventListener("click",r=>{r.preventDefault(),this.showUserPanel("applications")}),a==null||a.addEventListener("click",async r=>{r.preventDefault(),await this.handleLogout()})}showUserPanel(e="dashboard"){this.showPage("user-panel"),this.updateUserPanelData(),e&&this.showPanelSection(e)}showPage(e){document.querySelectorAll(".page").forEach(s=>{s.classList.remove("active")});const t=document.getElementById(`${e}-page`);t&&t.classList.add("active"),document.querySelectorAll(".nav-link").forEach(s=>{s.classList.remove("active"),s.dataset.page===e&&s.classList.add("active")}),window.scrollTo(0,0)}showPanelSection(e){document.querySelectorAll(".panel-section").forEach(s=>{s.classList.remove("active")});const t=document.getElementById(`${e}-panel`);t&&t.classList.add("active"),document.querySelectorAll(".panel-nav .nav-item").forEach(s=>{s.classList.remove("active"),s.dataset.panel===e&&s.classList.add("active")})}setupUserPanelListeners(){document.querySelectorAll(".panel-nav .nav-item").forEach(o=>{o.addEventListener("click",l=>{l.preventDefault();const c=l.currentTarget.dataset.panel;this.showPanelSection(c)})});const e=document.getElementById("edit-avatar-btn"),t=document.getElementById("avatar-upload");e==null||e.addEventListener("click",()=>{t.click()}),t==null||t.addEventListener("change",o=>{this.handleAvatarUpload(o.target.files[0])});const s=document.getElementById("profile-form");s==null||s.addEventListener("submit",o=>{o.preventDefault(),this.handleProfileUpdate(o.target)});const a=document.getElementById("resume-file"),r=document.getElementById("resume-upload-area"),i=document.getElementById("remove-resume");r==null||r.addEventListener("click",()=>{a.click()}),a==null||a.addEventListener("change",o=>{this.handleResumeUpload(o.target.files[0])}),i==null||i.addEventListener("click",()=>{this.removeResume()})}updateUserPanelData(){if(!this.currentUser)return;const e=document.getElementById("user-name-display"),t=document.getElementById("user-email-display"),s=document.getElementById("user-avatar-display");e&&(e.textContent=this.getUserDisplayName()),t&&(t.textContent=this.currentUser.email),s&&(s.src=this.getUserAvatar(),s.onerror=()=>{s.src=`https://via.placeholder.com/80/1e3a8a/ffffff?text=${this.getUserDisplayName().charAt(0).toUpperCase()}`});const a=document.getElementById("applications-count"),r=document.getElementById("profile-views"),i=document.getElementById("resume-status");if(a&&(a.textContent=this.applications.length),r&&(r.textContent=Math.floor(Math.random()*50)+10),i){const o=localStorage.getItem(`resume_${this.currentUser.id}`);i.textContent=o?"Completo":"Incompleto"}this.fillProfileForm(),this.loadApplicationsList()}fillProfileForm(){var s;if(!this.userProfile||!document.getElementById("profile-form"))return;const t={"profile-name":((s=this.userProfile.user_metadata)==null?void 0:s.full_name)||"","profile-nickname":this.userProfile.nickname||"","profile-email":this.userProfile.email||"","profile-phone":this.userProfile.phone||"","profile-gender":this.userProfile.gender||"","profile-birthdate":this.userProfile.birth_date||"","profile-address":this.userProfile.address||""};Object.entries(t).forEach(([a,r])=>{const i=document.getElementById(a);i&&(i.value=r)})}loadApplicationsList(){const e=document.getElementById("applications-list");if(!e)return;if(this.applications.length===0){e.innerHTML=`
        <div class="empty-state">
          <i class="fas fa-briefcase"></i>
          <h3>Nenhuma candidatura ainda</h3>
          <p>Você ainda não se candidatou a nenhuma vaga. Explore nossas oportunidades!</p>
          <a href="#" class="btn btn-primary" data-page="vagas">Ver Vagas Disponíveis</a>
        </div>
      `;const s=e.querySelector('[data-page="vagas"]');s&&s.addEventListener("click",a=>{a.preventDefault(),this.showPage("vagas")});return}const t=this.applications.map(s=>`
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
    `).join("");e.innerHTML=t}getStatusText(e){return{pending:"Pendente",reviewing:"Em Análise",approved:"Aprovado",rejected:"Rejeitado"}[e]||"Pendente"}async handleAvatarUpload(e){if(e){if(!e.type.startsWith("image/")){this.showNotification("Por favor, selecione uma imagem válida","error");return}if(e.size>5*1024*1024){this.showNotification("A imagem deve ter no máximo 5MB","error");return}try{const t=new FileReader;t.onload=s=>{const a=s.target.result,r=document.getElementById("user-avatar-display");r&&(r.src=a);const i=document.querySelector(".user-avatar");i&&(i.src=a),localStorage.setItem(`avatar_${this.currentUser.id}`,a),this.showNotification("Avatar atualizado com sucesso!","success")},t.readAsDataURL(e)}catch(t){console.error("Erro ao fazer upload do avatar:",t),this.showNotification("Erro ao atualizar avatar","error")}}}async handleProfileUpdate(e){const t=new FormData(e),s=Object.fromEntries(t);try{this.userProfile={...this.userProfile,...s},this.currentUser={...this.currentUser,...s},localStorage.setItem("current_user",JSON.stringify(this.currentUser)),this.updateUI(),this.showNotification("Perfil atualizado com sucesso!","success")}catch(a){console.error("Erro ao atualizar perfil:",a),this.showNotification("Erro ao atualizar perfil","error")}}async handleResumeUpload(e){if(e){if(e.type!=="application/pdf"){this.showNotification("Por favor, selecione um arquivo PDF","error");return}if(e.size>10*1024*1024){this.showNotification("O arquivo deve ter no máximo 10MB","error");return}try{const t={name:e.name,size:e.size,uploadDate:new Date().toISOString()};localStorage.setItem(`resume_${this.currentUser.id}`,JSON.stringify(t)),this.showResumePreview(t),this.showNotification("Currículo enviado com sucesso!","success");const s=document.getElementById("resume-status");s&&(s.textContent="Completo")}catch(t){console.error("Erro ao fazer upload do currículo:",t),this.showNotification("Erro ao enviar currículo","error")}}}showResumePreview(e){const t=document.getElementById("resume-upload-area"),s=document.getElementById("resume-preview"),a=document.getElementById("resume-filename"),r=document.getElementById("resume-filesize");t&&(t.style.display="none"),s&&(s.style.display="block"),a&&(a.textContent=e.name),r&&(r.textContent=this.formatFileSize(e.size))}removeResume(){localStorage.removeItem(`resume_${this.currentUser.id}`);const e=document.getElementById("resume-upload-area"),t=document.getElementById("resume-preview");e&&(e.style.display="block"),t&&(t.style.display="none");const s=document.getElementById("resume-status");s&&(s.textContent="Incompleto"),this.showNotification("Currículo removido","info")}formatFileSize(e){if(e===0)return"0 Bytes";const t=1024,s=["Bytes","KB","MB","GB"],a=Math.floor(Math.log(e)/Math.log(t));return parseFloat((e/Math.pow(t,a)).toFixed(2))+" "+s[a]}async handleLogout(){if(confirm("Tem certeza que deseja sair?"))try{localStorage.removeItem("current_user"),this.handleUserSignOut(),this.showNotification("Logout realizado com sucesso!","success"),setTimeout(()=>{window.location.reload()},1e3)}catch(t){console.error("Erro ao fazer logout:",t),this.showNotification("Erro ao fazer logout","error")}}addApplication(e){var a;const t={id:Date.now().toString(),...e,date:new Date().toISOString(),status:"pending"};this.applications.push(t),localStorage.setItem(`applications_${this.currentUser.id}`,JSON.stringify(this.applications)),(a=document.getElementById("applications-panel"))!=null&&a.classList.contains("active")&&this.loadApplicationsList();const s=document.getElementById("applications-count");s&&(s.textContent=this.applications.length)}updateUserMenu(){const e=document.querySelector(".user-name"),t=document.querySelector(".user-avatar");if(e&&(e.textContent=this.getUserDisplayName()),t){const s=this.getUserAvatar();t.src=s,t.onerror=()=>{t.src=`https://via.placeholder.com/32/1e3a8a/ffffff?text=${this.getUserDisplayName().charAt(0).toUpperCase()}`}}}getUserDisplayName(){var e,t,s,a,r;return(t=(e=this.userProfile)==null?void 0:e.user_metadata)!=null&&t.full_name?this.userProfile.user_metadata.full_name:(a=(s=this.currentUser)==null?void 0:s.user_metadata)!=null&&a.full_name?this.currentUser.user_metadata.full_name:(r=this.currentUser)!=null&&r.email?this.currentUser.email.split("@")[0]:"Usuário"}getUserAvatar(){var t,s,a,r,i;const e=localStorage.getItem(`avatar_${(t=this.currentUser)==null?void 0:t.id}`);return e||((a=(s=this.userProfile)==null?void 0:s.user_metadata)!=null&&a.avatar_url?this.userProfile.user_metadata.avatar_url:(i=(r=this.currentUser)==null?void 0:r.user_metadata)!=null&&i.avatar_url?this.currentUser.user_metadata.avatar_url:`https://via.placeholder.com/32/1e3a8a/ffffff?text=${this.getUserDisplayName().charAt(0).toUpperCase()}`)}showNotification(e,t="info"){const s=document.createElement("div");s.className=`notification notification-${t}`,s.innerHTML=`
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
      background: ${t==="success"?"#10b981":t==="error"?"#ef4444":"#06b6d4"};
    `,document.body.appendChild(s),setTimeout(()=>{s.style.animation="slideOutRight 0.3s ease-out",setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},300)},4e3)}isLoggedIn(){return!!this.currentUser}getUser(){return this.currentUser}getUserProfile(){return this.userProfile}getUserId(){var e;return((e=this.currentUser)==null?void 0:e.id)||null}getUserEmail(){var e;return((e=this.currentUser)==null?void 0:e.email)||null}}document.addEventListener("DOMContentLoaded",()=>{console.log("Inicializando sistema local...");const n=new d,e=new u,t=document.getElementById("login-btn");t?t.addEventListener("click",()=>{n.open("login")}):console.warn("Botão de login não encontrado"),typeof window<"u"&&(window.authModal=n,window.userManager=e,window.testAuth=()=>{console.log("Estado atual da autenticação:"),console.log("- Usuário logado:",e.isLoggedIn()),console.log("- Usuário atual:",e.getUser()),console.log("- Perfil do usuário:",e.getUserProfile()),console.log("- Sistema local ativo")})});
