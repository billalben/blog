# server

Express REST API for the blog application.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens)
- **Validation:** Zod
- **Docs:** OpenAPI (zod-to-openapi + Swagger UI)
- **Testing:** Vitest + Supertest + mongodb-memory-server
- **Dead code analysis:** Knip

## Project Structure

```
src/
├── __tests__/        # Test suites (auth/, users/)
├── config/           # App configuration
├── controllers/      # Route handlers (v1/auth/, v1/user/)
├── lib/              # Utilities (jwt, response, winston, etc.)
├── middlewares/      # authenticate, authorize, validate
├── models/           # Mongoose models (User, Token)
├── routes/           # Express routers (v1/auth, v1/users)
├── schemas/          # Zod schemas + OpenAPI registration
├── @types/           # TypeScript declarations
├── app.ts            # Express app setup
└── server.ts         # Entry point
```

## Getting Started

```bash
cp env-example .env   # then fill in MONGO_URI, JWT secrets, etc.
pnpm --filter server-express dev
```

## Available Scripts

| Command                                    | Description                                        |
| ------------------------------------------ | -------------------------------------------------- |
| `pnpm --filter server-express dev`         | Start dev server with hot-reload                   |
| `pnpm --filter server-express build`       | Compile TypeScript                                 |
| `pnpm --filter server-express start`       | Run compiled server                                |
| `pnpm --filter server-express test`        | Run tests                                          |
| `pnpm --filter server-express test:watch`  | Run tests in watch mode                            |
| `pnpm --filter server-express lint`        | Lint with ESLint                                   |
| `pnpm --filter server-express format`      | Format with Prettier                               |
| `pnpm --filter server-express knip`        | Run Knip dead code analysis                        |
| `pnpm --filter server-express knip:report` | Export Knip results as markdown (`knip-report.md`) |

## API

Base path: `/api/v1` — interactive docs at `/docs`.
