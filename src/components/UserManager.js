/**
 * Gerenciador de Usuário Universal
 * Compatível com qualquer ambiente de hospedagem
 */

export class UserManager {
  constructor() {
    this.currentUser = null
    this.userProfile = null
    this.authSystem = null
    this.init()
  }

  async init() {
    // Detectar sistema de autenticação disponível
    this.detectAuthSystem()
    
    // Verificar se há usuário logado
    await this.checkCurrentUser()
    
    // Configurar listeners de autenticação
    this.setupAuthListeners()
    
    // Atualizar interface
    this.updateUI()
  }

  detectAuthSystem() {
    if (window.supabase && typeof window.supabase.auth !== 'undefined') {
      this.authSystem = 'supabase'
      console.log('Sistema de autenticação: Supabase')
    } else {
      this.authSystem = 'local'
      console.log('Sistema de autenticação: Local Storage')
    }
  }

  setupAuthListeners() {
    if (this.authSystem === 'supabase') {
      // Listener do Supabase
      window.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          this.handleUserSignIn(session.user)
        } else if (event === 'SIGNED_OUT') {
          this.handleUserSignOut()
        }
      })
    } else {
      // Listener customizado para sistema local
      document.addEventListener('userAuthenticated', (e) => {
        this.handleUserSignIn(e.detail.user)
      })
      
      // Verificar mudanças no localStorage
      window.addEventListener('storage', (e) => {
        if (e.key === 'current_user') {
          if (e.newValue) {
            this.handleUserSignIn(JSON.parse(e.newValue))
          } else {
            this.handleUserSignOut()
          }
        }
      })
    }
  }

  async checkCurrentUser() {
    try {
      if (this.authSystem === 'supabase') {
        const { data: { user }, error } = await window.supabase.auth.getUser()
        
        if (user && !error) {
          this.currentUser = user
          await this.loadUserProfile()
        }
      } else {
        // Sistema local
        const userData = localStorage.getItem('current_user')
        if (userData) {
          this.currentUser = JSON.parse(userData)
          this.userProfile = this.currentUser // No sistema local, o perfil é o próprio usuário
        }
      }
    } catch (error) {
      console.error('Erro ao verificar usuário atual:', error)
    }
  }

  async loadUserProfile() {
    if (!this.currentUser || this.authSystem !== 'supabase') return

    try {
      const { data, error } = await window.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', this.currentUser.id)
        .single()
      
      if (data && !error) {
        this.userProfile = data
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  async handleUserSignIn(user) {
    this.currentUser = user
    
    if (this.authSystem === 'supabase') {
      await this.loadUserProfile()
    } else {
      this.userProfile = user
    }
    
    this.updateUI()
    
    // Disparar evento personalizado
    const event = new CustomEvent('userStateChanged', {
      detail: { user: this.currentUser, profile: this.userProfile }
    })
    document.dispatchEvent(event)
  }

  handleUserSignOut() {
    this.currentUser = null
    this.userProfile = null
    
    // Limpar localStorage se usando sistema local
    if (this.authSystem === 'local') {
      localStorage.removeItem('current_user')
    }
    
    this.updateUI()
    
    // Disparar evento personalizado
    const event = new CustomEvent('userStateChanged', {
      detail: { user: null, profile: null }
    })
    document.dispatchEvent(event)
  }

  updateUI() {
    const loginBtn = document.getElementById('login-btn')
    const userMenu = document.getElementById('user-menu')
    
    if (this.currentUser) {
      // Usuário logado
      if (loginBtn) loginBtn.style.display = 'none'
      
      if (!userMenu) {
        this.createUserMenu()
      } else {
        this.updateUserMenu()
      }
    } else {
      // Usuário não logado
      if (loginBtn) loginBtn.style.display = 'inline-block'
      if (userMenu) userMenu.remove()
    }
  }

  createUserMenu() {
    const navbar = document.querySelector('.nav-menu')
    
    const userName = this.getUserDisplayName()
    const userAvatar = this.getUserAvatar()
    
    const userMenuHTML = `
      <li class="nav-item" id="user-menu">
        <div class="user-dropdown">
          <button class="user-btn" id="user-btn" type="button">
            <img src="${userAvatar}" 
                 alt="Avatar" class="user-avatar"
                 onerror="this.src='https://via.placeholder.com/32/004a8d/ffffff?text=${userName.charAt(0).toUpperCase()}'">
            <span class="user-name">${userName}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="user-dropdown-menu" id="user-dropdown-menu">
            <a href="#" class="dropdown-item" id="profile-link">
              <i class="fas fa-user"></i> Meu Perfil
            </a>
            <a href="#" class="dropdown-item" id="settings-link">
              <i class="fas fa-cog"></i> Configurações
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item" id="logout-link">
              <i class="fas fa-sign-out-alt"></i> Sair
            </a>
          </div>
        </div>
      </li>
    `
    
    navbar.insertAdjacentHTML('beforeend', userMenuHTML)
    
    // Adicionar event listeners
    this.attachUserMenuListeners()
  }

  attachUserMenuListeners() {
    const userBtn = document.getElementById('user-btn')
    const dropdown = document.getElementById('user-dropdown-menu')
    const logoutLink = document.getElementById('logout-link')
    const profileLink = document.getElementById('profile-link')
    const settingsLink = document.getElementById('settings-link')
    
    // Toggle dropdown
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      dropdown.classList.toggle('show')
    })

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-dropdown')) {
        dropdown.classList.remove('show')
      }
    })

    // Logout
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault()
      dropdown.classList.remove('show')
      await this.handleLogout()
    })

    // Perfil
    profileLink.addEventListener('click', (e) => {
      e.preventDefault()
      dropdown.classList.remove('show')
      this.showProfileModal()
    })

    // Configurações
    settingsLink.addEventListener('click', (e) => {
      e.preventDefault()
      dropdown.classList.remove('show')
      this.showSettingsModal()
    })
  }

  updateUserMenu() {
    const userName = document.querySelector('.user-name')
    const userAvatar = document.querySelector('.user-avatar')
    
    if (userName) {
      userName.textContent = this.getUserDisplayName()
    }
    
    if (userAvatar) {
      const avatarUrl = this.getUserAvatar()
      userAvatar.src = avatarUrl
      userAvatar.onerror = () => {
        userAvatar.src = `https://via.placeholder.com/32/004a8d/ffffff?text=${this.getUserDisplayName().charAt(0).toUpperCase()}`
      }
    }
  }

  getUserDisplayName() {
    if (this.userProfile?.full_name) {
      return this.userProfile.full_name
    } else if (this.currentUser?.user_metadata?.full_name) {
      return this.currentUser.user_metadata.full_name
    } else if (this.currentUser?.email) {
      return this.currentUser.email.split('@')[0]
    } else {
      return 'Usuário'
    }
  }

  getUserAvatar() {
    if (this.userProfile?.avatar_url) {
      return this.userProfile.avatar_url
    } else if (this.currentUser?.user_metadata?.avatar_url) {
      return this.currentUser.user_metadata.avatar_url
    } else {
      // Gerar avatar baseado no nome
      const name = this.getUserDisplayName()
      return `https://via.placeholder.com/32/004a8d/ffffff?text=${name.charAt(0).toUpperCase()}`
    }
  }

  async handleLogout() {
    try {
      const confirmLogout = confirm('Tem certeza que deseja sair?')
      if (!confirmLogout) return

      if (this.authSystem === 'supabase') {
        const { error } = await window.supabase.auth.signOut()
        if (error) throw error
      } else {
        // Sistema local
        localStorage.removeItem('current_user')
        this.handleUserSignOut()
      }
      
      // Mostrar mensagem de sucesso
      this.showNotification('Logout realizado com sucesso!', 'success')
      
      // Recarregar página após um delay
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      this.showNotification('Erro ao fazer logout. Tente novamente.', 'error')
    }
  }

  showProfileModal() {
    // Implementar modal de perfil
    alert('Modal de perfil em desenvolvimento')
  }

  showSettingsModal() {
    // Implementar modal de configurações
    alert('Modal de configurações em desenvolvimento')
  }

  showNotification(message, type = 'info') {
    // Criar notificação temporária
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
    `
    
    document.body.appendChild(notification)
    
    // Remover após 3 segundos
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  // Métodos públicos para outros componentes
  isLoggedIn() {
    return !!this.currentUser
  }

  getUser() {
    return this.currentUser
  }

  getUserProfile() {
    return this.userProfile
  }

  getUserId() {
    return this.currentUser?.id || null
  }

  getUserEmail() {
    return this.currentUser?.email || null
  }
}

// Adicionar estilos para notificações
const notificationStyles = document.createElement('style')
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .dropdown-divider {
    height: 1px;
    background: #eee;
    margin: 8px 0;
  }
`
document.head.appendChild(notificationStyles)