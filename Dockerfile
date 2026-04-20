FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio
ENV NEXTAUTH_SECRET=build_secret
ENV NEXTAUTH_URL=https://nikulshin-dev.ru
ENV GITHUB_CLIENT_ID=build
ENV GITHUB_CLIENT_SECRET=build
ENV ALLOWED_GITHUB_USERNAME=DNikulshin
ENV MINIO_ENDPOINT=minio
ENV MINIO_PORT=9000
ENV MINIO_ACCESS_KEY=build
ENV MINIO_SECRET_KEY=build
ENV MINIO_BUCKET=portfolio
ENV MINIO_PUBLIC_URL=https://s3.nikulshin-dev.ru
RUN npx prisma generate && npx next build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# standalone уже содержит минимальные зависимости — node_modules не копируем
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
# Prisma-клиент (нативные бинарники под alpine)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "server.js"]
