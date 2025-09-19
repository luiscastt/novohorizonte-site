# Sudeste Conservadora e Serviços Gerais
Site corporativo com sistema de autenticação universal.

## 🔐 Sistema de Autenticação

Este projeto possui um sistema de autenticação robusto e universal que funciona em qualquer ambiente:

### Características:
- **Compatibilidade Universal**: Funciona com ou sem Supabase
- **Fallback Inteligente**: Sistema local usando localStorage quando Supabase não está disponível
- **Validação em Tempo Real**: Feedback imediato para o usuário
- **Responsivo**: Interface otimizada para mobile e desktop
- **Seguro**: Tratamento adequado de erros e validações

### Funcionalidades:
- Login/Registro com email e senha
- Login social (Google/LinkedIn) quando disponível
- Gerenciamento de perfil de usuário
- Sistema de notificações
- Logout seguro

## 🚀 Deploy

### GitHub Pages
Este site está configurado para deploy automático no GitHub Pages via GitHub Actions.

### Configuração do Supabase
Para usar o Supabase (opcional), configure as seguintes variáveis de ambiente:

**Para GitHub Pages:**
1. **Settings** → **Secrets and variables** → **Actions**
2. Adicione os secrets:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase

**Para desenvolvimento local:**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### Como obter as chaves do Supabase:
1. Acesse [supabase.com](https://supabase.com)
2. Vá no seu projeto
3. Settings → API
4. Copie a **URL** e **anon public key**

**Nota**: O site funciona perfeitamente sem Supabase, usando sistema de autenticação local.

## 🛠️ Desenvolvimento Local

```bash
npm install
npm run dev
```

### Testando o Sistema de Autenticação

No console do navegador, você pode usar:
```javascript
// Verificar estado da autenticação
window.testAuth()

// Abrir modal de login
window.authModal.open('login')

// Verificar se usuário está logado
window.userManager.isLoggedIn()
```

## 📦 Build

```bash
npm run build
npm run preview
```

## 🔧 Correções Implementadas

- ✅ Sistema de autenticação universal (funciona em qualquer hospedagem)
- ✅ Validação robusta de formulários
- ✅ Tratamento de erros aprimorado
- ✅ Interface responsiva melhorada
- ✅ Compatibilidade cross-browser
- ✅ Fallback para ambientes sem Supabase
- ✅ Atualização do nome da empresa
- ✅ Substituição "Copeiro" → "Copeiragem"