import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificação mais flexível para compatibilidade universal
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase inicializado com sucesso')
  } catch (error) {
    console.warn('Erro ao inicializar Supabase:', error)
  }
} else {
  console.warn('Variáveis do Supabase não encontradas. Usando sistema de autenticação local.')
}

export { supabase }

// Disponibilizar globalmente para compatibilidade
if (typeof window !== 'undefined') {
  window.supabase = supabase
}

// Funções de autenticação
export const auth = {
  // Login com email e senha
  async signIn(email, password) {
    if (!supabase) {
      throw new Error('Supabase não disponível')
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Registro com email e senha
  async signUp(email, password, fullName) {
    if (!supabase) {
      throw new Error('Supabase não disponível')
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })
    return { data, error }
  },

  // Login com Google
  async signInWithGoogle() {
    if (!supabase) {
      throw new Error('Supabase não disponível')
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Login com LinkedIn
  async signInWithLinkedIn() {
    if (!supabase) {
      throw new Error('Supabase não disponível')
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Logout
  async signOut() {
    if (!supabase) {
      throw new Error('Supabase não disponível')
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obter usuário atual
  async getCurrentUser() {
    if (!supabase) {
      throw new Error('Supabase não disponível')
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Obter perfil do usuário
  async getUserProfile(userId) {
    if (!supabase) {
      throw new Error('Supabase não disponível')
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Atualizar perfil do usuário
  async updateUserProfile(userId, updates) {
    if (!supabase) {
      throw new Error('Supabase não disponível')
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  }
}

// Função utilitária para verificar se Supabase está disponível
export const isSupabaseAvailable = () => {
  return supabase !== null
}

// Função para inicializar Supabase manualmente (se necessário)
export const initializeSupabase = (url, key) => {
  try {
    supabase = createClient(url, key)
    if (typeof window !== 'undefined') {
      window.supabase = supabase
    }
    return true
  } catch (error) {
    console.error('Erro ao inicializar Supabase:', error)
    return false
  }
}