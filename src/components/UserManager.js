/**
 * Gerenciador de Usuário Local Completo
 * Sistema completo de perfil e painel do usuário
 */

export class UserManager {
  constructor() {
    this.currentUser = null
    this.userProfile = null
    this.applications = []
    this.init()
  }

  async init() {
    await this.checkCurrentUser()
    this.setupAuthListeners()
    this.updateUI()
  }

  setupAuthListeners() {
    // Listeners customizados
    document.addEventListener('userAuthenticated', (e) => {
      this.handleUserSignIn(e.detail.user)
    })
    
    document.addEventListener('userSignedOut', () => {
      this.handleUserSignOut()
    })
  }

  async checkCurrentUser() {
    try {
      const userData = localStorage.getItem('current_user')
      if (userData) {
        this.currentUser = JSON.parse(userData)
        this.userProfile = this.currentUser
        await this.loadUserApplications()
      }
    } catch (error) {
      console.error('Erro ao verificar usuário atual:', error)
    }
  }

  async loadUserApplications() {
    if (!this.currentUser) return

    try {
      const applications = JSON.parse(localStorage.getItem(`applications_${this.currentUser.id}`) || '[]')
      this.applications = applications
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error)
    }
  }

  async handleUserSignIn(user) {
    this.currentUser = user
    this.userProfile = user
    await this.loadUserApplications()
    this.updateUI()
    this.setupUserPanelListeners()
  }

  handleUserSignOut() {
    this.currentUser = null
    this.userProfile = null
    this.applications = []
    localStorage.removeItem('current_user')
    this.updateUI()
    
    // Redirecionar para home se estiver no painel
    if (window.location.hash === '#user-panel' || document.getElementById('user-panel-page')?.classList.contains('active')) {
      this.showPage('home')
    }
  }

  updateUI() {
    const loginBtn = document.getElementById('login-btn')
    const userMenu = document.getElementById('user-menu')
    
    if (this.currentUser) {
      if (loginBtn) loginBtn.style.display = 'none'
      
      if (!userMenu) {
        this.createUserMenu()
      } else {
        this.updateUserMenu()
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-flex'
      if (userMenu) userMenu.remove()
    }
  }

  createUserMenu() {
    const navbar = document.querySelector('.nav-menu')
    
    const userName = this.getUserDisplayName()
    const userAvatar = this.getUserAvatar()
    
    const userMenuHTML = `
      <li class="nav-item dropdown" id="user-menu">
        <a class="nav-link dropdown-toggle" href="#" id="user-dropdown-toggle">
          <img src="${userAvatar}" 
               alt="Avatar" class="user-avatar"
               onerror="this.src='https://via.placeholder.com/32/1e3a8a/ffffff?text=${userName.charAt(0).toUpperCase()}'">
          <span class="user-name">${userName}</span>
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
    `
    
    navbar.insertAdjacentHTML('beforeend', userMenuHTML)
    this.attachUserMenuListeners()
  }

  attachUserMenuListeners() {
    const userPanelLink = document.getElementById('user-panel-link')
    const profileLink = document.getElementById('profile-link')
    const applicationsLink = document.getElementById('applications-link')
    const logoutLink = document.getElementById('logout-link')
    
    userPanelLink?.addEventListener('click', (e) => {
      e.preventDefault()
      this.showUserPanel('dashboard')
    })

    profileLink?.addEventListener('click', (e) => {
      e.preventDefault()
      this.showUserPanel('profile')
    })

    applicationsLink?.addEventListener('click', (e) => {
      e.preventDefault()
      this.showUserPanel('applications')
    })

    logoutLink?.addEventListener('click', async (e) => {
      e.preventDefault()
      await this.handleLogout()
    })
  }

  showUserPanel(section = 'dashboard') {
    // Mostrar página do painel
    this.showPage('user-panel')
    
    // Atualizar dados do painel
    this.updateUserPanelData()
    
    // Mostrar seção específica
    if (section) {
      this.showPanelSection(section)
    }
  }

  showPage(pageId) {
    // Esconder todas as páginas
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active')
    })
    
    // Mostrar página específica
    const targetPage = document.getElementById(`${pageId}-page`)
    if (targetPage) {
      targetPage.classList.add('active')
    }
    
    // Atualizar navegação
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active')
      if (link.dataset.page === pageId) {
        link.classList.add('active')
      }
    })
    
    // Scroll para o topo
    window.scrollTo(0, 0)
  }

  showPanelSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.panel-section').forEach(section => {
      section.classList.remove('active')
    })
    
    // Mostrar seção específica
    const targetSection = document.getElementById(`${sectionId}-panel`)
    if (targetSection) {
      targetSection.classList.add('active')
    }
    
    // Atualizar navegação do painel
    document.querySelectorAll('.panel-nav .nav-item').forEach(item => {
      item.classList.remove('active')
      if (item.dataset.panel === sectionId) {
        item.classList.add('active')
      }
    })
  }

  setupUserPanelListeners() {
    // Navegação do painel
    document.querySelectorAll('.panel-nav .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        const panel = e.currentTarget.dataset.panel
        this.showPanelSection(panel)
      })
    })

    // Upload de avatar
    const editAvatarBtn = document.getElementById('edit-avatar-btn')
    const avatarUpload = document.getElementById('avatar-upload')
    
    editAvatarBtn?.addEventListener('click', () => {
      avatarUpload.click()
    })
    
    avatarUpload?.addEventListener('change', (e) => {
      this.handleAvatarUpload(e.target.files[0])
    })

    // Formulário de perfil
    const profileForm = document.getElementById('profile-form')
    profileForm?.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleProfileUpdate(e.target)
    })

    // Upload de currículo
    const resumeFile = document.getElementById('resume-file')
    const resumeUploadArea = document.getElementById('resume-upload-area')
    const removeResume = document.getElementById('remove-resume')
    
    resumeUploadArea?.addEventListener('click', () => {
      resumeFile.click()
    })
    
    resumeFile?.addEventListener('change', (e) => {
      this.handleResumeUpload(e.target.files[0])
    })
    
    removeResume?.addEventListener('click', () => {
      this.removeResume()
    })
  }

  updateUserPanelData() {
    if (!this.currentUser) return

    // Atualizar informações do usuário
    const userNameDisplay = document.getElementById('user-name-display')
    const userEmailDisplay = document.getElementById('user-email-display')
    const userAvatarDisplay = document.getElementById('user-avatar-display')
    
    if (userNameDisplay) userNameDisplay.textContent = this.getUserDisplayName()
    if (userEmailDisplay) userEmailDisplay.textContent = this.currentUser.email
    if (userAvatarDisplay) {
      userAvatarDisplay.src = this.getUserAvatar()
      userAvatarDisplay.onerror = () => {
        userAvatarDisplay.src = `https://via.placeholder.com/80/1e3a8a/ffffff?text=${this.getUserDisplayName().charAt(0).toUpperCase()}`
      }
    }

    // Atualizar estatísticas
    const applicationsCount = document.getElementById('applications-count')
    const profileViews = document.getElementById('profile-views')
    const resumeStatus = document.getElementById('resume-status')
    
    if (applicationsCount) applicationsCount.textContent = this.applications.length
    if (profileViews) profileViews.textContent = Math.floor(Math.random() * 50) + 10 // Simulado
    if (resumeStatus) {
      const hasResume = localStorage.getItem(`resume_${this.currentUser.id}`)
      resumeStatus.textContent = hasResume ? 'Completo' : 'Incompleto'
    }

    // Preencher formulário de perfil
    this.fillProfileForm()
    
    // Carregar candidaturas
    this.loadApplicationsList()
  }

  fillProfileForm() {
    if (!this.userProfile) return

    const form = document.getElementById('profile-form')
    if (!form) return

    const fields = {
      'profile-name': this.userProfile.user_metadata?.full_name || '',
      'profile-nickname': this.userProfile.nickname || '',
      'profile-email': this.userProfile.email || '',
      'profile-phone': this.userProfile.phone || '',
      'profile-gender': this.userProfile.gender || '',
      'profile-birthdate': this.userProfile.birth_date || '',
      'profile-address': this.userProfile.address || ''
    }

    Object.entries(fields).forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId)
      if (field) field.value = value
    })
  }

  loadApplicationsList() {
    const applicationsList = document.getElementById('applications-list')
    if (!applicationsList) return

    if (this.applications.length === 0) {
      applicationsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-briefcase"></i>
          <h3>Nenhuma candidatura ainda</h3>
          <p>Você ainda não se candidatou a nenhuma vaga. Explore nossas oportunidades!</p>
          <a href="#" class="btn btn-primary" data-page="vagas">Ver Vagas Disponíveis</a>
        </div>
      `
      
      // Adicionar listener para o botão
      const vagasBtn = applicationsList.querySelector('[data-page="vagas"]')
      if (vagasBtn) {
        vagasBtn.addEventListener('click', (e) => {
          e.preventDefault()
          this.showPage('vagas')
        })
      }
      
      return
    }

    const applicationsHTML = this.applications.map(app => `
      <div class="application-card">
        <div class="application-header">
          <div>
            <div class="application-title">${app.position}</div>
            <div class="application-date">Candidatura enviada em ${new Date(app.date).toLocaleDateString('pt-BR')}</div>
          </div>
          <span class="application-status status-${app.status}">${this.getStatusText(app.status)}</span>
        </div>
        <div class="application-details">
          <p><strong>Local:</strong> ${app.location || 'Serra - ES'}</p>
          <p><strong>Tipo:</strong> ${app.type || 'CLT'}</p>
          ${app.notes ? `<p><strong>Observações:</strong> ${app.notes}</p>` : ''}
        </div>
      </div>
    `).join('')

    applicationsList.innerHTML = applicationsHTML
  }

  getStatusText(status) {
    const statusMap = {
      'pending': 'Pendente',
      'reviewing': 'Em Análise',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado'
    }
    return statusMap[status] || 'Pendente'
  }

  async handleAvatarUpload(file) {
    if (!file) return

    // Validar arquivo
    if (!file.type.startsWith('image/')) {
      this.showNotification('Por favor, selecione uma imagem válida', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      this.showNotification('A imagem deve ter no máximo 5MB', 'error')
      return
    }

    try {
      // Converter para base64 para armazenamento local
      const reader = new FileReader()
      reader.onload = (e) => {
        const avatarUrl = e.target.result
        
        // Atualizar avatar na interface
        const avatarDisplay = document.getElementById('user-avatar-display')
        if (avatarDisplay) avatarDisplay.src = avatarUrl
        
        // Atualizar avatar no menu também
        const menuAvatar = document.querySelector('.user-avatar')
        if (menuAvatar) menuAvatar.src = avatarUrl
        
        // Salvar no localStorage
        localStorage.setItem(`avatar_${this.currentUser.id}`, avatarUrl)
        
        this.showNotification('Avatar atualizado com sucesso!', 'success')
      }
      reader.readAsDataURL(file)
      
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error)
      this.showNotification('Erro ao atualizar avatar', 'error')
    }
  }

  async handleProfileUpdate(form) {
    const formData = new FormData(form)
    const profileData = Object.fromEntries(formData)

    try {
      // Atualizar dados do usuário
      this.userProfile = { ...this.userProfile, ...profileData }
      this.currentUser = { ...this.currentUser, ...profileData }
      
      // Salvar no localStorage
      localStorage.setItem('current_user', JSON.stringify(this.currentUser))
      
      this.updateUI()
      this.showNotification('Perfil atualizado com sucesso!', 'success')
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      this.showNotification('Erro ao atualizar perfil', 'error')
    }
  }

  async handleResumeUpload(file) {
    if (!file) return

    if (file.type !== 'application/pdf') {
      this.showNotification('Por favor, selecione um arquivo PDF', 'error')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      this.showNotification('O arquivo deve ter no máximo 10MB', 'error')
      return
    }

    try {
      // Salvar informações do arquivo
      const resumeData = {
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString()
      }
      
      localStorage.setItem(`resume_${this.currentUser.id}`, JSON.stringify(resumeData))
      
      // Mostrar preview
      this.showResumePreview(resumeData)
      
      this.showNotification('Currículo enviado com sucesso!', 'success')
      
      // Atualizar status no dashboard
      const resumeStatus = document.getElementById('resume-status')
      if (resumeStatus) resumeStatus.textContent = 'Completo'
      
    } catch (error) {
      console.error('Erro ao fazer upload do currículo:', error)
      this.showNotification('Erro ao enviar currículo', 'error')
    }
  }

  showResumePreview(resumeData) {
    const uploadArea = document.getElementById('resume-upload-area')
    const preview = document.getElementById('resume-preview')
    const filename = document.getElementById('resume-filename')
    const filesize = document.getElementById('resume-filesize')
    
    if (uploadArea) uploadArea.style.display = 'none'
    if (preview) preview.style.display = 'block'
    if (filename) filename.textContent = resumeData.name
    if (filesize) filesize.textContent = this.formatFileSize(resumeData.size)
  }

  removeResume() {
    localStorage.removeItem(`resume_${this.currentUser.id}`)
    
    const uploadArea = document.getElementById('resume-upload-area')
    const preview = document.getElementById('resume-preview')
    
    if (uploadArea) uploadArea.style.display = 'block'
    if (preview) preview.style.display = 'none'
    
    // Atualizar status no dashboard
    const resumeStatus = document.getElementById('resume-status')
    if (resumeStatus) resumeStatus.textContent = 'Incompleto'
    
    this.showNotification('Currículo removido', 'info')
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  async handleLogout() {
    const confirmLogout = confirm('Tem certeza que deseja sair?')
    if (!confirmLogout) return

    try {
      localStorage.removeItem('current_user')
      this.handleUserSignOut()
      this.showNotification('Logout realizado com sucesso!', 'success')
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      this.showNotification('Erro ao fazer logout', 'error')
    }
  }

  // Métodos para candidaturas
  addApplication(applicationData) {
    const application = {
      id: Date.now().toString(),
      ...applicationData,
      date: new Date().toISOString(),
      status: 'pending'
    }
    
    this.applications.push(application)
    localStorage.setItem(`applications_${this.currentUser.id}`, JSON.stringify(this.applications))
    
    // Atualizar interface se estiver no painel
    if (document.getElementById('applications-panel')?.classList.contains('active')) {
      this.loadApplicationsList()
    }
    
    // Atualizar contador no dashboard
    const applicationsCount = document.getElementById('applications-count')
    if (applicationsCount) applicationsCount.textContent = this.applications.length
  }

  updateUserMenu() {
    const userName = document.querySelector('.user-name')
    const userAvatar = document.querySelector('.user-avatar')
    
    if (userName) userName.textContent = this.getUserDisplayName()
    if (userAvatar) {
      const avatarUrl = this.getUserAvatar()
      userAvatar.src = avatarUrl
      userAvatar.onerror = () => {
        userAvatar.src = `https://via.placeholder.com/32/1e3a8a/ffffff?text=${this.getUserDisplayName().charAt(0).toUpperCase()}`
      }
    }
  }

  getUserDisplayName() {
    if (this.userProfile?.user_metadata?.full_name) {
      return this.userProfile.user_metadata.full_name
    } else if (this.currentUser?.user_metadata?.full_name) {
      return this.currentUser.user_metadata.full_name
    } else if (this.currentUser?.email) {
      return this.currentUser.email.split('@')[0]
    } else {
      return 'Usuário'
    }
  }

  getUserAvatar() {
    // Verificar avatar local primeiro
    const localAvatar = localStorage.getItem(`avatar_${this.currentUser?.id}`)
    if (localAvatar) return localAvatar
    
    if (this.userProfile?.user_metadata?.avatar_url) {
      return this.userProfile.user_metadata.avatar_url
    } else if (this.currentUser?.user_metadata?.avatar_url) {
      return this.currentUser.user_metadata.avatar_url
    } else {
      const name = this.getUserDisplayName()
      return `https://via.placeholder.com/32/1e3a8a/ffffff?text=${name.charAt(0).toUpperCase()}`
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `
    notification.style.cssText = `
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
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#06b6d4'};
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 4000)
  }

  // Métodos públicos
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