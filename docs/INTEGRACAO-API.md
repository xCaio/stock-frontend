# Integração com a API

Mapeamento entre o frontend e a [Stock API](https://github.com/xCaio/stock).

**Base URL (produção):** `https://stock-production-d03d.up.railway.app`

---

## Autenticação

### Login

```
POST /auth/login
Content-Type: application/json

{ "email": "...", "password": "..." }
```

**Resposta:**

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer"
}
```

### Registro

```
POST /auth/register
{ "name": "...", "email": "...", "password": "..." }
```

### Perfil do usuário logado (obrigatório)

```
GET /auth/me
Authorization: Bearer <token>
```

**Resposta esperada:**

```json
{
  "id": 1,
  "name": "Caio",
  "email": "caio@email.com",
  "role": "admin"
}
```

> **Importante:** Adicione esta rota no backend se ainda não existir:

```python
@auth_router.get('/me')
async def me(user: User = Depends(verify_token)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
    }
```

`GET /users/` **não** serve para isso — exige admin e retorna 401 para usuários comuns.

### Refresh

```
GET /auth/refresh
Authorization: Bearer <token>
```

---

## Produtos

| Método | Endpoint | Auth | Admin | Uso no frontend |
|--------|----------|:----:|:-----:|-----------------|
| GET | `/supplies/products` | ✅ | | Listagem + filtros |
| POST | `/supplies/products` | ✅ | ✅ | Criar produto |
| GET | `/supplies/products/{code}` | ✅ | | Detalhe |
| PUT | `/supplies/products/{code}` | ✅ | | Editar |
| PATCH | `/supplies/products/{code}/active` | ✅ | ✅ | Ativar |
| PATCH | `/supplies/products/{code}/inactive` | ✅ | ✅ | Inativar |
| GET | `/supplies/products/low-stock` | ✅ | | Dashboard |
| POST | `/supplies/products/{code}/entry` | ✅ | | Entrada |
| POST | `/supplies/products/{code}/exit` | ✅ | | Saída |
| GET | `/supplies/products/{code}/movements` | ✅ | | Histórico do produto |

### Criar produto

```json
POST /supplies/products
{
  "code": "ETQ-001",
  "product_type": "etiqueta",
  "stock": 100,
  "stock_minimum": 10
}
```

`product_type` aceito: `"etiqueta"` ou `"ribbon"` (minúsculo).

### Formatos de resposta tratados pelo frontend

O frontend normaliza respostas que vêm em formatos diferentes:

| Endpoint | Formato bruto | Normalizado |
|----------|---------------|-------------|
| `GET /supplies/products` | `[...]` | array de produtos |
| `GET /supplies/products/{code}` | `{ "product": {...} }` | objeto produto |
| `GET /supplies/products/low-stock` | `{ "products": [...] }` | array |
| `GET /supplies/products/{code}/movements` | `{ "movements": [...] }` | array |
| `GET /movements/` | `[...]` | array |

### Movimentações — tipos

| API (banco) | Frontend |
|-------------|----------|
| `entrada` | Entrada |
| `saida` | Saída |

---

## Dashboard

```
GET /dashboard/
```

Sem autenticação. Resposta aninhada:

```json
{
  "cards": {
    "total_produtos": 150,
    "entradas_hoje": 3,
    "saidas_hoje": 1,
    "sem_estoque": 0,
    "estoque_baixo": {
      "total": 2,
      "produtos": [
        { "code": "ETQ-001", "stock": 5, "stock_minimum": 10 }
      ]
    }
  }
}
```

---

## Movimentações globais

```
GET /movements/?product_code=&movement_type=&start=&end=
```

Filtro `movement_type` na API: `entrada` ou `saida`.

O frontend envia `entrada`/`saida` e exibe como Entrada/Saída. Enriquece `product_code` cruzando `product_id` com a listagem de produtos.

---

## Usuários (admin)

| Método | Endpoint |
|--------|----------|
| GET | `/users/` |
| GET | `/users/{id}` |
| PUT | `/users/{id}` |
| PATCH | `/users/{id}/role` |

---

## Cliente HTTP (`src/api/client.ts`)

- Base URL: `import.meta.env.VITE_API_URL`
- Token: `localStorage.access_token`
- Header: `Authorization: Bearer <token>`
- Erros: classe `ApiError` com status e mensagem da API

---

## Correções necessárias no backend

Para integração completa com este frontend:

1. **`GET /auth/me`** — perfil do usuário logado
2. **CORS** — se o frontend não usar proxy (produção)
3. **`schemas.py`** — validadores Pydantic v2 com `@classmethod` para `product_type` minúsculo
4. **Filtro por tipo** — comparação case-insensitive (já corrigido em `supplies_routes.py`)

Repositório backend local: `D:\stock`
