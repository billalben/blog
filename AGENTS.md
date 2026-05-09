# AGENTS.md

## Repository

pnpm monorepo — all commands require `--filter <app>`.

| App                   | Status            | Stack                                          |
| --------------------- | ----------------- | ---------------------------------------------- |
| `apps/server-express` | Implemented       | Express 5, Mongoose, Zod, JWT, OpenAPI, Vitest |
| `apps/client-react`   | Empty placeholder | Not yet scaffolded                             |

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
