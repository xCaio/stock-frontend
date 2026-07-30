# Funcionalidades

Detalhamento das telas, fluxos e regras de negócio implementadas no frontend.

---

## Autenticação

### Login (`/login`)

- Campos: e-mail e senha
- Chama `POST /auth/login`
- Armazena `access_token` no `localStorage`
- Redireciona para o dashboard após sucesso

### Registro (`/register`)

- Campos: nome, e-mail, senha (mín. 6 caracteres)
- Chama `POST /auth/register` e faz login automático

### Sessão

- Token JWT enviado em `Authorization: Bearer <token>`
- Perfil carregado via `GET /auth/me`
- Logout limpa token e e-mail armazenados

---

## Dashboard (`/`)

Exibe visão geral do estoque:

| Card | Origem |
|------|--------|
| Total em estoque | Soma de unidades (`dashboard.cards.total_produtos`) |
| Entradas hoje | Movimentações de entrada do dia |
| Saídas hoje | Movimentações de saída do dia |
| Estoque baixo | Produtos com `stock <= stock_minimum` |
| Sem estoque | Produtos com estoque zero |

Tabela inferior lista produtos com estoque baixo, com link para o detalhe.

---

## Produtos (`/produtos`)

### Listagem

- Busca por código (debounce 300 ms)
- Filtro por tipo: **Etiqueta** / **Ribbon**
- Filtro por status: Ativo / Inativo
- Badge colorido por tipo
- Destaque amarelo quando estoque ≤ mínimo

### Cadastro (admin)

Modal **Novo produto** com:

| Campo | Regra |
|-------|-------|
| Código | Texto livre; enviado em maiúsculo para a API |
| Tipo | Select: Etiqueta ou Ribbon |
| Estoque inicial | Número inteiro ≥ 0 |
| Estoque mínimo | Número inteiro ≥ 0 |

Tipos salvos no banco: `etiqueta` ou `ribbon` (minúsculo).

### Ações (admin)

- **Ativar / Inativar** produto
- **Detalhes** — abre página do produto

---

## Detalhe do produto (`/produtos/:code`)

### Informações

- Código, tipo, estoque atual, mínimo, status

### Movimentações

- **Entrada** — aumenta estoque (`POST .../entry`)
- **Saída** — diminui estoque (`POST .../exit`)
- Campos: quantidade (obrigatório) e observação (opcional)
- Histórico em cards com:
  - Tipo (entrada/saída)
  - Quantidade (+/−)
  - Estoque antes → depois
  - Data e observação

### Edição (admin)

- Alterar código e tipo (select Etiqueta/Ribbon)

---

## Movimentações (`/movimentacoes`)

Histórico global de entradas e saídas.

### Filtros

- Código do produto
- Tipo: Entrada / Saída
- Período: data início e fim

### Resumo

Cards com totais de entradas/saídas e unidades movimentadas (com base nos resultados filtrados).

### Listagem

Cards por movimentação com link para o produto, badge de tipo, quantidade, estoque antes/depois e data.

---

## Usuários (`/usuarios`) — admin

- Listagem de todos os usuários
- Edição de nome, e-mail e role (`user` / `admin`)

---

## Componentes reutilizáveis

| Componente | Função |
|------------|--------|
| `Layout` | Sidebar + navegação |
| `ProtectedRoute` | Exige autenticação |
| `AdminRoute` | Exige role admin |
| `ProductTypeBadge` | Exibe Etiqueta/Ribbon com cor |
| `MovementList` | Feed visual de movimentações |
| `NumberField` | Input numérico editável (sem bug do 0 fixo) |
| `StatCard` | Cards de métricas |

---

## Tipos de produto

| Banco (API) | Interface |
|-------------|-----------|
| `etiqueta` | Etiqueta (badge azul) |
| `ribbon` | Ribbon (badge roxo) |

Validação no frontend e backend — apenas esses dois valores são aceitos.
