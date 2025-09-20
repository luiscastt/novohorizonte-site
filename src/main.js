import { AuthModal } from './components/AuthModal.js'
import { UserManager } from './components/UserManager.js'
import { isSupabaseAvailable, handleAuthCallback } from './lib/supabase.js'

/**
 * Inicialização do sistema modernizado
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando sistema...')
  console.log('Supabase disponível:', isSupabaseAvailable())
  
  // Criar instâncias dos componentes
  const authModal = new AuthModal()
  const userManager = new UserManager()

  // Configurar botão de login
  const loginBtn = document.getElementById('login-btn')
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      authModal.open('login')
    })
  } else {
    console.warn('Botão de login não encontrado')
  }

  // Lidar com callback de OAuth
  const urlParams = new URLSearchParams(window.location.search)
  if (isSupabaseAvailable() && urlParams.has('code')) {
    handleAuthCallback().then(session => {
      if (session) {
        console.log('Callback de autenticação processado com sucesso')
        // Limpar URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    })
  }

  // Tornar disponível globalmente
  if (typeof window !== 'undefined') {
    window.authModal = authModal
    window.userManager = userManager
    
    // Função de debug
    window.testAuth = () => {
      console.log('Estado atual da autenticação:')
      console.log('- Usuário logado:', userManager.isLoggedIn())
      console.log('- Usuário atual:', userManager.getUser())
      console.log('- Perfil do usuário:', userManager.getUserProfile())
      console.log('- Supabase disponível:', isSupabaseAvailable())
    }
  }
  
}
)