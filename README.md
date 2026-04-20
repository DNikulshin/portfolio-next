# Dmitriy Nikulshin — Portfolio & Dashboard

Персональный сайт-портфолио с приватным дашбордом.
Живой сайт: **https://nikulshin-dev.ru**

**Стек:** Next.js 16 · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion · Prisma · PostgreSQL 16 · NextAuth v5 · MinIO · Docker · Caddy

---

## Что это

**Публичная часть (`/`)** — портфолио в стиле Terminal/Code:
- Hero с анимациями, tagline «От концепции до кода»
- Секция технологий: 22 иконки по 4 категориям (Frontend / Backend / Mobile / Infra)
- Избранные проекты — живые данные с GitHub API (звёзды, описание, язык)
- Contact CTA

**Приватный дашборд (`/dashboard`)** — доступен только владельцу через GitHub OAuth:
- Обзор: статистика из БД
- Works: CRUD портфолио работ с загрузкой изображений в MinIO
- Projects: Kanban-доска с задачами
- GitHub: статистика репозиториев

---

## Быстрый старт (локально)

```bash
git clone git@github.com:DNikulshin/portfolio-next.git
cd portfolio-next
npm install
npm run dev        # http://localhost:3333
```

> Без переменных окружения публичная страница работает полностью.
> Дашборд и секция Projects требуют `.env.development`.

---

## Переменные окружения

Создать `.env.development` (для локальной разработки) или `.env` (для сервера):

```env
# База данных
DATABASE_URL=postgresql://postgres:<пароль>@db:5432/portfolio

# NextAuth
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://nikulshin-dev.ru
GITHUB_CLIENT_ID=<GitHub OAuth App Client ID>
GITHUB_CLIENT_SECRET=<GitHub OAuth App Client Secret>
ALLOWED_GITHUB_USERNAME=DNikulshin

# MinIO (S3-совместимое хранилище)
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=<логин MinIO>
MINIO_SECRET_KEY=<пароль MinIO>
MINIO_BUCKET=portfolio
MINIO_PUBLIC_URL=https://s3.nikulshin-dev.ru

# Яндекс.Метрика
YM_COUNTER_ID=102529593

# GitHub API — опционально, повышает лимит с 60 до 5000 req/час
# Создать на: github.com/settings/tokens (scopes не нужны)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

---

## Деплой на сервер

### Требования

- Ubuntu 22.04 / 24.04
- Docker + Docker Compose
- Caddy (reverse proxy + авто SSL)
- Порты `80`, `443` открыты
- Домен с A-записями

### Установка Docker

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker && systemctl start docker
```

### Установка Caddy

```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install caddy
```

### Docker-сеть

```bash
docker network create proxy
```

### MinIO

```bash
docker run -d \
  --name minio --network proxy --restart unless-stopped \
  -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=<пароль> \
  -v minio_data:/data \
  quay.io/minio/minio server /data --console-address ":9001"

# Создать публичный бакет
docker run --rm --network proxy --entrypoint /bin/sh minio/mc -c "
  mc alias set local http://minio:9000 admin <пароль> &&
  mc mb local/portfolio &&
  mc anonymous set download local/portfolio
"
```

### GitHub OAuth App

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. `Homepage URL`: `https://your-domain.com`
3. `Authorization callback URL`: `https://your-domain.com/api/auth/callback/github`
4. Сохранить **Client ID** и **Client Secret**

### Caddyfile

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

### Запуск приложения

```bash
git clone git@github.com:DNikulshin/portfolio-next.git /opt/portfolio
cd /opt/portfolio
cp .env.example .env   # заполнить значения
docker compose build --no-cache
docker compose up -d
docker compose exec portfolio npx prisma migrate deploy
```

### Проверка

```bash
docker compose ps
docker compose logs portfolio -f
curl -I https://your-domain.com
```

---

## Обновление

```bash
cd /opt/portfolio
git pull origin main
docker compose build --no-cache
docker compose up -d
docker compose exec -T portfolio npx prisma migrate deploy
```

---

## Структура компонентов портфолио

```
src/components/
├── Header.tsx                   # Sticky nav + мобильный гамбургер
├── Footer.tsx                   # Футер с соцсетями
├── AnimatedSection.tsx          # Scroll-triggered анимация секций
├── hero/HeroSection.tsx         # Главный экран с Framer Motion
├── about/AboutSection.tsx       # Bio + stat pills
├── skills/
│   ├── SkillsSection.tsx        # 4 категории технологий
│   └── SkillGrid.tsx            # Иконки с hover-анимацией
├── projects/
│   ├── FeaturedProjectsSection.tsx  # Live данные с GitHub API
│   ├── ProjectCard.tsx          # Карточка репозитория
│   └── projectsData.ts          # Tech-теги по именам репо
└── contact/ContactSection.tsx   # CTA секция
```

---

## Полезные команды

```bash
npm run dev                                    # dev-сервер, порт 3333
npx prisma studio                             # GUI для БД
npx prisma migrate dev --name <name>          # новая миграция
docker compose logs portfolio -f              # логи продакшна
docker compose exec portfolio sh              # shell в контейнере
```
