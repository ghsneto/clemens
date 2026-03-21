# Clemens Monorepo

Plataforma de gestão eclesiástica para EBD com frontend React (mobile-first, Liquid Glass) e backend Hono em Cloudflare Workers.

## Estrutura

- `apps/web`: React + Vite + Tailwind + componentes no padrão shadcn/ui
- `apps/worker`: Hono + Cloudflare Worker + D1 + R2

## Executar localmente

```bash
npm install
npm run dev:worker
npm run dev:web
```

## Configuração do Cloudflare

1. Atualize `apps/worker/wrangler.toml` com o `database_id` real do D1.
2. Crie os buckets R2 de produção e preview conforme os nomes do arquivo.
3. Rode a migração:

```bash
npm run db:migrate -w @clemens/worker
```

## Login inicial (seed)

- Nome do Cliente: `cliente-demo`
- Senha: `123456`

## Endpoints principais

- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/members`
- `POST /api/attendance/register`
- `GET /api/offerings/total`
- `GET /api/reports/sunday`
- `GET /api/reports/annual`
- `GET/POST /api/meeting-minutes`
- `GET/POST /api/agenda-events`
- `GET/POST /api/library/files|upload`
