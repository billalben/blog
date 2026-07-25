# AGENTS.md

## Repository

pnpm monorepo — all commands require `--filter <app>`.

| App                   | Status            | Stack                                          |
| --------------------- | ----------------- | ---------------------------------------------- |
| `apps/server-express` | Implemented       | Express 5, Mongoose, Zod, JWT, OpenAPI, Vitest |
| `apps/client-react`   | Implemented       | React 19, Vite 8, antd 6, TanStack Query 5, Zod    |

## server-express

### Setup

```bash
pnpm --filter server-express dev
```

### Commands (run from repo root)

| Command                               | Action                                                      |
| ------------------------------------- | ----------------------------------------------------------- |
| `pnpm --filter server-express dev`    | Dev server with nodemon + ts-node                           |
| `pnpm --filter server-express build`  | `tsc && tsc-alias` (path aliases in output)                 |
| `pnpm --filter server-express test`   | Vitest (supertest, mongodb-memory-server)                   |
| `pnpm --filter server-express lint`   | ESLint flat config                                          |
| `pnpm --filter server-express format` | Prettier (semicolons, **double quotes**, trailingComma es5) |
| `pnpm --filter server-express knip`   | Dead code analysis                                          |

### Testing

- Uses `mongodb-memory-server` — in-memory MongoDB spun up per test file
- **Hook timeout: 120s**, test timeout: 30s (DB startup can be slow)
- Run a single test: `pnpm --filter server-express vitest run src/__tests__/auth/login.test.ts`
- Tests assume clean DB state — do not rely on persisted data across tests

### Architecture notes

- Entry: `src/server.ts` → connects DB, starts Express. App wiring in `src/app.ts`
- Path alias `@/*` maps to `src/*` (configured in tsconfig.json and vitest.config.ts)
- All routes mounted under `/api/v1`; Swagger UI at `/docs`
- Authentication: Bearer token middleware in `src/middlewares/authenticate.ts`. Authorization roles in `src/middlewares/authorize.ts`
- Validation: Zod schemas in `src/schemas/` applied via `src/middlewares/validate.ts`
- OpenAPI spec auto-generated from Zod schemas using `zod-to-openapi`

## client-react

### Setup

```bash
pnpm --filter client-react dev
```

### Commands (run from repo root)

| Command                              | Action                                          |
| ------------------------------------ | ----------------------------------------------- |
| `pnpm --filter client-react dev`     | Vite dev server (default: http://localhost:5173) |
| `pnpm --filter client-react build`   | `tsc -b && vite build`                           |
| `pnpm --filter client-react preview` | Preview production build                        |
| `pnpm --filter client-react lint`    | ESLint flat config                               |
| `pnpm --filter client-react format`  | Prettier (semicolons, **double quotes**, trailingComma es5) |
| `pnpm --filter client-react knip`    | Dead code analysis                              |

### Architecture notes

- Entry: `src/main.tsx` → renders `src/app/App.tsx`
- Path alias `@/*` maps to `src/*` (configured in tsconfig.app.json and vite.config.ts)
- Feature-based folder structure under `src/features/` — each feature has `api/`, `queries/`, `mutations/`, `schemas/`, `pages/`, `components/`
- Shared code in `src/shared/` (lib, types, components, hooks, utils)
- App-level providers in `src/app/providers/` (Theme, Query, Auth)
- Routing via `react-router-dom` v7 in `src/app/router/router.tsx`
- Dev proxy: `/api` → `http://localhost:3000` (Vite config)
- API base URL from env: `VITE_API_BASE_URL` (default: `/api/v1`)
- Auth: access token in memory via `tokenStore` + refresh via httpOnly cookie + axios interceptor for transparent 401 retry
- Dark mode: persisted `localStorage["theme"]`, defaults to system preference, antd ConfigProvider `theme.algorithm`
- Query key factories per feature for safe cache invalidation
- Uses antd 6 components (Layout, Form, Table, Card, etc.) for UI; zod for client-side form validation
