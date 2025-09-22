import { AuthModal } from './components/AuthModal.js'
import { UserManager } from './components/UserManager.js'

/**
 * Inicialização do sistema local simplificado
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando sistema local...')
  
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
      console.log('- Sistema local ativo')
    }
  }
}
)