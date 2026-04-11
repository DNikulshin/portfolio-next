# CLAUDE.md — Portfolio + Dashboard Project

## Контекст проекта

Это персональный сайт портфолио + приватный дашборд разработчика **Дмитрия Никульшина** (middle+ full-stack).

- **Продакшн URL:** https://nikulshin-dev.ru
- **Репозиторий:** на сервере `/opt/home-codespaces/portfolio-next/`
- **Сервер:** Ubuntu 24.04, Docker, российский VPS `72.56.233.84`
- **Reverse proxy:** Caddy (автоматический SSL)
- **CI/CD:** GitHub webhook → deploy.sh → docker compose up

---

## Стек

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **ORM:** Prisma + PostgreSQL 16
- **Auth:** NextAuth.js v5 (GitHub OAuth) — **нужно внедрить**
- **File Storage:** MinIO (self-hosted S3) — `https://s3.nikulshin-dev.ru`
- **Container:** Docker + docker compose

---

## Текущая структура проекта

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx        # УДАЛИТЬ — заменить на NextAuth
│   │   └── register/page.tsx     # УДАЛИТЬ
│   ├── admin/page.tsx            # УДАЛИТЬ — переехать в /dashboard/works
│   ├── api/
│   │   ├── health/route.ts
│   │   ├── seed/route.ts
│   │   ├── works/route.ts
│   │   └── works/[id]/route.ts
│   ├── page.tsx                  # Главная (портфолио) — оставить
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── admin/                    # РЕФАКТОРИНГ → dashboard/
│   ├── auth/                     # УДАЛИТЬ — заменить на NextAuth
│   ├── works/
│   └── ...
├── shared/
│   ├── api/
│   ├── lib/
│   │   ├── actions.ts            # Server actions
│   │   ├── session.ts            # УДАЛИТЬ — заменить на NextAuth
│   │   └── prisma-client.ts
│   └── ui/kit/
└── types/types.ts
```

---

## Целевая архитектура (что нужно построить)

```
/                        → Портфолио (публично)
/dashboard               → Главная дашборда (приватно, GitHub OAuth)
/dashboard/works         → CRUD работ портфолио
/dashboard/projects      → Свои проекты + задачи (kanban)
/dashboard/github        → GitHub статистика (repos, commits, PRs)
```

### Структура папок после рефакторинга

```
src/app/
├── page.tsx                      # Портфолио (без изменений)
├── dashboard/
│   ├── layout.tsx                # Защищённый layout (middleware)
│   ├── page.tsx                  # Главная дашборда
│   ├── works/
│   │   └── page.tsx             # CRUD работ
│   ├── projects/
│   │   └── page.tsx             # Проекты + задачи
│   └── github/
│       └── page.tsx             # GitHub статистика
├── api/
│   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   ├── works/                    # Works CRUD
│   ├── projects/                 # Projects CRUD (новое)
│   ├── tasks/                    # Tasks CRUD (новое)
│   └── upload/route.ts          # Загрузка в MinIO (новое)
```

---

## Prisma схема (текущая + что добавить)

### Текущая (оставить Work, убрать User)

```prisma
model Work {
  id        String   @id @default(uuid())
  title     String
  imageUrl  String   # будет URL из MinIO
  linkUrl   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Добавить новые модели

```prisma
model Project {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      ProjectStatus @default(ACTIVE)
  githubUrl   String?
  deployUrl   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tasks       Task[]
}

enum ProjectStatus {
  ACTIVE
  PAUSED
  COMPLETED
  ARCHIVED
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  projectId   String
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

---

## Auth — NextAuth.js v5 с GitHub OAuth

### Установка

```bash
pnpm add next-auth@beta
```

### Переменные окружения

```env
NEXTAUTH_SECRET=<random_32_chars>
NEXTAUTH_URL=https://nikulshin-dev.ru
GITHUB_CLIENT_ID=<из GitHub OAuth App>
GITHUB_CLIENT_SECRET=<из GitHub OAuth App>
ALLOWED_GITHUB_USERNAME=DNikulshin  # только твой аккаунт
```

### Создать GitHub OAuth App

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `https://nikulshin-dev.ru`
3. Callback URL: `https://nikulshin-dev.ru/api/auth/callback/github`

### auth.ts (корень проекта)

```typescript
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ profile }) {
      // Только твой GitHub аккаунт
      return profile?.login === process.env.ALLOWED_GITHUB_USERNAME
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  }
})
```

### middleware.ts (защита /dashboard)

```typescript
import { auth } from "./auth"

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/api/auth/signin", req.url))
  }
})

export const config = {
  matcher: ["/dashboard/:path*"]
}
```

---

## MinIO интеграция

### Переменные окружения

```env
MINIO_ENDPOINT=minio        # имя контейнера в Docker сети
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=<твой пароль>
MINIO_BUCKET=portfolio
MINIO_PUBLIC_URL=https://s3.nikulshin-dev.ru
```

### Установка

```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### lib/minio.ts

```typescript
import { S3Client } from "@aws-sdk/client-s3"

export const s3 = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
})

export function getPublicUrl(key: string): string {
  return `${process.env.MINIO_PUBLIC_URL}/portfolio/${key}`
}
```

### api/upload/route.ts

```typescript
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3, getPublicUrl } from "@/shared/lib/minio"
import { auth } from "@/auth"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get("file") as File
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const key = `${Date.now()}-${file.name}`

  await s3.send(new PutObjectCommand({
    Bucket: process.env.MINIO_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  }))

  return Response.json({ url: getPublicUrl(key) })
}
```

---

## GitHub API интеграция

Токен берём из NextAuth сессии (GitHub OAuth автоматически даёт токен).

### lib/github.ts

```typescript
export async function getGithubRepos(accessToken: string) {
  const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=20", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 300 }, // кэш 5 минут
  })
  return res.json()
}

export async function getGithubStats(accessToken: string) {
  const res = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 300 },
  })
  return res.json()
}
```

---

## Docker compose (текущий)

```yaml
services:
  portfolio:
    build: .
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/portfolio
      - SESSION_SECRET=${SESSION_SECRET}
      - API_KEY=${API_KEY}
      - YM_COUNTER_ID=${YM_COUNTER_ID}
      - HOSTNAME=0.0.0.0
      - PORT=3000
    volumes:
      - ./public/uploads:/app/public/uploads
    networks:
      - proxy
      - internal

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=portfolio
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - internal
```

**При рефакторинге добавить в environment:**

```yaml
- NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
- NEXTAUTH_URL=https://nikulshin-dev.ru
- GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
- GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
- ALLOWED_GITHUB_USERNAME=DNikulshin
- MINIO_ENDPOINT=minio
- MINIO_PORT=9000
- MINIO_ACCESS_KEY=${MINIO_ROOT_USER}
- MINIO_SECRET_KEY=${MINIO_ROOT_PASSWORD}
- MINIO_BUCKET=portfolio
- MINIO_PUBLIC_URL=https://s3.nikulshin-dev.ru
```

**Убрать из environment:**
```yaml
- SESSION_SECRET  # больше не нужен
- API_KEY         # больше не нужен
```

---

## Caddy конфигурация (на сервере)

```caddyfile
nikulshin-dev.ru {
    handle /uploads/* {
        root * /opt/home-codespaces/portfolio-next/public
        file_server
    }
    handle {
        reverse_proxy portfolio-next-portfolio-1:3000
    }
}

s3.nikulshin-dev.ru {
    reverse_proxy minio:9000
}

minio.nikulshin-dev.ru {
    reverse_proxy minio:9001
}
```

---

## Порядок рефакторинга

### Этап 1 — Чистка (начать здесь)

- [ ] Удалить `src/app/(auth)/` папку
- [ ] Удалить `src/app/admin/` папку
- [ ] Удалить `src/components/auth/` папку
- [ ] Удалить `src/components/admin/` папку
- [ ] Удалить `src/shared/lib/session.ts`
- [ ] Убрать `User` модель из Prisma схемы
- [ ] Убрать `userId` из `Work` модели
- [ ] Создать новую миграцию

### Этап 2 — NextAuth

- [ ] `pnpm add next-auth@beta`
- [ ] Создать GitHub OAuth App
- [ ] Добавить переменные в `.env`
- [ ] Создать `auth.ts` в корне
- [ ] Создать `middleware.ts`
- [ ] Создать `app/api/auth/[...nextauth]/route.ts`

### Этап 3 — Prisma миграция

- [ ] Добавить `Project`, `Task`, `ProjectStatus`, `TaskStatus`, `Priority`
- [ ] `npx prisma migrate dev --name add-projects-tasks`
- [ ] `npx prisma generate`

### Этап 4 — MinIO

- [ ] `pnpm add @aws-sdk/client-s3`
- [ ] Создать `src/shared/lib/minio.ts`
- [ ] Создать `app/api/upload/route.ts`
- [ ] Добавить env переменные

### Этап 5 — Dashboard

- [ ] `app/dashboard/layout.tsx` — защищённый layout с sidebar
- [ ] `app/dashboard/page.tsx` — сводка + GitHub stats
- [ ] `app/dashboard/works/page.tsx` — CRUD работ
- [ ] `app/dashboard/projects/page.tsx` — проекты + kanban
- [ ] `app/dashboard/github/page.tsx` — GitHub статистика

### Этап 6 — Deploy

- [ ] Добавить новые env в `.env` на сервере
- [ ] `docker compose build && docker compose up -d`
- [ ] Проверить `npx prisma migrate deploy` в контейнере

---

## Команды для разработки

```bash
# Локальный запуск
pnpm dev

# Prisma
npx prisma studio          # GUI для БД
npx prisma migrate dev     # новая миграция
npx prisma generate        # обновить клиент
npx prisma migrate deploy  # применить в продакшн

# Docker на сервере
cd /opt/home-codespaces/portfolio-next
docker compose build --no-cache
docker compose up -d
docker compose logs portfolio -f

# Применить миграции в продакшн
docker compose exec portfolio npx prisma migrate deploy
```

---

## Важные замечания

1. **Не трогать** `src/app/page.tsx` (главная портфолио) — только добавлять секции
2. **MinIO URL** для публичных файлов: `https://s3.nikulshin-dev.ru/portfolio/<filename>`
3. **GitHub токен** автоматически доступен через `session.accessToken` после NextAuth логина
4. **Только один пользователь** имеет доступ к дашборду — `DNikulshin` (проверка в `signIn` callback)
5. **Caddy** автоматически обновляет SSL сертификаты — не нужно думать об этом
6. **CI/CD** — push в main → webhook → deploy.sh → `docker compose up -d --build`

---

## Дизайн дашборда

- **Тема:** тёмная (dark mode по умолчанию)
- **Стиль:** минималистичный, developer-ориентированный
- **Sidebar:** фиксированный слева с навигацией
- **Компоненты:** shadcn/ui (уже установлен)
- **Иконки:** react-icons (уже установлен)

### Навигация дашборда

```
🏠 Обзор          /dashboard
💼 Работы         /dashboard/works
📁 Проекты        /dashboard/projects
🐙 GitHub         /dashboard/github
```
