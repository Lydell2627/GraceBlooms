# 📘 Implementation Guide

## Code Patterns & Templates

### 1. Creating a tRPC Router
Every feature (Product, Order, Chat) has its own router in `src/server/api/routers`.

\`\`\`typescript
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  // Public Endpoint
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: \`Hello \${input.text}\`,
      };
    }),

  // Protected Endpoint (Requires Login)
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
\`\`\`

### 2. Using tRPC in Components (Frontend)
\`\`\`tsx
"use client";
import { api } from "~/uils/api";

export function Hello() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  if (hello.isLoading) return <div>Loading...</div>;
  return <div>{hello.data?.greeting}</div>;
}
\`\`\`

### 3. Real-Time Subscriptions
For chat, we use `useSubscription`.

\`\`\`tsx
api.message.onAdd.useSubscription(undefined, {
  onData(message) {
    console.log("New message received:", message);
  },
  onError(err) {
    console.error("Subscription error:", err);
  }
});
\`\`\`

## Key Design Decisions

### Why tRPC?
It provides end-to-end type safety without generating schemas/types manually. If you change a backend procedure argument, your frontend code will immediately show a red squiggly line.

### Why NextAuth.js?
Standard solution for Next.js. We use the `Credentials` provider for this demo (email/pass), but it easily supports Google/GitHub login.

### Why Prisma?
Best-in-class ORM for TypeScript. Allows us to define our data model in one place (`schema.prisma`) and get generated types.
