import { AuthModal } from './components/AuthModal.js'
import { UserManager } from './components/UserManager.js'

// Inicializar sistema de autenticação
document.addEventListener('DOMContentLoaded', () => {
  // Criar instâncias dos componentes
  const authModal = new AuthModal()
  const userManager = new UserManager()

  // Configurar botão de login
  const loginBtn = document.getElementById('login-btn')
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      authModal.open('login')
    })
  }

  // Verificar se há callback de OAuth
  const urlParams = new URLSearchParams(window.location.search)
  if (window.location.pathname === '/auth/callback' || urlParams.has('code')) {
    // Redirecionar para a página inicial após callback
    window.history.replaceState({}, document.title, '/')
  }

  // Tornar disponível globalmente para debug (opcional)
  window.authModal = authModal
  window.userManager = userManager
})