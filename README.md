# SGA - Sistema de Gestao de Advocacia

Aplicacao fullstack para gestao de escritorios de advocacia, com login JWT, convites de equipe, cadastro de clientes e dashboard web.

## Estrutura
- `backend/`: API Node.js (Express 5 + PostgreSQL, JWT, bcrypt, nodemailer).
- `frontend/`: Vite + React 18 + TypeScript, React Router, TanStack React Query, Tailwind + shadcn/ui, sonner/toaster.
- `data/postgres-data`: volume do banco para uso com Docker.
- `docker-compose.yml`: sobe apenas o PostgreSQL localmente.

## Requisitos
- Node.js 18+ e npm.
- PostgreSQL local ou via Docker.
- Variaveis de ambiente configuradas (veja exemplos abaixo).

## Backend
1. Crie `backend/.env`:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=senha123
   DB_NAME=postgres
   JWT_SECRET=sua_chave_segura
   JWT_EXPIRES_IN=8h
   BCRYPT_SALT_ROUNDS=10
   SMTP_HOST=smtp.seuprovedor.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=usuario@dominio.com
   SMTP_PASSWORD=senha
   SMTP_FROM=SGA <no-reply@dominio.com>
   ```
2. Monte o schema no Postgres (inclui slug do escritorio e status dos clientes). Arquivo de referencia: `backend/db/schema.sql`.
   ```sh
   psql -h localhost -U postgres -d postgres -f backend/db/schema.sql
   ```
   Em bancos ja existentes, adicione manualmente:
   - Coluna `slug TEXT UNIQUE NOT NULL` em `law_firms` (gerado a partir do nome do escritorio, sem sufixos numericos).
   - Colunas em `clients`: `status TEXT DEFAULT 'pending'`, `sources TEXT DEFAULT 'public_form'`, `service_type TEXT`, `date_of_birth DATE`, `passport_number TEXT`, `address TEXT`, `postal_code TEXT`, `nationality TEXT`.
3. Instale e rode:
   ```sh
   cd backend
   npm install
   npm run dev
   ```

Endpoints principais:
- `/auth/login`, `/auth/register-firm`, `/auth/complete-invite`, `/auth/me`
- `/users/staff` (GET/POST)
- `/clients` (GET/POST) e `/clients/:id/status` (PATCH) para staff
- `/public/forms/:slug/clients` (POST) formulario publico de cliente por slug do escritorio

## Frontend
1. Crie `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```
2. Instale e rode:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
3. Acesse `http://localhost:5173`.

## Banco via Docker
```sh
docker compose up -d db
```

## Formulario publico por escritorio
- Rota publica: `POST /public/forms/:slug/clients` (payload: nome, email, DDI, DDD, telefone, servico, data de nascimento, passaporte, NIF opcional, endereco, codigo postal, nacionalidade). Status inicial: `pending` e origem `public_form` (coluna `sources`).
- Admin do escritorio recebe e-mail no `firm_email`.
- Staff pode mudar o status para `active/rejected` via painel (endpoint `/clients/:id/status`).

## Boas praticas
- Sempre validar entrada no backend (ex.: payloads de auth e de clientes) e retornar mensagens claras.
- Manter JWT com prazo curto (`JWT_EXPIRES_IN`) e rotacionar `JWT_SECRET` quando necessario.
- Configurar CORS apenas para as origens usadas pelo frontend.
- No frontend, centralize chamadas HTTP em `src/lib/api.ts` e reutilize React Query para cache/estado de rede.
- Padronize textos sem acentos nos arquivos de codigo para evitar problemas de encoding em ambientes Windows.
- Para emails, configure SMTP real e monitore falhas no log.

## Limpezas realizadas
- Remocao de dependencias nao usadas no frontend (pacotes Radix extras, cmdk, date-fns, embla, input-otp, react-day-picker, react-hook-form, etc.).
- Remocao de componentes shadcn nao usados (alert, breadcrumb, form, alias de toast) deixando apenas o essencial.
- Normalizacao de mensagens/logs com texto simples para evitar caracteres corrompidos.
