# ⚡ Quick Reference & Troubleshooting

## API Endpoints (tRPC Procedures)

| Router   | Procedure | Type | Description |
|----------|-----------|------|-------------|
| **auth** | `getSession` | Query | Get current user session |
| **product** | `getAll` | Query | List all products |
| **product** | `create` | Mutation | (Admin) Create product |
| **order** | `create` | Mutation | Place an order |
| **message** | `send` | Mutation | Send a chat message |
| **message** | `onAdd` | Subscription | Listen for new messages |

## Common Issues

### 1. `WebSocket connection failed`
- **Cause**: The WebSocket server (`npm run ws`) isn't running.
- **Fix**: Open a new terminal and run `npm run ws`. Next.js (`npm run dev`) runs on port 3000, WS server runs on port 3001.

### 2. `P1001: Can't reach database server`
- **Cause**: SQLite file missing or permissions issue.
- **Fix**: Run `npx prisma db push` to regenerate the dev.db file.

### 3. `UNAUTHORIZED` error
- **Cause**: Trying to access `protectedProcedure` without logging in.
- **Fix**: Ensure you have a valid session (log in via `/api/auth/signin`).

### 4. Styles not applying
- **Cause**: Tailwind config might be missing the path.
- **Fix**: Check `tailwind.config.ts` includes `./src/**/*.{js,ts,jsx,tsx}`.
