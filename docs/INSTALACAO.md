# Instalação e configuração

Guia completo para rodar o **Stock Frontend** em ambiente local e conectá-lo à API.

---

## 1. Pré-requisitos

- **Node.js 18+** — verifique com `node -v`
- **npm** — verifique com `npm -v`
- API Stock disponível (Railway ou local)

---

## 2. Clonar / abrir o projeto

```powershell
cd D:\stock-frontend
npm install
```

---

## 3. Variáveis de ambiente

Arquivo `.env` na raiz do projeto:

### Desenvolvimento (recomendado)

```env
VITE_API_URL=/api
```

Com essa configuração, o Vite redireciona `/api/*` para a API em produção configurada em `vite.config.ts`:

```ts
const API_TARGET = "https://stock-production-d03d.up.railway.app";
```

**Por quê?** O backend não expõe CORS para `localhost` por padrão. O proxy faz as requisições pelo servidor do Vite, evitando bloqueio do navegador.

### Produção / API direta

```env
VITE_API_URL=https://stock-production-d03d.up.railway.app
```

Requer **CORS habilitado** no backend (veja [DEPLOY.md](DEPLOY.md)).

### Backend local

Se a API roda em `http://127.0.0.1:8000`, altere o `API_TARGET` em `vite.config.ts` e mantenha:

```env
VITE_API_URL=/api
```

---

## 4. Executar

```powershell
npm run dev
```

| URL | Descrição |
|-----|-----------|
| http://localhost:5173 | Frontend |
| http://localhost:5173/login | Tela de login |

Para parar: `Ctrl + C` no terminal.

---

## 5. Primeiro acesso

1. Acesse `/register` e crie uma conta, **ou**
2. Use credenciais existentes no `/login`
3. Para funções de admin, altere a role do usuário no banco ou via outro admin em `/usuarios`

---

## 6. Build de produção

```powershell
npm run build
npm run preview
```

O build gera a pasta `dist/` com arquivos estáticos prontos para deploy (Vercel, Netlify, Railway static, etc.).

---

## 7. Problemas comuns

### "Failed to fetch" no login

- **Causa:** CORS ou API offline.
- **Solução:** Use `VITE_API_URL=/api` e reinicie `npm run dev`.

### 401 após login

- **Causa:** Rota `/auth/me` ausente no backend (frontend precisa dela para identificar o usuário logado).
- **Solução:** Adicione o endpoint no backend — veja [INTEGRACAO-API.md](INTEGRACAO-API.md).

### Tipo do produto não filtra / não aparece

- **Causa:** Produtos antigos com `product_type` fora do padrão (`etiqueta` / `ribbon`).
- **Solução:** Atualize o backend (`schemas.py`) e edite/salve os produtos novamente como admin.

### Porta 5173 em uso

```powershell
# Encerre o processo ou altere a porta em vite.config.ts
```

---

## 8. Estrutura de arquivos de config

```
stock-frontend/
├── .env              # Variáveis locais (não commitar)
├── .env.example      # Modelo de variáveis
├── vite.config.ts    # Proxy e porta do dev server
├── tsconfig.json     # TypeScript
└── package.json      # Dependências e scripts
```
