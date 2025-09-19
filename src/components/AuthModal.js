/**
 * Sistema de Autenticação Universal
 * Compatível com qualquer ambiente de hospedagem
 */

export class AuthModal {
  constructor() {
    this.isOpen = false
    this.currentMode = 'login'
    this.isLoading = false
    this.init()
  }

  init() {
    this.createModal()
    this.attachEventListeners()
    this.setupUniversalAuth()
  }

  /**
   * Configuração de autenticação universal
   * Funciona independente do ambiente de hospedagem
   */
  setupUniversalAuth() {
    // Detectar ambiente e configurar adequadamente
    this.environment = this.detectEnvironment()
    console.log('Ambiente detectado:', this.environment)
  }

  detectEnvironment() {
    const hostname = window.location.hostname
    
    if (hostname.includes('bolt.host')) {
      return 'bolt'
    } else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'local'
    } else if (hostname.includes('netlify.app') || hostname.includes('vercel.app')) {
      return 'static'
    } else {
      return 'production'
    }
  }

  createModal() {
    const modalHTML = `
      <div id="auth-modal" class="auth-modal">
        <div class="auth-modal-content">
          <span class="auth-close">&times;</span>
          
          <div class="auth-header">
            <h2 id="auth-title">Entrar</h2>
            <div class="auth-tabs">
              <button class="auth-tab active" data-mode="login">Entrar</button>
              <button class="auth-tab" data-mode="register">Cadastrar</button>
            </div>
          </div>

          <div class="auth-body">
            <!-- Login com redes sociais -->
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
              <span>ou</span>
            </div>

            <!-- Formulário de login/registro -->
            <form id="auth-form" class="auth-form" novalidate>
              <div class="form-group" id="name-group" style="display: none;">
                <input type="text" id="full-name" placeholder="Nome completo" autocomplete="name">
              </div>
              
              <div class="form-group">
                <input type="email" id="email" placeholder="E-mail" required autocomplete="email">
                <div class="error-message" id="email-error"></div>
              </div>
              
              <div class="form-group">
                <input type="password" id="password" placeholder="Senha" required autocomplete="current-password">
                <div class="error-message" id="password-error"></div>
              </div>

              <button type="submit" class="auth-submit-btn" id="auth-submit">
                <span class="btn-text">Entrar</span>
                <span class="btn-loading" style="display: none;">
                  <i class="fas fa-spinner fa-spin"></i> Processando...
                </span>
              </button>
            </form>

            <div class="auth-footer">
              <p id="auth-switch">
                Não tem uma conta? <a href="#" id="switch-mode">Cadastre-se</a>
              </p>
            </div>
          </div>

          <div id="auth-message" class="auth-message"></div>
        </div>
      </div>
    `
    
    document.body.insertAdjacentHTML('beforeend', modalHTML)
  }

  attachEventListeners() {
    // Fechar modal
    const modal = document.getElementById('auth-modal')
    const closeBtn = modal.querySelector('.auth-close')
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.close()
      }
    })
    
    closeBtn.addEventListener('click', () => {
      this.close()
    })

    // ESC para fechar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close()
      }
    })

    // Alternar entre login e registro
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault()
        const mode = e.target.dataset.mode
        this.switchMode(mode)
      })
    })

    // Formulário de autenticação
    const form = document.getElementById('auth-form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleFormSubmit()
    })

    // Validação em tempo real
    this.setupRealTimeValidation()

    // Login social (simulado para compatibilidade universal)
    document.getElementById('google-login').addEventListener('click', (e) => {
      e.preventDefault()
      this.handleSocialLogin('google')
    })

    document.getElementById('linkedin-login').addEventListener('click', (e) => {
      e.preventDefault()
      this.handleSocialLogin('linkedin')
    })
  }

  setupRealTimeValidation() {
    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password')
    
    emailInput.addEventListener('blur', () => {
      this.validateEmail(emailInput.value)
    })
    
    passwordInput.addEventListener('blur', () => {
      this.validatePassword(passwordInput.value)
    })
    
    // Limpar erros ao digitar
    emailInput.addEventListener('input', () => {
      this.clearError('email-error')
    })
    
    passwordInput.addEventListener('input', () => {
      this.clearError('password-error')
    })
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const errorElement = document.getElementById('email-error')
    
    if (!email) {
      this.showFieldError('email-error', 'E-mail é obrigatório')
      return false
    } else if (!emailRegex.test(email)) {
      this.showFieldError('email-error', 'E-mail inválido')
      return false
    } else {
      this.clearError('email-error')
      return true
    }
  }

  validatePassword(password) {
    const errorElement = document.getElementById('password-error')
    
    if (!password) {
      this.showFieldError('password-error', 'Senha é obrigatória')
      return false
    } else if (password.length < 6) {
      this.showFieldError('password-error', 'Senha deve ter pelo menos 6 caracteres')
      return false
    } else {
      this.clearError('password-error')
      return true
    }
  }

  showFieldError(elementId, message) {
    const errorElement = document.getElementById(elementId)
    errorElement.textContent = message
    errorElement.style.display = 'block'
  }

  clearError(elementId) {
    const errorElement = document.getElementById(elementId)
    errorElement.textContent = ''
    errorElement.style.display = 'none'
  }

  open(mode = 'login') {
    this.currentMode = mode
    this.switchMode(mode)
    document.getElementById('auth-modal').style.display = 'block'
    document.body.style.overflow = 'hidden'
    this.isOpen = true
    
    // Focar no primeiro campo
    setTimeout(() => {
      const firstInput = document.querySelector('#auth-form input:not([style*="display: none"])')
      if (firstInput) firstInput.focus()
    }, 100)
  }

  close() {
    document.getElementById('auth-modal').style.display = 'none'
    document.body.style.overflow = 'auto'
    this.isOpen = false
    this.clearForm()
    this.clearMessage()
    this.clearAllErrors()
  }

  switchMode(mode) {
    this.currentMode = mode
    
    // Atualizar tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode)
    })

    // Atualizar conteúdo
    const nameGroup = document.getElementById('name-group')
    const title = document.getElementById('auth-title')
    const submitBtn = document.getElementById('auth-submit')
    const switchText = document.getElementById('auth-switch')
    
    if (mode === 'login') {
      title.textContent = 'Entrar'
      submitBtn.querySelector('.btn-text').textContent = 'Entrar'
      nameGroup.style.display = 'none'
      switchText.innerHTML = 'Não tem uma conta? <a href="#" id="switch-mode">Cadastre-se</a>'
    } else {
      title.textContent = 'Cadastrar'
      submitBtn.querySelector('.btn-text').textContent = 'Cadastrar'
      nameGroup.style.display = 'block'
      switchText.innerHTML = 'Já tem uma conta? <a href="#" id="switch-mode">Entre</a>'
    }

    // Reattach event listener para o novo link
    const switchLink = document.getElementById('switch-mode')
    switchLink.addEventListener('click', (e) => {
      e.preventDefault()
      const newMode = this.currentMode === 'login' ? 'register' : 'login'
      this.switchMode(newMode)
    })

    this.clearForm()
    this.clearMessage()
    this.clearAllErrors()
  }

  async handleFormSubmit() {
    if (this.isLoading) return
    
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value
    const fullName = document.getElementById('full-name').value.trim()

    // Validação
    let isValid = true
    
    if (!this.validateEmail(email)) isValid = false
    if (!this.validatePassword(password)) isValid = false
    
    if (this.currentMode === 'register' && !fullName) {
      this.showMessage('Nome completo é obrigatório', 'error')
      isValid = false
    }
    
    if (!isValid) return

    this.setLoading(true)
    this.showMessage('Processando...', 'info')

    try {
      let result
      
      if (this.currentMode === 'login') {
        result = await this.performLogin(email, password)
      } else {
        result = await this.performRegister(email, password, fullName)
      }

      if (result.success) {
        this.showMessage(result.message, 'success')
        setTimeout(() => {
          this.close()
          this.handleSuccessfulAuth(result.user)
        }, 1500)
      } else {
        this.showMessage(result.message, 'error')
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      this.showMessage('Erro inesperado. Tente novamente.', 'error')
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * Autenticação universal - funciona em qualquer ambiente
   */
  async performLogin(email, password) {
    // Simular delay de rede
    await this.delay(1000)
    
    // Verificar se há integração com Supabase disponível
    if (window.supabase && typeof window.supabase.auth !== 'undefined') {
      try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          return {
            success: false,
            message: this.getErrorMessage(error)
          }
        }
        
        return {
          success: true,
          message: 'Login realizado com sucesso!',
          user: data.user
        }
      } catch (error) {
        console.warn('Supabase não disponível, usando autenticação local')
      }
    }
    
    // Fallback: autenticação local/simulada
    return this.performLocalAuth(email, password, 'login')
  }

  async performRegister(email, password, fullName) {
    await this.delay(1000)
    
    if (window.supabase && typeof window.supabase.auth !== 'undefined') {
      try {
        const { data, error } = await window.supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        })
        
        if (error) {
          return {
            success: false,
            message: this.getErrorMessage(error)
          }
        }
        
        return {
          success: true,
          message: 'Conta criada com sucesso! Verifique seu e-mail.',
          user: data.user
        }
      } catch (error) {
        console.warn('Supabase não disponível, usando registro local')
      }
    }
    
    return this.performLocalAuth(email, password, 'register', fullName)
  }

  /**
   * Sistema de autenticação local para compatibilidade universal
   */
  async performLocalAuth(email, password, mode, fullName = null) {
    const users = JSON.parse(localStorage.getItem('app_users') || '[]')
    
    if (mode === 'login') {
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        localStorage.setItem('current_user', JSON.stringify(user))
        return {
          success: true,
          message: 'Login realizado com sucesso!',
          user: user
        }
      } else {
        return {
          success: false,
          message: 'E-mail ou senha incorretos'
        }
      }
    } else {
      // Verificar se usuário já existe
      const existingUser = users.find(u => u.email === email)
      
      if (existingUser) {
        return {
          success: false,
          message: 'Este e-mail já está cadastrado'
        }
      }
      
      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        full_name: fullName,
        created_at: new Date().toISOString()
      }
      
      users.push(newUser)
      localStorage.setItem('app_users', JSON.stringify(users))
      localStorage.setItem('current_user', JSON.stringify(newUser))
      
      return {
        success: true,
        message: 'Conta criada com sucesso!',
        user: newUser
      }
    }
  }

  async handleSocialLogin(provider) {
    this.setLoading(true)
    this.showMessage('Redirecionando...', 'info')
    
    try {
      // Tentar Supabase primeiro
      if (window.supabase && typeof window.supabase.auth !== 'undefined') {
        const { data, error } = await window.supabase.auth.signInWithOAuth({
          provider: provider === 'linkedin' ? 'linkedin_oidc' : provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) {
          throw error
        }
        return
      }
      
      // Fallback: simular login social
      await this.delay(1500)
      this.showMessage(`Login com ${provider} não disponível no momento`, 'error')
      
    } catch (error) {
      console.error('Erro no login social:', error)
      this.showMessage(`Erro ao conectar com ${provider}`, 'error')
    } finally {
      this.setLoading(false)
    }
  }

  handleSuccessfulAuth(user) {
    // Disparar evento customizado para outros componentes
    const event = new CustomEvent('userAuthenticated', {
      detail: { user }
    })
    document.dispatchEvent(event)
    
    // Recarregar página para atualizar interface
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  setLoading(loading) {
    this.isLoading = loading
    const submitBtn = document.getElementById('auth-submit')
    const btnText = submitBtn.querySelector('.btn-text')
    const btnLoading = submitBtn.querySelector('.btn-loading')
    
    if (loading) {
      btnText.style.display = 'none'
      btnLoading.style.display = 'inline-flex'
      submitBtn.disabled = true
    } else {
      btnText.style.display = 'inline'
      btnLoading.style.display = 'none'
      submitBtn.disabled = false
    }
  }

  showMessage(message, type) {
    const messageEl = document.getElementById('auth-message')
    messageEl.textContent = message
    messageEl.className = `auth-message ${type}`
    messageEl.style.display = 'block'
  }

  clearMessage() {
    const messageEl = document.getElementById('auth-message')
    messageEl.style.display = 'none'
    messageEl.textContent = ''
    messageEl.className = 'auth-message'
  }

  clearForm() {
    document.getElementById('auth-form').reset()
  }

  clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = ''
      el.style.display = 'none'
    })
  }

  getErrorMessage(error) {
    const errorMessages = {
      'Invalid login credentials': 'E-mail ou senha incorretos',
      'User already registered': 'Este e-mail já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'E-mail inválido',
      'Email not confirmed': 'E-mail não confirmado. Verifique sua caixa de entrada.',
      'signup_disabled': 'Cadastro temporariamente desabilitado'
    }
    
    return errorMessages[error.message] || error.message || 'Erro desconhecido'
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}