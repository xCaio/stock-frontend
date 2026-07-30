# Deploy na Vercel — passo a passo

Guia rápido para publicar o **Stock Frontend** na [Vercel](https://vercel.com).

---

## Antes de começar

1. Conta na Vercel (pode logar com GitHub)
2. Backend no ar: https://stock-production-d03d.up.railway.app
3. **Push do backend** com CORS para Vercel (já configurado em `D:\stock\main.py`):

```powershell
cd D:\stock
git add main.py
git commit -m "fix: CORS para dominios vercel.app"
git push
```

Aguarde o Railway redeployar (~1–2 min).

---

## Opção A — Pelo site da Vercel (recomendado)

### 1. Subir o código para o GitHub

Se ainda não tiver repo do frontend:

```powershell
cd D:\stock-frontend
git init
git add .
git commit -m "feat: stock frontend pronto para deploy"
```

Crie o repositório no GitHub (ex: `xCaio/stock-frontend`) e conecte:

```powershell
git remote add origin https://github.com/SEU_USUARIO/stock-frontend.git
git branch -M main
git push -u origin main
```

### 2. Importar na Vercel

1. Acesse https://vercel.com/new
2. **Import Git Repository** → selecione `stock-frontend`
3. Configure o projeto:

| Campo | Valor |
|-------|-------|
| Framework Preset | **Vite** (detectado automaticamente) |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 3. Variável de ambiente (obrigatório)

Em **Environment Variables**, adicione:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://stock-production-d03d.up.railway.app` |

Marque **Production**, **Preview** e **Development**.

> Sem essa variável, o build não aponta para a API correta.

### 4. Deploy

Clique **Deploy** e aguarde o build.

URL gerada: `https://stock-frontend-xxxx.vercel.app` (ou nome customizado).

---

## Opção B — Pela CLI

```powershell
cd D:\stock-frontend
npm install -g vercel
vercel login
vercel
```

Na primeira execução, responda às perguntas e confirme o projeto.

Adicione a variável de ambiente:

```powershell
vercel env add VITE_API_URL production
# Cole: https://stock-production-d03d.up.railway.app

vercel --prod
```

---

## Arquivo `vercel.json`

Já incluído no projeto — garante que rotas do React Router (`/produtos`, `/login`, etc.) funcionem ao recarregar a página:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Checklist pós-deploy

- [ ] Site abre na URL da Vercel
- [ ] Login funciona (sem "Failed to fetch")
- [ ] Dashboard carrega
- [ ] Produtos listam
- [ ] Entrada/saída registra

### Se der "Failed to fetch"

1. Confirme `VITE_API_URL` nas env vars da Vercel
2. Faça **Redeploy** (Deployments → ⋮ → Redeploy) após adicionar a variável
3. Confirme que o backend no Railway foi atualizado com CORS `*.vercel.app`

### Se login falhar com 401

Confirme que `GET /auth/me` existe no backend em produção.

---

## Domínio customizado (opcional)

Vercel → Project → **Settings** → **Domains** → adicione seu domínio.

Se usar domínio próprio, atualize o CORS no backend (`main.py`):

```python
allow_origins=[
    "http://localhost:5173",
    "https://seu-dominio.com.br",
],
```

---

## Resumo

| Item | Valor |
|------|-------|
| Build | `npm run build` |
| Output | `dist/` |
| Env produção | `VITE_API_URL=https://stock-production-d03d.up.railway.app` |
| API | https://stock-production-d03d.up.railway.app |
