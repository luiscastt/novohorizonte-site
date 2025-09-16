import { auth } from '../lib/supabase.js'

export class AuthModal {
  constructor() {
    this.isOpen = false
    this.currentMode = 'login' // 'login' ou 'register'
    this.init()
  }

  init() {
    this.createModal()
    this.attachEventListeners()
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
              <button class="social-btn google-btn" id="google-login">
                <i class="fab fa-google"></i>
                Continuar com Google
              </button>
              <button class="social-btn linkedin-btn" id="linkedin-login">
                <i class="fab fa-linkedin-in"></i>
                Continuar com LinkedIn
              </button>
            </div>

            <div class="divider">
              <span>ou</span>
            </div>

            <!-- Formulário de login/registro -->
            <form id="auth-form" class="auth-form">
              <div class="form-group" id="name-group" style="display: none;">
                <input type="text" id="full-name" placeholder="Nome completo" required>
              </div>
              
              <div class="form-group">
                <input type="email" id="email" placeholder="E-mail" required>
              </div>
              
              <div class="form-group">
                <input type="password" id="password" placeholder="Senha" required>
              </div>

              <button type="submit" class="auth-submit-btn" id="auth-submit">
                Entrar
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
    document.getElementById('auth-modal').addEventListener('click', (e) => {
      if (e.target.id === 'auth-modal' || e.target.classList.contains('auth-close')) {
        this.close()
      }
    })

    // Alternar entre login e registro
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const mode = e.target.dataset.mode
        this.switchMode(mode)
      })
    })

    // Link para alternar modo
    document.getElementById('switch-mode').addEventListener('click', (e) => {
      e.preventDefault()
      const newMode = this.currentMode === 'login' ? 'register' : 'login'
      this.switchMode(newMode)
    })

    // Formulário de autenticação
    document.getElementById('auth-form').addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleFormSubmit()
    })

    // Login com Google
    document.getElementById('google-login').addEventListener('click', () => {
      this.handleSocialLogin('google')
    })

    // Login com LinkedIn
    document.getElementById('linkedin-login').addEventListener('click', () => {
      this.handleSocialLogin('linkedin')
    })
  }

  open(mode = 'login') {
    this.currentMode = mode
    this.switchMode(mode)
    document.getElementById('auth-modal').style.display = 'block'
    document.body.style.overflow = 'hidden'
    this.isOpen = true
  }

  close() {
    document.getElementById('auth-modal').style.display = 'none'
    document.body.style.overflow = 'auto'
    this.isOpen = false
    this.clearForm()
    this.clearMessage()
  }

  switchMode(mode) {
    this.currentMode = mode
    
    // Atualizar tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode)
    })

    // Atualizar conteúdo
    if (mode === 'login') {
      document.getElementById('auth-title').textContent = 'Entrar'
      document.getElementById('auth-submit').textContent = 'Entrar'
      document.getElementById('name-group').style.display = 'none'
      document.getElementById('auth-switch').innerHTML = 
        'Não tem uma conta? <a href="#" id="switch-mode">Cadastre-se</a>'
    } else {
      document.getElementById('auth-title').textContent = 'Cadastrar'
      document.getElementById('auth-submit').textContent = 'Cadastrar'
      document.getElementById('name-group').style.display = 'block'
      document.getElementById('auth-switch').innerHTML = 
        'Já tem uma conta? <a href="#" id="switch-mode">Entre</a>'
    }

    // Reattach event listener para o novo link
    document.getElementById('switch-mode').addEventListener('click', (e) => {
      e.preventDefault()
      const newMode = this.currentMode === 'login' ? 'register' : 'login'
      this.switchMode(newMode)
    })

    this.clearForm()
    this.clearMessage()
  }

  async handleFormSubmit() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const fullName = document.getElementById('full-name').value

    this.showMessage('Processando...', 'info')

    try {
      let result
      
      if (this.currentMode === 'login') {
        result = await auth.signIn(email, password)
      } else {
        if (!fullName.trim()) {
          this.showMessage('Nome completo é obrigatório', 'error')
          return
        }
        result = await auth.signUp(email, password, fullName)
      }

      if (result.error) {
        this.showMessage(this.getErrorMessage(result.error), 'error')
      } else {
        if (this.currentMode === 'register') {
          this.showMessage('Conta criada com sucesso! Verifique seu e-mail.', 'success')
        } else {
          this.showMessage('Login realizado com sucesso!', 'success')
          setTimeout(() => {
            this.close()
            window.location.reload()
          }, 1500)
        }
      }
    } catch (error) {
      this.showMessage('Erro inesperado. Tente novamente.', 'error')
    }
  }

  async handleSocialLogin(provider) {
    this.showMessage('Redirecionando...', 'info')
    
    try {
      let result
      if (provider === 'google') {
        result = await auth.signInWithGoogle()
      } else if (provider === 'linkedin') {
        result = await auth.signInWithLinkedIn()
      }

      if (result.error) {
        this.showMessage(this.getErrorMessage(result.error), 'error')
      }
    } catch (error) {
      this.showMessage('Erro ao conectar com ' + provider, 'error')
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

  getErrorMessage(error) {
    const errorMessages = {
      'Invalid login credentials': 'E-mail ou senha incorretos',
      'User already registered': 'Este e-mail já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Invalid email': 'E-mail inválido',
      'Email not confirmed': 'E-mail não confirmado. Verifique sua caixa de entrada.'
    }
    
    return errorMessages[error.message] || error.message || 'Erro desconhecido'
  }
}