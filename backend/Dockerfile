# ─── Cinema Pro Max · Backend (Node + Express + Prisma) ───
# Multi-stage build for a small, production-ready image.

# Stage 1 — build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 2 — runtime
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
# Prisma client + engines and compiled output
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
EXPOSE 5000
# Apply migrations then start (safe on empty/existing DB)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
