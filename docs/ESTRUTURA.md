# Estrutura do projeto

```
stock-frontend/
├── public/
│   └── favicon.svg          # Ícone da aplicação
├── src/
│   ├── api/                 # Camada de comunicação com a API
│   │   ├── client.ts        # fetch base, token, ApiError
│   │   ├── auth.ts          # login, register, getCurrentUser
│   │   ├── products.ts      # produtos e movimentações por produto
│   │   ├── movements.ts     # histórico global
│   │   ├── dashboard.ts     # métricas do dashboard
│   │   └── users.ts         # gestão de usuários
│   ├── components/
│   │   ├── Layout.tsx       # shell: sidebar + outlet
│   │   ├── ProtectedRoute.tsx
│   │   ├── ui.tsx           # PageHeader, Modal, NumberField, etc.
│   │   ├── MovementList.tsx # feed de movimentações
│   │   └── ProductTypeBadge.tsx
│   ├── constants/
│   │   └── products.ts      # tipos etiqueta/ribbon, labels
│   ├── context/
│   │   └── AuthContext.tsx  # estado global de autenticação
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── MovementsPage.tsx
│   │   └── UsersPage.tsx
│   ├── types/
│   │   └── index.ts         # interfaces TypeScript
│   ├── App.tsx              # rotas
│   ├── main.tsx             # entry point
│   └── index.css            # estilos globais
├── docs/                    # documentação
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts           # proxy /api → Railway
└── README.md
```

---

## Fluxo de dados

```
Pages → api/* → client.ts → Stock API (Railway)
                ↑
         AuthContext (token)
```

---

## Rotas (`App.tsx`)

```
/login, /register          → públicas
/                          → ProtectedRoute → Layout
  ├── /                    → DashboardPage
  ├── /produtos            → ProductsPage
  ├── /produtos/:code      → ProductDetailPage
  ├── /movimentacoes       → MovementsPage
  └── /usuarios            → AdminRoute → UsersPage
```

---

## Convenções

| Item | Padrão |
|------|--------|
| Tipos de produto (API) | `etiqueta`, `ribbon` |
| Tipos de produto (UI) | Etiqueta, Ribbon |
| Movimentações (API) | `entrada`, `saida` |
| Movimentações (UI) | Entrada, Saída |
| Token | `localStorage.access_token` |
| E-mail logado | `localStorage.user_email` |

---

## Adicionar nova tela

1. Crie `src/pages/NovaPage.tsx`
2. Registre a rota em `App.tsx`
3. Adicione link em `Layout.tsx` (sidebar)
4. Se precisar de API, crie funções em `src/api/`
5. Tipos em `src/types/index.ts`
