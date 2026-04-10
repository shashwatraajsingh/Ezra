# Ezra — AI Resume Platform

Ezra is a full-stack web application built for engineering students who want to create, refine, and export professional resumes with the help of AI. Upload your own template or pick from a curated library, edit the generated LaTeX in a live split-view editor, and download a compiled PDF — all in one place.

---

## What it does

- **Authentication** — Students sign up with their name, email, branch, and college. Passwords are hashed with Argon2id and sessions are managed through a signed JWT.
- **Template Gallery** — Browse prebuilt LaTeX resume templates or upload your own PDF/DOCX/TeX file. Uploaded files are processed by an AI pipeline that reverse-engineers the layout, generates clean LaTeX, and extracts editable placeholders.
- **Resume Editor** — A full-screen split-view editor with a LaTeX pane on the left and a compiled PDF preview on the right. Changes auto-save every three seconds. A Recompile button triggers server-side `pdflatex` compilation and renders the result inline.
- **Dashboard** — Displays your profile, AI credit balance, resume list with ATS scores, and uploaded templates, all in one place.
- **ATS scoring** — Each resume carries an ATS compatibility score so you know how well it will parse through automated screening systems.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| UI components | shadcn/ui, Framer Motion, Lucide React |
| Backend | NestJS 11, TypeScript |
| Database | MySQL 8, TypeORM |
| Auth | Passport.js — Local strategy + JWT (Bearer) |
| Password hashing | Argon2id (`argon2` npm package) |
| File handling | Multer (disk storage) |
| PDF compilation | `pdflatex` (server-side, via Node `child_process`) |

---

## Project structure

```
Ezra/
├── Backend/                  NestJS API
│   ├── src/
│   │   ├── auth/             Login, signup, JWT & Local passport strategies
│   │   ├── students/         Student entity
│   │   ├── templates/        Template CRUD + file upload + AI processing
│   │   ├── resumes/          Resume CRUD + pdflatex compile endpoint
│   │   ├── migrations/       TypeORM migration files
│   │   └── database/         Standalone DataSource for CLI
│   └── .env.example
│
└── frontend-app/             Next.js frontend
    └── src/
        ├── app/
        │   ├── page.tsx          Landing page (hero + pricing)
        │   ├── auth/             Login and signup pages
        │   ├── dashboard/        User dashboard
        │   ├── templates/        Template gallery
        │   └── resumes/[id]/     Split-view LaTeX editor
        ├── components/
        │   ├── ui/               Shared UI primitives (navbar, cards, animations)
        │   ├── dashboard/        Dashboard-specific components
        │   └── editor/           Editor-specific components
        ├── hooks/                Custom React hooks (useAuth, useResumeEditor)
        └── lib/
            ├── api/              Fetch helpers (auth headers, resume/template calls)
            └── types/            Shared TypeScript interfaces
```

---

## Getting started

### Prerequisites

- Node.js 20 or later
- MySQL 8 running locally (or a remote instance)
- `pdflatex` installed on the machine running the backend (for PDF compilation)

```bash
# On Ubuntu/Debian
sudo apt install texlive-latex-base texlive-fonts-recommended

# On macOS (via Homebrew)
brew install --cask mactex
```

### 1. Clone the repo

```bash
git clone git@github.com:shashwatraajsingh/Ezra.git
cd Ezra
```

### 2. Set up the backend

```bash
cd Backend
cp .env.example .env
```

Open `.env` and fill in your database credentials and a strong JWT secret:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=ezra_db

# Generate with: openssl rand -base64 64
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d
```

Install dependencies and run migrations:

```bash
npm install

# Create the database first if it doesn't exist
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ezra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run all migrations
npm run migration:run

# Start the dev server
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### 3. Set up the frontend

```bash
cd ../frontend-app
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3001` (Next.js picks the next available port if 3000 is taken by the backend).

---

## Environment variables

### Backend (`Backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | `development` or `production` | `development` |
| `PORT` | Port the NestJS server listens on | `3000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USERNAME` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | — |
| `DB_NAME` | Database name | `ezra_db` |
| `JWT_SECRET` | Secret used to sign tokens — keep this private | — |
| `JWT_EXPIRES_IN` | Token lifespan (e.g. `7d`, `24h`) | `7d` |

### Frontend (`frontend-app/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Full base URL of the NestJS API |

---

## API overview

All protected routes require an `Authorization: Bearer <token>` header.

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | No | Register a new student |
| `POST` | `/auth/login` | No | Login and receive a JWT |
| `GET` | `/templates/prebuilt` | Yes | List all built-in templates |
| `GET` | `/templates/mine` | Yes | List your uploaded templates |
| `POST` | `/templates/upload` | Yes | Upload a template file for AI processing |
| `DELETE` | `/templates/:id` | Yes | Delete one of your templates |
| `GET` | `/resumes` | Yes | List all your resumes |
| `GET` | `/resumes/:id` | Yes | Get a single resume |
| `POST` | `/resumes` | Yes | Create a new resume (optionally from a template) |
| `PATCH` | `/resumes/:id` | Yes | Update LaTeX source or field values |
| `POST` | `/resumes/:id/compile` | Yes | Compile LaTeX to PDF server-side |
| `DELETE` | `/resumes/:id` | Yes | Delete a resume |

---

## Database schema

```
student_details          templates               resumes
───────────────          ─────────────           ───────
id (PK)                  id (PK)                 id (PK)
name                     name                    title
email (unique)           description             latex_source
password (argon2id)        kind (enum)             field_values (JSON)
branch                   file_ref                compiled_pdf_path
college                  latex_source            ats_score
resume                   placeholders (JSON)     status (enum)
number_of_resumes        student_id (FK, null)   compile_error
ai_credit                created_at              student_id (FK)
created_at               updated_at              template_id (FK, null)
updated_at                                       created_at
                                                 updated_at
```

Migrations live in `Backend/src/migrations/` and are run with `npm run migration:run`. Never use `synchronize: true` in production.

---

## Authentication flow

1. A student signs up at `/auth/signup` — the backend hashes the password and stores the record.
2. On login at `/auth/login`, the Local strategy validates credentials and the service returns a signed JWT.
3. The frontend stores the token in `localStorage` under the key `access_token`.
4. Every subsequent API call includes the token as a `Bearer` header.
5. The JWT strategy on the backend validates the token and attaches the payload (`{ sub, email }`) to `req.user`.
6. Signing out clears `localStorage` and redirects to the home page.

---

## Running database migrations

```bash
cd Backend

# Apply all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Generate a new migration from entity changes
npm run migration:generate

# See migration status
npm run migration:show
```

---

## Notes

- The AI template processing is currently a stub that generates a standard LaTeX skeleton and a default set of placeholders. Replace the `runAiProcessing` method in `TemplatesService` with your real Gemini/OpenAI call when ready.
- Compiled PDFs are written to `Backend/public/uploads/compiled/` and served as static files. In production, point this to an S3 bucket or equivalent.
- `pdflatex` must be installed on the server for the compile endpoint to work. The service captures compiler errors and returns them in the `compileError` field so the editor can show them inline.

---

## License

MIT
