# 📅 6-Day Implementation Checklist

Follow this guide to build the application from scratch or understand the provided codebase.

## Day 1: Foundation & Database
- [ ] Initialize Next.js T3 project.
- [ ] Set up Tailwind CSS.
- [ ] Define `prisma/schema.prisma` (User, Product, Order, Message).
- [ ] Run `npx prisma db push` to create SQLite DB.
- [ ] Seed database with initial products.

## Day 2: Authentication & User Roles
- [ ] Configure NextAuth.js with Credentials provider.
- [ ] Create `protectedProcedure` in tRPC for authenticated access.
- [ ] Implement `adminProcedure` for role-based access.
- [ ] Build Login/Register pages.

## Day 3: Product Management (Admin & Public)
- [ ] Build `product.router` (create, list, delete).
- [ ] Create Admin Dashboard to add flowers/occasions.
- [ ] Build Public Status page displaying products.
- [ ] Implement Filter by Occasion.

## Day 4: Real-Time Chat System
- [ ] Set up `wsServer.ts` (WebSocket Server).
- [ ] Configure `superjson` for serialization.
- [ ] Build `message.router` with `onMessage` subscription.
- [ ] Create `ChatWindow` component.
- [ ] Verify real-time updates between two browser windows.

## Day 5: Shopping Cart & Orders
- [ ] Implement `useCart` store (Zustand).
- [ ] Build Checkout flow (create Order in DB).
- [ ] Update Product Stock on purchase.
- [ ] Create User Order History page.

## Day 6: Polish & Deployment
- [ ] Add loading states and error boundaries.
- [ ] Final UI Polish (animations, responsive check).
- [ ] Run `npm run build` to check for type errors.
- [ ] Deploy Frontend to Vercel.
- [ ] (Optional) Deploy WS Server to Railway/Render.
