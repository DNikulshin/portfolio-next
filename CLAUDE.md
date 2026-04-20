# CLAUDE.md — Portfolio + Dashboard

## Контекст

Персональный сайт-портфолио + приватный дашборд разработчика **Дмитрия Никульшина** (middle+ full-stack).

- **Продакшн:** https://nikulshin-dev.ru
- **Репозиторий:** https://github.com/DNikulshin/portfolio-next (приватный)
- **Сервер:** Ubuntu 24.04, VPS `72.56.233.84`, Docker + Caddy
- **Локальная разработка:** `localhost:3333`

---

## Стек

| | |
|---|---|
| Framework | Next.js **16** (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| ORM | Prisma 6 + PostgreSQL 16 |
| Auth | NextAuth.js **v5** (GitHub OAuth) |
| File Storage | MinIO (self-hosted S3) |
| State / Data | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion 12 |
| Container | Docker + docker compose |
| Reverse proxy | Caddy (авто SSL) |

---

## Архитектура роутов

```
/                        → Портфолио (публично)
/dashboard               → Обзор + статистика (приватно)
/dashboard/works         → CRUD работ портфолио
/dashboard/projects      → Проекты + Kanban-доска
/dashboard/github        → GitHub профиль + репозитории

/api/works               → Works CRUD
/api/projects            → Projects CRUD
/api/tasks               → Tasks CRUD
/api/upload              → Загрузка файлов в MinIO (защищён auth)
/api/auth/[...nextauth]  → NextAuth handler
/api/health              → Health check
```

---

## Структура проекта

```
/
├── auth.ts                              # NextAuth v5 конфиг
├── prisma/
│   ├── schema.prisma                    # Модели: Work, Project, Task
│   ├── seed.ts                          # Начальные данные
│   └── migrations/
└── src/
    ├── proxy.ts                         # Защита /dashboard/* (Next.js 16)
    ├── app/
    │   ├── page.tsx                     # Портфолио — сборка секций
    │   ├── layout.tsx                   # Root layout (dark mode, QueryProvider)
    │   ├── globals.css                  # OKLCH цвета, --hero-glow, --card-glow
    │   ├── dashboard/
    │   │   ├── layout.tsx               # Dashboard layout с Sidebar
    │   │   ├── page.tsx                 # Обзор (Server Component, статистика из БД)
    │   │   ├── works/page.tsx           # CRUD работ (Client Component)
    │   │   ├── projects/page.tsx        # Kanban (Client Component)
    │   │   └── github/page.tsx          # GitHub stats (Server Component)
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts
    │       ├── works/route.ts           # GET, POST
    │       ├── works/[id]/route.ts      # GET, PATCH, DELETE + MinIO cleanup
    │       ├── projects/route.ts        # GET, POST
    │       ├── projects/[id]/route.ts   # PATCH, DELETE
    │       ├── tasks/route.ts           # POST
    │       ├── tasks/[id]/route.ts      # PATCH, DELETE
    │       ├── upload/route.ts          # POST → MinIO
    │       └── health/route.ts
    ├── components/
    │   ├── Header.tsx                   # Sticky nav + мобильный гамбургер (Framer Motion)
    │   ├── Footer.tsx                   # Footer с соцсетями
    │   ├── AnimatedSection.tsx          # Scroll-triggered fade-in (Framer Motion)
    │   ├── Loader.tsx                   # Спиннер загрузки
    │   ├── hero/
    │   │   └── HeroSection.tsx          # Hero: аватар, tagline, анимации (client)
    │   ├── about/
    │   │   └── AboutSection.tsx         # Bio + stat pills (server)
    │   ├── skills/
    │   │   ├── SkillsSection.tsx        # 4 категории: Frontend/Backend/Mobile/Infra (server)
    │   │   └── SkillGrid.tsx            # Иконки с hover-анимацией (client)
    │   ├── projects/
    │   │   ├── FeaturedProjectsSection.tsx  # Async server: GitHub API live data
    │   │   ├── ProjectCard.tsx          # Карточка репозитория с tech-тегами (server)
    │   │   └── projectsData.ts          # Статичный маппинг tech-тегов по именам репо
    │   ├── contact/
    │   │   └── ContactSection.tsx       # CTA с Telegram + Email (server)
    │   ├── dashboard/
    │   │   ├── Sidebar.tsx              # Навигация + выход
    │   │   ├── works/
    │   │   │   ├── WorkForm.tsx         # Создание/редактирование (с upload)
    │   │   │   └── WorkItem.tsx         # Карточка с CRUD кнопками
    │   │   └── projects/
    │   │       ├── ProjectCard.tsx      # Карточка проекта + kanban колонки
    │   │       └── TaskCard.tsx         # Карточка задачи
    │   └── works/
    │       ├── Work.tsx                 # Публичный view (без CRUD)
    │       ├── WorkList.tsx             # Список/слайдер работ (client, TanStack Query)
    │       └── WorkSliderSkeleton.tsx   # Скелетон загрузки слайдера
    ├── hooks/
    │   └── useWork.ts                   # useWorks, useCreateNewWork, useUpdateWork, useDeleteWork
    ├── shared/
    │   ├── api/
    │   │   ├── getWorks.ts              # Server-side fetch (Prisma напрямую)
    │   │   ├── works.ts                 # Client-side fetch функции
    │   │   └── client/getWorks.ts       # Client fetch /api/works
    │   └── lib/
    │       ├── prisma-client.ts         # Singleton PrismaClient
    │       ├── minio.ts                 # S3Client, uploadFile(), deleteFile()
    │       ├── github.ts                # getGithubUser(), getGithubRepos(), getFeaturedRepos()
    │       └── css.ts                   # cn() утилита
    └── types/
        ├── types.ts                     # IResponseDataWork, IFormData*
        └── next-auth.d.ts               # Расширение Session (accessToken)
```

---

## Публичная страница — структура секций

```
Header (sticky, мобильный гамбургер)
├── HeroSection        — full-viewport, Framer Motion анимации при загрузке
├── AnimatedSection #about    → AboutSection (bio + stat pills)
├── AnimatedSection #skills   → SkillsSection (22 иконки, 4 категории)
├── AnimatedSection #projects → FeaturedProjectsSection (live GitHub API)
├── AnimatedSection #contact  → ContactSection (CTA)
Footer
```

**Works секция убрана с публичной страницы** — текущие работы в БД были учебными проектами.
Когда будут скриншоты реальных проектов — добавить Works обратно через дашборд.

---

## Prisma схема

```prisma
model Work {
  id        String   @id @default(uuid())
  title     String
  imageUrl  String   // URL из MinIO
  linkUrl   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          String        @id @default(uuid())
  title       String
  description String?
  status      ProjectStatus @default(ACTIVE)
  githubUrl   String?
  deployUrl   String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  tasks       Task[]
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

enum ProjectStatus { ACTIVE | PAUSED | COMPLETED | ARCHIVED }
enum TaskStatus    { TODO | IN_PROGRESS | DONE }
enum Priority      { LOW | MEDIUM | HIGH }
```

---

## GitHub API — важные детали

```typescript
// src/shared/lib/github.ts
getGithubUser(accessToken)    // dashboard/github — требует OAuth токен сессии
getGithubRepos(accessToken)   // dashboard/github — требует OAuth токен сессии
getFeaturedRepos(token?)      // публичная страница — токен опционален (PAT)
```

- `getFeaturedRepos` — фетчит 6 конкретных репо по имени, `revalidate: 3600`
- Без `GITHUB_TOKEN`: публичный API, лимит 60 req/час на IP (хватает из-за кэша)
- С `GITHUB_TOKEN`: 5000 req/час — рекомендуется для продакшна
- Список репо: `corporate-transport`, `crm-support`, `nextjs15-crm`, `AnyWhereDesk`, `pc-remote`, `chrome-ext-todo`
- Tech-теги для карточек: `src/components/projects/projectsData.ts`

---

## Auth — важные детали

- **NextAuth v5** с GitHub OAuth
- **Next.js 16**: вместо `middleware.ts` используется **`src/proxy.ts`**
- Доступ к дашборду разрешён только пользователю с логином `DNikulshin`
- GitHub `accessToken` сохраняется в JWT и доступен через `session.accessToken`

```typescript
// auth.ts — ключевые callbacks
authorized({ auth, request }) → защита /dashboard/* на уровне proxy
signIn({ profile })           → фильтр по ALLOWED_GITHUB_USERNAME
jwt({ token, account })       → сохранение accessToken
session({ session, token })   → передача accessToken клиенту
```

---

## MinIO — важные детали

- **S3 API:** `https://s3.nikulshin-dev.ru` — бакет `portfolio` публичный (read)
- **Console:** `https://minio.nikulshin-dev.ru`
- Загрузка через `POST /api/upload` — только для авторизованных
- При удалении Work → автоматически удаляется файл из MinIO (`deleteFile()`)
- При замене изображения → старый файл удаляется, загружается новый

```typescript
// src/shared/lib/minio.ts
uploadFile(file: File): Promise<string>
deleteFile(url: string): Promise<void>
```

---

## Переменные окружения

```env
DATABASE_URL=postgresql://postgres:<DB_PASSWORD>@db:5432/portfolio
YM_COUNTER_ID=102529593

NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://nikulshin-dev.ru
GITHUB_CLIENT_ID=<GitHub OAuth App>
GITHUB_CLIENT_SECRET=<GitHub OAuth App>
ALLOWED_GITHUB_USERNAME=DNikulshin

MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=<MINIO_ROOT_USER>
MINIO_SECRET_KEY=<MINIO_ROOT_PASSWORD>
MINIO_BUCKET=portfolio
MINIO_PUBLIC_URL=https://s3.nikulshin-dev.ru

# Опционально — повышает лимит GitHub API с 60 до 5000 req/час
GITHUB_TOKEN=<GitHub PAT, без scopes>
```

---

## Caddy конфигурация

```caddyfile
nikulshin-dev.ru {
    reverse_proxy portfolio:3000
}
s3.nikulshin-dev.ru {
    reverse_proxy minio:9000
}
minio.nikulshin-dev.ru {
    reverse_proxy minio:9001
}
```

---

## Деплой

```bash
cd /opt/portfolio
git pull origin main
docker compose build --no-cache
docker compose up -d
docker compose exec portfolio npx prisma migrate deploy
```

---

## Команды разработки

```bash
npm run dev          # порт 3333
npx prisma studio    # GUI для БД
npx prisma migrate dev
npx prisma generate
```

---

## Правила и соглашения

1. **`page.tsx`** — собирает секции из компонентов, минимум логики
2. **Server Components по умолчанию** — `"use client"` только там, где нужна интерактивность
3. **`AnimatedSection`** оборачивает все секции кроме Hero (у Hero свои Framer Motion анимации)
4. **`deleteFile()` вызывается с `.catch(() => {})`** — падение MinIO не ломает основную логику
5. **`cn()` утилита** — `import { cn } from "@/shared/lib/css"`
6. **Аватар** — `import Avatar from "@/images/avatar3.webp"` (alias в tsconfig → `public/images/`)
7. **Works** убран с публичной страницы, дашборд CRUD сохранён — вернуть когда будут реальные скриншоты

---

## Идеи для следующих фич

- **Works секция** — добавить скриншоты реальных проектов (crm-support, corporate-transport, pc-remote) и вернуть на публичную страницу
- **Блог** — `/blog` с MDX постами
- **CV / Resume** — страница с PDF экспортом
- **Drag & Drop Kanban** — `@dnd-kit/core`
- **Telegram уведомления** — бот на алерты
- **Дедлайны для Task** — поле `dueDate`
- **Webhook CI/CD** — автодеплой при push в main
