import { auth } from '../lib/supabase.js'

export class UserManager {
  constructor() {
    this.currentUser = null
    this.userProfile = null
    this.init()
  }

  async init() {
    // Verificar se há usuário logado
    await this.checkCurrentUser()
    
    // Escutar mudanças no estado de autenticação
    auth.supabase?.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.handleUserSignIn(session.user)
      } else if (event === 'SIGNED_OUT') {
        this.handleUserSignOut()
      }
    })

    this.updateUI()
  }

  async checkCurrentUser() {
    const { user, error } = await auth.getCurrentUser()
    
    if (user && !error) {
      this.currentUser = user
      await this.loadUserProfile()
    }
  }

  async loadUserProfile() {
    if (!this.currentUser) return

    const { data, error } = await auth.getUserProfile(this.currentUser.id)
    
    if (data && !error) {
      this.userProfile = data
    }
  }

  async handleUserSignIn(user) {
    this.currentUser = user
    await this.loadUserProfile()
    this.updateUI()
  }

  handleUserSignOut() {
    this.currentUser = null
    this.userProfile = null
    this.updateUI()
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
    
    const userMenuHTML = `
      <li class="nav-item" id="user-menu">
        <div class="user-dropdown">
          <button class="user-btn" id="user-btn">
            <img src="${this.userProfile?.avatar_url || 'https://via.placeholder.com/32'}" 
                 alt="Avatar" class="user-avatar">
            <span class="user-name">${this.userProfile?.full_name || 'Usuário'}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="user-dropdown-menu" id="user-dropdown-menu">
            <a href="#" class="dropdown-item" id="profile-link">
              <i class="fas fa-user"></i> Meu Perfil
            </a>
            <a href="#" class="dropdown-item" id="logout-link">
              <i class="fas fa-sign-out-alt"></i> Sair
            </a>
          </div>
        </div>
      </li>
    `
    
    navbar.insertAdjacentHTML('beforeend', userMenuHTML)
    
    // Adicionar event listeners
    document.getElementById('user-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      const dropdown = document.getElementById('user-dropdown-menu')
      dropdown.classList.toggle('show')
    })

    document.getElementById('logout-link').addEventListener('click', async (e) => {
      e.preventDefault()
      await this.handleLogout()
    })

    document.getElementById('profile-link').addEventListener('click', (e) => {
      e.preventDefault()
      this.showProfileModal()
    })

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', () => {
      const dropdown = document.getElementById('user-dropdown-menu')
      if (dropdown) dropdown.classList.remove('show')
    })
  }

  updateUserMenu() {
    const userName = document.querySelector('.user-name')
    const userAvatar = document.querySelector('.user-avatar')
    
    if (userName) {
      userName.textContent = this.userProfile?.full_name || 'Usuário'
    }
    
    if (userAvatar) {
      userAvatar.src = this.userProfile?.avatar_url || 'https://via.placeholder.com/32'
    }
  }

  async handleLogout() {
    const { error } = await auth.signOut()
    
    if (!error) {
      window.location.reload()
    } else {
      alert('Erro ao fazer logout. Tente novamente.')
    }
  }

  showProfileModal() {
    // Implementar modal de perfil se necessário
    alert('Modal de perfil em desenvolvimento')
  }

  isLoggedIn() {
    return !!this.currentUser
  }

  getUser() {
    return this.currentUser
  }

  getUserProfile() {
    return this.userProfile
  }
}