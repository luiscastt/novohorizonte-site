# novohorizonte-site
Site para empresa familiar.

## 🚀 Deploy

### GitHub Pages
Este site está configurado para deploy automático no GitHub Pages via GitHub Actions.

### Configuração do Supabase
Para funcionar corretamente, você precisa configurar as seguintes variáveis de ambiente no GitHub:

1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Adicione os seguintes secrets:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase

### Como obter as chaves do Supabase:
1. Acesse [supabase.com](https://supabase.com)
2. Vá no seu projeto
3. Settings → API
4. Copie a **URL** e **anon public key**

## 🛠️ Desenvolvimento Local

```bash
npm install
npm run dev
```

## 📦 Build

```bash
npm run build
npm run preview
```