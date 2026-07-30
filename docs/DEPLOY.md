# Deploy

Guia para publicar o **Stock Frontend** e configurar o backend para aceitar requisições do navegador.

---

## Frontend

### 1. Build

```powershell
cd D:\stock-frontend
npm run build
```

Saída em `dist/`.

### 2. Variável de ambiente (produção)

No serviço de hospedagem (Vercel, Netlify, Railway, etc.):

```env
VITE_API_URL=https://stock-production-d03d.up.railway.app
```

> Variáveis `VITE_*` são embutidas no build. Configure **antes** de rodar `npm run build` ou use o painel do provedor com rebuild automático.

### 3. Hospedagem sugerida

| Plataforma | Tipo | Observação |
|------------|------|------------|
| [Vercel](https://vercel.com) | Static | Conecte o repo, build `npm run build`, output `dist` |
| [Netlify](https://netlify.com) | Static | Idem |
| [Railway](https://railway.app) | Static / Node | Pode hospedar junto com a API |

### 4. SPA — fallback de rotas

Configure redirect para `index.html` em todas as rotas (React Router):

```
/*  /index.html  200
```

Vercel e Netlify fazem isso automaticamente para SPAs Vite.

---

## Backend (requisitos para produção)

### CORS

No `main.py` do backend (`D:\stock`):

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://SEU-FRONTEND.vercel.app",  # URL real do frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Deploy no Railway após alteração.

### Endpoint `/auth/me`

Obrigatório para o login funcionar corretamente. Veja [INTEGRACAO-API.md](INTEGRACAO-API.md).

### product_type

Garanta que `schemas.py` normaliza para minúsculo:

```python
@field_validator("product_type", mode="before")
@classmethod
def normalize_product_type(cls, value):
    return normalize_product_type_value(value)
```

---

## Deploy do backend (Railway)

```powershell
cd D:\stock
git add .
git commit -m "feat: CORS, auth/me e normalização de product_type"
git push origin main
```

O Railway redeploya automaticamente se conectado ao GitHub.

**URL atual:** https://stock-production-d03d.up.railway.app

---

## Checklist pós-deploy

- [ ] Frontend abre sem erro
- [ ] Login funciona
- [ ] Dashboard carrega métricas
- [ ] Listagem de produtos OK
- [ ] Cadastro salva `etiqueta` ou `ribbon` no banco
- [ ] Entrada/saída registra movimentação
- [ ] `/movimentacoes` mostra código do produto
- [ ] Admin acessa `/usuarios`

---

## Ambientes

| Ambiente | Frontend | API | CORS |
|----------|----------|-----|------|
| Local (dev) | localhost:5173 | Railway via proxy `/api` | Não necessário |
| Produção | domínio do frontend | Railway | **Obrigatório** |
