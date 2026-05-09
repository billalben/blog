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
pnpm --filter server dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm --filter server dev` | Start dev server with hot-reload |
| `pnpm --filter server build` | Compile TypeScript |
| `pnpm --filter server start` | Run compiled server |
| `pnpm --filter server test` | Run tests |
| `pnpm --filter server test:watch` | Run tests in watch mode |
| `pnpm --filter server lint` | Lint with ESLint |
| `pnpm --filter server format` | Format with Prettier |

## API

Base path: `/api/v1` — interactive docs at `/docs`.
