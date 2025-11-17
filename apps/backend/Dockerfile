# BUILD STAGE
FROM node:22-alpine AS builder

WORKDIR /app

# Install global pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend

# Install backend deps only
RUN pnpm install --filter backend...

# Build
RUN pnpm --filter backend build

# RUNTIME STAGE
FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy built files + node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/index.js"]
