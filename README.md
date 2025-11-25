# SGA – Sistema de Gestão de Advocacia

Aplicação fullstack para gestão de escritórios de advocacia, com autenticação, convites de equipe, cadastro de clientes e dashboard web.

## Funcionalidades principais
- Autenticação JWT com login, registro de escritório (cria admin), fluxo de convite para colaboradores (token + expiração).
- Gestão de clientes (listar/criar) com escopo por escritório.
- Consulta de sessão autenticada (`/auth/me`) e listagem de staff do escritório.
- Painel web em React com páginas de dashboard, leads, clientes, processos, agenda, documentos, financeiro e usuários.
- Envio de e-mail de convite via SMTP.

## Stack
- **Frontend:** Vite + React 18 + TypeScript, React Router, TanStack React Query, Tailwind CSS + shadcn/ui/Radix, sonner/toaster para notificações.
- **Backend:** Node.js (CommonJS) com Express 5, PostgreSQL (pg), JWT (jsonwebtoken), bcrypt para senha, nodemailer para SMTP, dotenv, CORS.
- **Infra local:** Docker Compose com PostgreSQL 18.

## Como rodar

### Backend
1. Crie `backend/.env` (exemplo):
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
   SMTP_HOST=...
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=...
   SMTP_PASSWORD=...
   SMTP_FROM=...
   ```
2. Instale deps e suba o server:
   ```sh
   cd backend
   npm install
   npm run dev
   ```

### Frontend
1. Crie `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```
2. Instale deps e rode:
   ```sh
   npm install
   npm run dev
   ```
3. Acesse `http://localhost:5173` (porta padrão do Vite).

### Banco via Docker
```sh
docker compose up -d db
```

## Endpoints principais
- `POST /auth/login` — login com email/senha.
- `POST /auth/register-firm` — cria escritório e usuário ADMIN.
- `POST /auth/complete-invite` — define senha a partir do token de convite.
- `GET /auth/me` — dados do usuário autenticado.
- `GET /users/staff` — lista equipe do escritório (ADMIN).
- `POST /users/staff` — cria convite de colaborador (ADMIN).
- `GET /clients` — lista clientes do escritório (auth).
- `POST /clients` — cria cliente (auth).

## Notas
- Tokens são validados no middleware consultando o usuário no banco e o `law_firm_id`.
- Invite de staff gera link `https://sgadvocacias.com/invite/confirm?token=...` (ajuste no frontend se necessário).
