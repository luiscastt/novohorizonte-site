import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
    console.log('Supabase inicializado com sucesso')
  } catch (error) {
    console.warn('Erro ao inicializar Supabase:', error)
  }
} else {
  console.warn('Variáveis do Supabase não encontradas. Sistema funcionará em modo local.')
}

export { supabase }

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
  window.supabase = supabase
}

// Função utilitária para verificar se Supabase está disponível
export const isSupabaseAvailable = () => {
  return supabase !== null
}

// Função para lidar com callback de OAuth
export const handleAuthCallback = async () => {
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  } catch (error) {
    console.error('Erro no callback de autenticação:', error)
    return null
  }
}