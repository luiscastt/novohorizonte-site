import { AuthModal } from './components/AuthModal.js'
import { UserManager } from './components/UserManager.js'
import { isSupabaseAvailable } from './lib/supabase.js'

/**
 * Inicialização universal do sistema de autenticação
 * Compatível com qualquer ambiente de hospedagem
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando sistema de autenticação...')
  console.log('Supabase disponível:', isSupabaseAvailable())
  
  // Criar instâncias dos componentes
  const authModal = new AuthModal()
  const userManager = new UserManager()

  // Configurar botão de login
  const loginBtn = document.getElementById('login-btn')
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      console.log('Botão de login clicado')
      authModal.open('login')
    })
  } else {
    console.warn('Botão de login não encontrado')
  }

  // Verificar se há callback de OAuth (apenas se Supabase estiver disponível)
  const urlParams = new URLSearchParams(window.location.search)
  if (isSupabaseAvailable() && (window.location.pathname === '/auth/callback' || urlParams.has('code'))) {
    // Redirecionar para a página inicial após callback
    window.history.replaceState({}, document.title, '/')
  }

  // Configurar tratamento de erros global
  window.addEventListener('error', (e) => {
    console.error('Erro global capturado:', e.error)
  })
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada não tratada:', e.reason)
  })

  // Tornar disponível globalmente para debug (opcional)
  if (typeof window !== 'undefined') {
    window.authModal = authModal
    window.userManager = userManager
    
    // Função de debug para testar autenticação
    window.testAuth = () => {
      console.log('Estado atual da autenticação:')
      console.log('- Usuário logado:', userManager.isLoggedIn())
      console.log('- Usuário atual:', userManager.getUser())
      console.log('- Perfil do usuário:', userManager.getUserProfile())
      console.log('- Sistema de auth:', userManager.authSystem)
    }
  }
  
  console.log('Sistema de autenticação inicializado com sucesso')
})

// Função para reinicializar o sistema se necessário
export const reinitializeAuth = () => {
  console.log('Reinicializando sistema de autenticação...')
  window.location.reload()
}

// Exportar para uso em outros módulos
export { AuthModal, UserManager }