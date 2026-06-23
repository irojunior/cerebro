# cérebro

Hub de integração que conecta o **ClickUp** ao **Supabase** — leitura, escrita e
sincronização completa.

## Stack

- Node.js + TypeScript
- API v2 do ClickUp
- Supabase (persistência / sync)

## Setup

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie o exemplo de variáveis e preencha com suas credenciais:
   ```bash
   cp .env.example .env
   ```
   - `CLICKUP_API_TOKEN`: Personal API Token (ClickUp → Settings → Apps). Começa com `pk_`.
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`: do projeto Supabase.
3. Teste a conexão com o ClickUp:
   ```bash
   npm run clickup:ping
   ```
4. Mapeie a estrutura do workspace (spaces, folders, lists):
   ```bash
   npm run clickup:bootstrap
   ```

## Scripts

| Comando                     | O que faz                                            |
| --------------------------- | ---------------------------------------------------- |
| `npm run clickup:ping`      | Testa o token e lista os workspaces acessíveis       |
| `npm run clickup:bootstrap` | Mapeia spaces → folders → lists e seus IDs           |
| `npm run typecheck`         | Checagem de tipos                                    |
| `npm run build`             | Compila para `dist/`                                 |

## Estrutura

```
src/
  config.ts            # carrega .env e valida credenciais
  clickup/client.ts    # cliente da API v2 do ClickUp
  scripts/ping.ts      # teste de conexão
  scripts/bootstrap.ts # descoberta da estrutura do workspace
  index.ts             # entrypoint / exports
```

> ⚠️ O arquivo `.env` contém segredos e **nunca** é versionado (ver `.gitignore`).
