FROM node:22-alpine AS base

WORKDIR /app

FROM base AS prepare

RUN npm install -g pnpm@10.25.0 turbo@2.5.8

COPY . .

RUN turbo prune @polar/backend --docker

FROM base AS builder

COPY --from=prepare /app/out/json/ .
RUN pnpm install --frozen-lockfile --prod

COPY --from=prepare /app/out/full/ .

RUN pnpm turbo build

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

COPY --from=builder --chown=expressjs:nodejs /app/apps/backend/dist ./dist

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/index.js"]
