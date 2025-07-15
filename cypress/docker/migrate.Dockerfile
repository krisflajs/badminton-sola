FROM node:22-alpine
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm i

COPY prisma/ ./prisma/

RUN pnpm prisma generate

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm prisma db seed"] 