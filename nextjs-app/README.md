# Dola Foundation — Next.js 15 Website

A complete, production-ready NGO website built with Next.js 15, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- **Public Website**: Home, About, Programs (6), Projects, Gallery, Blog, Volunteer, Donate, Contact
- **Admin Dashboard**: Full CRUD for all content, donation tracking, volunteer management
- **Authentication**: NextAuth v5 with credentials provider
- **Database**: PostgreSQL with Prisma ORM
- **Email**: Resend for transactional emails
- **Image Upload**: Cloudinary integration
- **Rich Text Editor**: Tiptap for blog/content editing

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + Shadcn/UI
- Framer Motion
- PostgreSQL + Prisma
- NextAuth v5
- Cloudinary
- Resend

## Setup

### 1. Install dependencies

```bash
cd nextjs-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `CLOUDINARY_*` — From your Cloudinary dashboard
- `RESEND_API_KEY` — From resend.com

### 3. Setup database

```bash
npm run db:push
```

### 4. Create admin user

```bash
npm run db:seed
```

Or manually insert via Prisma Studio:
```bash
npm run db:studio
```

Create a user with a bcrypt-hashed password.

### 5. Run development server

```bash
npm run dev
```

Visit:
- Website: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Admin Login

Default credentials (change immediately after first login):
- Email: admin@dolafoundation.org
- Password: set during seeding

## Brand Colors

| Color | Hex |
|-------|-----|
| Primary Blue | #0F3D8C |
| Green | #1F9D55 |
| Gold | #F4B400 |
| Dark | #1A1A2E |
| Background | #F8FAFC |

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### Self-hosted

```bash
npm run build
npm start
```

## File Structure

```
nextjs-app/
├── app/
│   ├── (public)/       # Public pages
│   ├── (admin)/        # Admin dashboard
│   └── api/            # API routes
├── components/
│   ├── ui/             # Shadcn components
│   ├── layout/         # Navbar, Footer
│   ├── home/           # Home page sections
│   ├── admin/          # Admin components
│   └── shared/         # Reusable components
├── lib/                # Utilities, DB, Auth
├── actions/            # Server actions
├── prisma/             # Database schema
└── types/              # TypeScript types
```
# Force redeploy Wed Jun 10 13:24:10 UTC 2026
