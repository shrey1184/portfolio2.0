# Portfolio CMS (Next.js + Supabase)

Production-ready personal portfolio with a private admin dashboard.

## Stack

- Next.js App Router + TypeScript (strict)
- Tailwind CSS + shadcn-style UI components
- Supabase (PostgreSQL, Auth, Storage)
- Zustand (layout editor state)
- dnd-kit (homepage layout drag-and-drop)

## Features

- Public pages: `/`, `/projects`, `/achievements`, `/experience`, `/contact`
- Private CMS: `/admin`
- Supabase Auth email/password login
- Single-admin enforcement via `ADMIN_EMAIL` + middleware + server validation
- CRUD for projects, achievements, experience
- Publish/draft toggle per item
- Manual ordering via `order`
- Image upload to Supabase Storage (`portfolio-assets`)
- Drag-and-drop homepage section ordering (persisted JSON)
- Theme customization (primary color, secondary color, font family)
- RLS-protected write operations

## Project Structure

```text
app/
  api/admin/upload/route.ts
  admin/
    actions/
    login/page.tsx
    (protected)/
      page.tsx
      projects/page.tsx
      achievements/page.tsx
      experience/page.tsx
      layout-builder/page.tsx
      theme/page.tsx
  achievements/page.tsx
  contact/page.tsx
  experience/page.tsx
  projects/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  admin/
  public/
  ui/
hooks/
  use-layout-editor-store.ts
lib/
  data/
  supabase/
  admin.ts
  auth.ts
  env.ts
  revalidate.ts
  utils.ts
supabase/
  schema.sql
types/
  database.ts
  domain.ts
middleware.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file:

```bash
cp .env.example .env.local
```

3. Fill `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=portfolio-assets
ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@yourdomain.com
```

4. In Supabase SQL Editor, run:

- `supabase/schema.sql`

5. In Supabase Auth:

- Create the admin user with email exactly matching `ADMIN_EMAIL`.
- Set password for that user.

6. Update `admin_config` row if needed:

```sql
update public.admin_config
set admin_email = 'admin@yourdomain.com'
where id = 1;
```

7. Run locally:

```bash
npm run dev
```

## Security Model

- Middleware blocks non-admin access to `/admin/*` except `/admin/login`.
- Every write path (server actions + upload API route) calls server-side admin validation.
- Supabase RLS policies allow:
  - Public read of published content
  - Admin read/write for all content
  - Admin-only storage writes

## Deployment (Vercel)

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add all env vars from `.env.local` to Vercel Project Settings.
4. Ensure Supabase SQL has already been applied in production project.
5. Deploy.
6. Verify:
   - Public routes load content
   - `/admin/login` authenticates
   - CRUD + uploads + layout/theme updates reflect on public pages

## Notes

- `dnd-kit` is used for homepage section ordering (`layout_config.sections`).
- Public pages are server-rendered and fetch live data from Supabase.
- No placeholder content arrays are used; empty states render when tables are empty.
