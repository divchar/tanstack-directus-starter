# Tanstack - Directus - Starter

![TanStack](https://img.shields.io/badge/TanStack-Start-FF4154?style=flat&logo=react&logoColor=white)
![Directus](https://img.shields.io/badge/Directus-CMS-64F?style=flat&logo=directus&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-components-000000?style=flat&logo=shadcnui&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Nitro](https://img.shields.io/badge/Nitro-node--server-FB923C?style=flat)
![Sentry](https://img.shields.io/badge/Sentry-monitoring-362D59?style=flat&logo=sentry&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A production-ready full-stack starter template using **TanStack Start**, **Directus**, **Tailwind CSS v4**, and **shadcn/ui** — deployed via **Nitro** on a Node server.

---

## Tech Stack

| Layer          | Technology                                           |
| -------------- | ---------------------------------------------------- |
| Framework      | [TanStack Start](https://tanstack.com/start)         |
| Routing        | [TanStack Router](https://tanstack.com/router)       |
| Server         | [Nitro](https://nitro.unjs.io/) (node-server preset) |
| CMS / Backend  | [Directus](https://directus.io/)                     |
| Database       | PostgreSQL                                           |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com/)          |
| Components     | [shadcn/ui](https://ui.shadcn.com/)                  |
| Language       | TypeScript                                           |
| Linting        | ESLint                                               |
| Error Tracking | [Sentry](https://sentry.io/)                         |
| HTML Rendering | DOMPurify + html-react-parser                        |

---

## Features

- TanStack Start with file-based routing and SSR via Nitro
- Directus headless CMS connected via the Directus SDK
- Tailwind CSS v4 + shadcn/ui component library
- Safe HTML rendering from Directus WYSIWYG fields using DOMPurify + html-react-parser
- Utility functions for currency, date, time, and HTML formatting
- Docker Compose setup for Directus + PostgreSQL
- Sentry error monitoring pre-configured
- ESLint configured for TypeScript + React

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- A Sentry DSN (optional — remove from config if not needed)

### 1. Use This Template

Before cloning the repo create two folders app_fe and app_be. Clone the tanstack-directus-starter to app_fe.
Paste the contents of the docker-compose.yml file to a similar file in app_be.

Click the **"Use this template"** button on GitHub, then clone your new repo:

```bash
git clone https://github.com/divchar/tanstack-directus-starter.git
cd app_fe
```

### 2. Start Directus with Docker

```bash
cd app_be
docker compose up -d
```

Directus will be available at `http://localhost:8055`.

On first run, log in with the admin credentials you set in your `docker-compose.yml` and set up your collections.

### 3. Install Frontend Dependencies

```bash
cd app_fe
npm install
```

### 4. Set Up Environment Variables

```bash
cp .env.example .env
```

Fill in the values in `.env` — see the [Environment Variables](#environment-variables) section below.

### 5. Run the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Project Structure

```
├── app_be/                       # Backend — Directus + Docker
│   ├── data/                     # PostgreSQL data (git-ignored)
│   ├── extensions/               # Directus extensions
│   ├── uploads/                  # Directus file uploads (git-ignored)
│   └── docker-compose.yml        # Directus + PostgreSQL
│
└── app_fe/                       # Frontend — TanStack Start
    ├── src/                      # App source
    │   ├── routes/               # File-based routes (TanStack Router)
    │   ├── components/           # React components
    │   │   └── ui/               # shadcn/ui components
    │   ├── types/
    │   │   └── index.ts          # Shared TypeScript types
    │   └── lib/
    │       ├── directus.ts       # Directus SDK client setup
    │       └── utils/
    │           ├── formatCurrency.ts    # Format numbers as USD currency
    │           ├── formatDateToLocal.ts # Format ISO dates to locale string
    │           └── sanitizeHtml.ts      # DOMPurify sanitizer (SSR-safe)
    ├── public/                   # Static assets
    ├── .env.example              # Environment variable template
    ├── components.json           # shadcn/ui config
    ├── eslint.config.js          # ESLint flat config
    ├── prettier.config.js        # Prettier config
    ├── tsconfig.json
    └── vite.config.ts            # Vite + Nitro + TanStack config
```

## docker-compose.yml

Remember to replace relevent fields with the actual values

```
services:
  database:
    image: postgis/postgis:13-master
    volumes:
      - ./data/database:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: 'directus'
      POSTGRES_PASSWORD: 'directus'
      POSTGRES_DB: 'directus'
    healthcheck:
      test: ['CMD', 'pg_isready', '--host=localhost', '--username=directus']
      interval: 10s
      timeout: 5s
      retries: 5
      start_interval: 5s
      start_period: 30s

  cache:
    image: redis:6
    healthcheck:
      test: ['CMD-SHELL', "[ $$(redis-cli ping) = 'PONG' ]"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_interval: 5s
      start_period: 30s

  directus:
    image: directus/directus:REPLACE_WITH_VERSION
    ports:
      - 8055:8055
    volumes:
      - ./uploads:/directus/uploads
      - ./extensions:/directus/extensions
    depends_on:
      database:
        condition: service_healthy
      cache:
        condition: service_healthy
    healthcheck:
      test:
        [
          'CMD-SHELL',
          'wget --spider -q http://localhost:8055/server/ping || exit 1',
        ]
      interval: 10s
      timeout: 5s
      retries: 5
      start_interval: 5s
      start_period: 30s
    environment:
      SECRET: 'REPLACE_WITH_YOUR_SECRET'

      DB_CLIENT: 'pg'
      DB_HOST: 'database'
      DB_PORT: '5432'
      DB_DATABASE: 'directus'
      DB_USER: 'directus'
      DB_PASSWORD: 'directus'

      CACHE_ENABLED: 'true'
      CACHE_AUTO_PURGE: 'true'
      CACHE_STORE: 'redis'
      REDIS: 'redis://cache:6379'

      CORS_ENABLED: 'true'
      CORS_ORIGIN: 'http://localhost:3000'

      ADMIN_EMAIL: 'youremail@example.com'
      ADMIN_PASSWORD: '1234567890'

      PUBLIC_URL: 'http://localhost:8055'

```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
VITE_TANSTACK_URL=http://localhost:3000
VITE_DIRECTUS_URL=http://localhost:8055
VITE_DIRECTUS_URL_ASSETS=http://localhost:8055/assets
```

---

## Utility Functions

All utilities live in `app_fe/src/lib/utils/`.

### `formatCurrency(amount: number)`

Formats a number as a USD currency string.

```ts
import { formatCurrency } from '~/lib/utils/formatCurrency';

formatCurrency(1999); // "$1,999.00"
```

### `formatDateToLocal(dateStr: string, locale?: string)`

Formats an ISO date string to a long, human-readable date. Defaults to `en-AU` locale.

```ts
import { formatDateToLocal } from '~/lib/utils/formatDateToLocal';

formatDateToLocal('2024-06-15'); // "Saturday, 15 June 2024"
formatDateToLocal('2024-06-15', 'en-US'); // "Saturday, June 15, 2024"
```

### `sanitizeHtml(html: string)`

Sanitizes HTML from a Directus WYSIWYG field using DOMPurify. SSR-safe — returns raw HTML on the server and sanitizes on the client.

```ts
import { sanitizeHtml } from '~/lib/utils/sanitizeHtml';
import parse from 'html-react-parser';

// In your component:
{
  parse(sanitizeHtml(item.description));
}
```

---

## Directus Setup

### Running Locally

Start the Directus + PostgreSQL stack from the `app_be` folder:

```bash
cd app_be
docker compose up -d
```

Directus admin panel is available at `http://localhost:8055`.

### Connecting the SDK

The Directus client is configured in `app_fe/src/lib/directus.ts`. Update `VITE_DIRECTUS_URL` in your `.env` when deploying to a remote host.

### Stopping the Stack

```bash
cd app_be
docker compose down
```

To remove all data (volumes):

```bash
docker compose down -v
```

---

## Deployment

This starter uses the **Nitro node-server** preset. Build and start with:

```bash
npm run build
npm run start
```

The output is in `.output/` and runs as a standard Node.js server. Deploy to any platform that supports Node (Railway, Render, Fly.io, VPS, etc.).

Make sure your production environment has all `.env` variables set, and that your Directus instance is accessible from your app server.

---

## Contributing

Contributions are welcome! Please open an issue or PR.

---

## License

MIT — free to use, modify, and distribute.
