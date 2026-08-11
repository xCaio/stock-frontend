# Stock Frontend

Interface web para o sistema **Stock** — controle de estoque de insumos (etiquetas e ribbons), integrada à [API FastAPI](https://github.com/xCaio/stock) em produção.

**API em produção:** https://api.cain.dev.br/docs

---

## Sumário

- [Visão geral](#visão-geral)
- [Stack](#stack)
- [Início rápido](#início-rápido)
- [Documentação](#documentação)
- [Permissões por perfil](#permissões-por-perfil)
- [Telas](#telas)
- [Scripts disponíveis](#scripts-disponíveis)
- [Links úteis](#links-úteis)

---

## Visão geral

Este frontend consome a Stock API e oferece:

- Autenticação (login, registro, sessão JWT)
- Dashboard com métricas e alertas de estoque baixo
- CRUD de produtos (admin)
- Entrada e saída de estoque
- Histórico de movimentações com filtros
- Gestão de usuários (admin)

O tipo de produto é salvo no banco em **minúsculo** (`etiqueta`, `ribbon`) e exibido na interface como **Etiqueta** e **Ribbon**.

---

## Stack

| Tecnologia | Uso |
|------------|-----|
| React 19 | Interface |
| TypeScript | Tipagem |
| Vite 6 | Build e dev server |
| React Router 7 | Navegação e rotas protegidas |

Sem biblioteca de UI externa — layout customizado em CSS com tema escuro.

---

## Início rápido

### Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior
- npm (incluso no Node.js)
- API Stock acessível (produção ou local)

### Instalação

```powershell
cd D:\stock-frontend
npm install
```

### Configurar ambiente

Copie o exemplo e ajuste se necessário:

```powershell
copy .env.example .env
```

Desenvolvimento local (recomendado — usa proxy e evita CORS):

```env
VITE_API_URL=/api
```

### Executar

```powershell
npm run dev
```

Acesse: **http://localhost:5173**

### Build de produção

```powershell
npm run build
npm run preview
```

Artefatos gerados em `dist/`.

---

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [docs/INSTALACAO.md](docs/INSTALACAO.md) | Setup detalhado, proxy, CORS, variáveis |
| [docs/FUNCIONALIDADES.md](docs/FUNCIONALIDADES.md) | Telas, fluxos e permissões |
| [docs/INTEGRACAO-API.md](docs/INTEGRACAO-API.md) | Endpoints usados, auth, formatos de resposta |
| [docs/VERCEL.md](docs/VERCEL.md) | **Deploy na Vercel — passo a passo** |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Deploy geral e requisitos do backend |
| [docs/ESTRUTURA.md](docs/ESTRUTURA.md) | Organização de pastas e arquivos |

---

## Permissões por perfil

| Ação | User | Admin |
|------|:----:|:-----:|
| Login / Registro | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Listar produtos | ✅ | ✅ |
| Entrada / Saída de estoque | ✅ | ✅ |
| Ver movimentações | ✅ | ✅ |
| Criar produto | ❌ | ✅ |
| Editar / Ativar / Inativar produto | ❌ | ✅ |
| Gerenciar usuários | ❌ | ✅ |

---

## Telas

| Rota | Descrição |
|------|-----------|
| `/login` | Autenticação |
| `/register` | Criação de conta |
| `/` | Dashboard |
| `/produtos` | Listagem e cadastro de produtos |
| `/produtos/:code` | Detalhe, entrada/saída e histórico |
| `/movimentacoes` | Histórico geral com filtros |
| `/usuarios` | Gestão de usuários (admin) |

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 5173) |
| `npm run build` | Compila TypeScript e gera build |
| `npm run preview` | Preview local do build de produção |

---

## Links úteis

- **Backend (GitHub):** https://github.com/xCaio/stock
- **API Docs (Swagger):** https://stock-production-d03d.up.railway.app/docs
- **Frontend local:** http://localhost:5173

---

## Repositórios relacionados

```
D:\stock           → Backend FastAPI (API)
D:\stock-frontend  → Frontend React (este projeto)
```

Para o sistema funcionar por completo, o backend precisa estar no ar com as rotas documentadas em [docs/INTEGRACAO-API.md](docs/INTEGRACAO-API.md).
