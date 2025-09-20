/**
 * Sistema de Autenticação Modernizado com Supabase
 * Integração completa com Google e LinkedIn
 */

import { supabase } from '../lib/supabase.js'

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
    this.setupSupabaseAuth()
  }

  setupSupabaseAuth() {
    if (!supabase) {
      console.warn('Supabase não disponível, usando sistema local')
      return
    }

    // Listener para mudanças de autenticação
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      
      if (event === 'SIGNED_IN') {
        this.handleSuccessfulAuth(session.user)
      } else if (event === 'SIGNED_OUT') {
        this.handleSignOut()
      }
    })
  }

  createModal() {
    const modalHTML = `
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
    `
    
    document.body.insertAdjacentHTML('beforeend', modalHTML)
  }

  attachEventListeners() {
    const modal = document.getElementById('auth-modal')
    const closeBtn = document.getElementById('auth-close')
    
    // Fechar modal
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

    // Tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault()
        const mode = e.target.dataset.mode
        this.switchMode(mode)
      })
    })

    // Formulário
    const form = document.getElementById('auth-form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleFormSubmit()
    })

    // Validação em tempo real
    this.setupRealTimeValidation()

    // Login social
    document.getElementById('google-login').addEventListener('click', (e) => {
      e.preventDefault()
      this.handleSocialLogin('google')
    })

    document.getElementById('linkedin-login').addEventListener('click', (e) => {
      e.preventDefault()
      this.handleSocialLogin('linkedin_oidc')
    })
  }

  setupRealTimeValidation() {
    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password')
    const nameInput = document.getElementById('full-name')
    
    emailInput.addEventListener('blur', () => {
      this.validateEmail(emailInput.value)
    })
    
    passwordInput.addEventListener('blur', () => {
      this.validatePassword(passwordInput.value)
    })

    nameInput.addEventListener('blur', () => {
      if (this.currentMode === 'register') {
        this.validateName(nameInput.value)
      }
    })
    
    // Limpar erros ao digitar
    emailInput.addEventListener('input', () => {
      this.clearError('email-error')
      emailInput.classList.remove('error')
    })
    
    passwordInput.addEventListener('input', () => {
      this.clearError('password-error')
      passwordInput.classList.remove('error')
    })

    nameInput.addEventListener('input', () => {
      this.clearError('name-error')
      nameInput.classList.remove('error')
    })
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const input = document.getElementById('email')
    
    if (!email) {
      this.showFieldError('email-error', 'E-mail é obrigatório')
      input.classList.add('error')
      return false
    } else if (!emailRegex.test(email)) {
      this.showFieldError('email-error', 'E-mail inválido')
      input.classList.add('error')
      return false
    } else {
      this.clearError('email-error')
      input.classList.remove('error')
      return true
    }
  }

  validatePassword(password) {
    const input = document.getElementById('password')
    
    if (!password) {
      this.showFieldError('password-error', 'Senha é obrigatória')
      input.classList.add('error')
      return false
    } else if (password.length < 6) {
      this.showFieldError('password-error', 'Senha deve ter pelo menos 6 caracteres')
      input.classList.add('error')
      return false
    } else {
      this.clearError('password-error')
      input.classList.remove('error')
      return true
    }
  }

  validateName(name) {
    const input = document.getElementById('full-name')
    
    if (!name || name.trim().length < 2) {
      this.showFieldError('name-error', 'Nome deve ter pelo menos 2 caracteres')
      input.classList.add('error')
      return false
    } else {
      this.clearError('name-error')
      input.classList.remove('error')
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
    document.getElementById('auth-modal').style.display = 'flex'
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
    const switchText = document.getElementById('auth-switch-text')
    
    if (mode === 'login') {
      title.textContent = 'Entrar na sua conta'
      submitBtn.querySelector('.btn-text').innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar'
      nameGroup.style.display = 'none'
      switchText.innerHTML = 'Não tem uma conta? <a href="#" id="switch-mode">Criar conta gratuita</a>'
    } else {
      title.textContent = 'Criar sua conta'
      submitBtn.querySelector('.btn-text').innerHTML = '<i class="fas fa-user-plus"></i> Criar Conta'
      nameGroup.style.display = 'block'
      switchText.innerHTML = 'Já tem uma conta? <a href="#" id="switch-mode">Fazer login</a>'
    }

    // Reattach event listener
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
    
    if (this.currentMode === 'register' && !this.validateName(fullName)) {
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
        
        if (this.currentMode === 'login') {
          setTimeout(() => {
            this.close()
            this.handleSuccessfulAuth(result.user)
          }, 1500)
        } else {
          // Para registro, mostrar mensagem por mais tempo
          setTimeout(() => {
            this.close()
          }, 3000)
        }
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

  async performLogin(email, password) {
    if (!supabase) {
      return this.performLocalAuth(email, password, 'login')
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
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
      console.error('Erro no login:', error)
      return {
        success: false,
        message: 'Erro ao fazer login. Tente novamente.'
      }
    }
  }

  async performRegister(email, password, fullName) {
    if (!supabase) {
      return this.performLocalAuth(email, password, 'register', fullName)
    }

    try {
      const { data, error } = await supabase.auth.signUp({
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
        message: 'Conta criada com sucesso! Você já pode fazer login.',
        user: data.user
      }
    } catch (error) {
      console.error('Erro no registro:', error)
      return {
        success: false,
        message: 'Erro ao criar conta. Tente novamente.'
      }
    }
  }

  async handleSocialLogin(provider) {
    if (!supabase) {
      this.showMessage('Login social não disponível no momento', 'error')
      return
    }

    this.setLoading(true)
    this.showMessage('Redirecionando...', 'info')
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        throw error
      }
      
      // O redirecionamento acontecerá automaticamente
      
    } catch (error) {
      console.error('Erro no login social:', error)
      this.showMessage(`Erro ao conectar com ${provider === 'google' ? 'Google' : 'LinkedIn'}`, 'error')
      this.setLoading(false)
    }
  }

  // Sistema local para fallback
  async performLocalAuth(email, password, mode, fullName = null) {
    await this.delay(1000) // Simular delay de rede
    
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
      const existingUser = users.find(u => u.email === email)
      
      if (existingUser) {
        return {
          success: false,
          message: 'Este e-mail já está cadastrado'
        }
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        user_metadata: { full_name: fullName },
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

  handleSuccessfulAuth(user) {
    // Disparar evento customizado
    const event = new CustomEvent('userAuthenticated', {
      detail: { user }
    })
    document.dispatchEvent(event)
    
    // Recarregar página para atualizar interface
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  handleSignOut() {
    // Disparar evento de logout
    const event = new CustomEvent('userSignedOut')
    document.dispatchEvent(event)
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
      btnText.style.display = 'inline-flex'
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
    this.clearAllErrors()
  }

  clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
      el.textContent = ''
      el.style.display = 'none'
    })
    
    document.querySelectorAll('.form-group input').forEach(input => {
      input.classList.remove('error')
    })
  }

  getErrorMessage(error) {
    const errorMessages = {
      'Invalid login credentials': 'E-mail ou senha incorretos',
      'User already registered': 'Este e-mail já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'E-mail inválido',
      'Email not confirmed': 'E-mail não confirmado. Verifique sua caixa de entrada.',
      'signup_disabled': 'Cadastro temporariamente desabilitado',
      'Email rate limit exceeded': 'Muitas tentativas. Tente novamente em alguns minutos.',
      'Signup requires a valid password': 'Senha inválida'
    }
    
    return errorMessages[error.message] || error.message || 'Erro desconhecido'
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}