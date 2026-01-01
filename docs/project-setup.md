# 🏗️ Project Architecture & Setup

## Tech Stack Overview (T3 Stack)
- **Framework**: `Next.js 15` (App Router)
- **Language**: `TypeScript` (Strict mode)
- **Styling**: `Tailwind CSS`
- **Database Logic**: `Prisma ORM`
- **API**: `tRPC` (End-to-end typesafety)
- **Real-time**: `ws` (WebSockets) with `@trpc/server/adapters/ws`

## Directory Structure

\`\`\`
/src
  /app            <-- Next.js App Router Pages
    /(admin)      <-- Admin-only routes
    /(shop)       <-- Public shop routes
    /api/trpc     <-- tRPC HTTP endpoint
    layout.tsx    <-- Wraps app with TRPCProvider
  /components     <-- React Components
  /server
    /api          <-- tRPC Routers (Backend Logic)
       root.ts    <-- Main router merger
       trpc.ts    <-- Middleware & Context
    auth.ts       <-- NextAuth Config
    db.ts         <-- Prisma Global Instance
    wsServer.ts   <-- WebSocket Entry Point
  /utils          <-- Client-side helpers (trpc client)
\`\`\`

## Data Flow
1. **Client**: User performs action (e.g., Send Message).
2. **tRPC Client**: Calls `trpc.message.send.mutate({ content })`.
3. **Endpoint**: Request hits `/api/trpc` (HTTP) or WS connection.
4. **Router**: `src/server/api/routers/message.ts` validates input (Zod).
5. **Prisma**: Saves message to SQLite/Postgres.
6. **Event Emitter**: Emits `onMessage` event.
7. **Subscription**: Connected clients receive the new message instantly.
