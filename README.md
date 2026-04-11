# Portfolio + Dashboard

Персональный сайт-портфолио с приватным дашбордом для управления проектами и задачами.

**Стек:** Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui · Prisma · PostgreSQL 16 · NextAuth v5 · MinIO · Docker · Caddy

---

## Архитектура

```
/                    → Портфолио (публично)
/dashboard           → Обзор + статистика (приватно, GitHub OAuth)
/dashboard/works     → CRUD работ портфолио
/dashboard/projects  → Проекты + Kanban-доска
/dashboard/github    → GitHub статистика
```

---

## Требования к серверу

- Ubuntu 22.04 / 24.04
- Docker + Docker Compose
- Caddy (reverse proxy + автоматический SSL)
- Открытые порты: `80`, `443`
- Домен с настроенными A-записями

---

## Шаг 1 — Установка Docker

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker
```

---

## Шаг 2 — Установка Caddy

```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install caddy
```

---

## Шаг 3 — Создать Docker сеть

```bash
docker network create proxy
```

> Caddy и контейнеры приложения должны быть в одной сети `proxy`.

---

## Шаг 4 — Запустить MinIO

```bash
docker run -d \
  --name minio \
  --network proxy \
  --restart unless-stopped \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=<придумай_пароль> \
  -v minio_data:/data \
  quay.io/minio/minio server /data --console-address ":9001"
```

**Создать бакет `portfolio` с публичным доступом:**

```bash
docker run --rm --network proxy \
  --entrypoint /bin/sh minio/mc -c "
  mc alias set local http://minio:9000 admin <пароль> &&
  mc mb local/portfolio &&
  mc anonymous set download local/portfolio
"
```

Или через веб-консоль: `https://minio.your-domain.com` → Buckets → Create Bucket → `portfolio` → Access: Public.

---

## Шаг 5 — Создать GitHub OAuth App

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. Заполнить:
   - **Homepage URL:** `https://your-domain.com`
   - **Authorization callback URL:** `https://your-domain.com/api/auth/callback/github`
3. Сохранить **Client ID** и **Client Secret**

---

## Шаг 6 — Клонировать репозиторий

```bash
git clone git@github.com:DNikulshin/portfolio-next.git /opt/portfolio
cd /opt/portfolio
```

---

## Шаг 7 — Создать `.env`

```bash
nano /opt/portfolio/.env
```

Содержимое (заменить все `<...>` на реальные значения):

```env
# База данных
DB_PASSWORD=<придумай_пароль>
DATABASE_URL=postgresql://postgres:<DB_PASSWORD>@db:5432/portfolio

# Yandex Metrika
YM_COUNTER_ID=<номер_счётчика>

# NextAuth
NEXTAUTH_SECRET=<результат: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.com
GITHUB_CLIENT_ID=<из OAuth App>
GITHUB_CLIENT_SECRET=<из OAuth App>
ALLOWED_GITHUB_USERNAME=<твой_github_логин>

# MinIO
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=<MINIO_ROOT_USER>
MINIO_SECRET_KEY=<MINIO_ROOT_PASSWORD>
MINIO_BUCKET=portfolio
MINIO_PUBLIC_URL=https://s3.your-domain.com
```

**Сгенерировать NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Шаг 8 — Настроить Caddyfile

```bash
nano /etc/caddy/Caddyfile
```

```caddyfile
your-domain.com {
    reverse_proxy portfolio:3000
}

s3.your-domain.com {
    reverse_proxy minio:9000
}

minio.your-domain.com {
    reverse_proxy minio:9001
}
```

```bash
systemctl reload caddy
```

> Caddy автоматически выпустит SSL-сертификаты через Let's Encrypt.

---

## Шаг 9 — Запустить приложение

```bash
cd /opt/portfolio
docker compose build --no-cache
docker compose up -d
```

---

## Шаг 10 — Применить миграции БД

```bash
docker compose exec portfolio npx prisma migrate deploy
```

> ⚠️ Выполнять после каждого деплоя, если были изменения схемы Prisma.

---

## Шаг 11 — Проверить

```bash
# Статус контейнеров
docker compose ps

# Логи приложения
docker compose logs portfolio -f

# Доступность сайта
curl -I https://your-domain.com
```

---

## Обновление приложения

```bash
cd /opt/portfolio
git pull origin main
docker compose build --no-cache
docker compose up -d
docker compose exec -T portfolio npx prisma migrate deploy
```

---

## Структура проекта

```
src/
├── app/
│   ├── page.tsx                        # Портфолио (публично)
│   ├── dashboard/
│   │   ├── layout.tsx                  # Защищённый layout с sidebar
│   │   ├── page.tsx                    # Обзор
│   │   ├── works/page.tsx              # CRUD работ
│   │   ├── projects/page.tsx           # Проекты + Kanban
│   │   └── github/page.tsx             # GitHub статистика
│   └── api/
│       ├── auth/[...nextauth]/         # NextAuth handler
│       ├── works/                      # Works CRUD
│       ├── projects/                   # Projects CRUD
│       ├── tasks/                      # Tasks CRUD
│       └── upload/                     # Загрузка файлов в MinIO
├── components/
│   ├── dashboard/                      # Компоненты дашборда
│   └── works/                          # Компоненты портфолио
└── shared/
    ├── api/                            # API клиенты
    └── lib/
        ├── prisma-client.ts
        ├── minio.ts                    # S3/MinIO клиент
        └── github.ts                  # GitHub API
auth.ts                                 # NextAuth конфиг
src/proxy.ts                            # Защита роутов (Next.js 16)
prisma/schema.prisma                    # Схема БД
```

---

## Переменные окружения

| Переменная | Описание | Где получить |
|-----------|----------|-------------|
| `DB_PASSWORD` | Пароль PostgreSQL | Придумать |
| `DATABASE_URL` | Строка подключения к БД | Авто из `DB_PASSWORD` |
| `NEXTAUTH_SECRET` | Секрет для JWT сессий | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Публичный URL сайта | Ваш домен |
| `GITHUB_CLIENT_ID` | GitHub OAuth App ID | GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Secret | GitHub Developer Settings |
| `ALLOWED_GITHUB_USERNAME` | Единственный допустимый GitHub логин | Ваш GitHub username |
| `MINIO_ENDPOINT` | Хост MinIO (имя контейнера) | `minio` |
| `MINIO_PORT` | Порт MinIO API | `9000` |
| `MINIO_ACCESS_KEY` | Логин MinIO | `MINIO_ROOT_USER` |
| `MINIO_SECRET_KEY` | Пароль MinIO | `MINIO_ROOT_PASSWORD` |
| `MINIO_BUCKET` | Имя бакета | `portfolio` |
| `MINIO_PUBLIC_URL` | Публичный URL MinIO | `https://s3.your-domain.com` |
| `YM_COUNTER_ID` | ID счётчика Яндекс.Метрики | Яндекс.Метрика |

---

## Полезные команды

```bash
# Логи
docker compose logs portfolio -f
docker compose logs db -f

# Перезапуск контейнера
docker compose restart portfolio

# Подключиться к контейнеру
docker compose exec portfolio sh

# Prisma Studio — GUI для БД
docker compose exec portfolio npx prisma studio
```
