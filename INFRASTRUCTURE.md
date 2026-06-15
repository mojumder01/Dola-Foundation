# Dola Foundation — Infrastructure & Services

> Fill in the **Account** column with the email/login you used when you signed up for each service.

---

## 1. Source Code (GitHub)

| Item | Detail |
|------|--------|
| Service | GitHub |
| Repository | `mojumder01/Dola-Foundation` |
| URL | https://github.com/mojumder01/Dola-Foundation |
| Account (GitHub login) | `mojumder01` |
| Main dev branch | `claude/sharp-hawking-fnam76` |
| Production branch | `claude/trusting-meitner-vf6k3c` |

**What it does:** Stores all source code. Pushing to the production branch automatically triggers deployment to Vercel via GitHub Actions.

---

## 2. Frontend Hosting (Vercel)

| Item | Detail |
|------|--------|
| Service | Vercel |
| URL | https://vercel.com |
| Live site | https://dolafoundation.com |
| Account email | _(fill in your Vercel login email)_ |
| Project name | _(check Vercel Dashboard → Projects)_ |

**GitHub Secrets required (Settings → Secrets → Actions):**

| Secret Name | Where to get it |
|-------------|-----------------|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens → "GitHub Action" token |
| `DATABASE_URL` | Neon Dashboard → your project → Connection string |

**Environment Variables (set in Vercel Dashboard → Settings → Environment Variables):**

| Variable | Value source |
|----------|-------------|
| `DATABASE_URL` | Neon connection string |
| `NEXTAUTH_SECRET` | Random 32-char string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://dolafoundation.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `FROM_EMAIL` | `noreply@dolafoundation.com` |
| `ADMIN_EMAIL` | `info@dolafoundation.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://dolafoundation.com` |

---

## 3. Database (Neon)

| Item | Detail |
|------|--------|
| Service | Neon (serverless PostgreSQL) |
| URL | https://console.neon.tech |
| Account email | _(fill in your Neon login email)_ |
| Database name | `dola_foundation` (or auto-named) |
| Region | _(check Neon Dashboard)_ |

**What it does:** Stores all data — programs, projects, blog posts, donations, volunteers, contacts, gallery images, admin users, and site settings.

**To apply schema changes:** Go to Neon Dashboard → SQL Editor and run:
```sql
-- Example: if a new column was added in schema.prisma
ALTER TABLE "Program" ADD COLUMN IF NOT EXISTS "longDescription" TEXT;
```
Or set `DATABASE_URL` in GitHub Secrets and it runs automatically on each deploy.

---

## 4. Image Storage (Cloudinary)

| Item | Detail |
|------|--------|
| Service | Cloudinary |
| URL | https://cloudinary.com |
| Account email | _(fill in your Cloudinary login email)_ |
| Cloud name | _(from Cloudinary Dashboard)_ |

**What it does:** Stores uploaded images (blog cover images, gallery photos). Images are uploaded from the admin panel and the URL is saved to the database.

**Free tier:** 25 GB storage + 25 GB bandwidth/month (more than enough to start).

---

## 5. Email Sending (Resend)

| Item | Detail |
|------|--------|
| Service | Resend |
| URL | https://resend.com |
| Account email | _(fill in your Resend login email)_ |
| From address | `noreply@dolafoundation.com` |

**What it does:** Sends email notifications when someone fills out the contact form. Also used for volunteer application confirmation emails.

**Free tier:** 3,000 emails/month, 100 emails/day.

**Domain verification:** You need to verify `dolafoundation.com` in Resend → Domains to send from your domain address.

---

## 6. Domain Name

| Item | Detail |
|------|--------|
| Domain | `dolafoundation.com` |
| Registrar | _(where you bought the domain — e.g. Namecheap, GoDaddy)_ |
| Account email | _(fill in your registrar login email)_ |
| DNS pointing to | Vercel (nameservers or A/CNAME records) |

**DNS setup:** In your registrar's DNS settings, the domain should point to Vercel. Vercel automatically provides SSL.

---

## 7. CI/CD Pipeline (GitHub Actions)

| Item | Detail |
|------|--------|
| Config file | `.github/workflows/deploy.yml` |
| Trigger | Push to `claude/trusting-meitner-vf6k3c` branch |

**Pipeline steps (runs automatically on every push):**
1. Checkout code
2. Install Node.js 20 + npm dependencies
3. TypeScript type check
4. Install Vercel CLI
5. Pull Vercel environment variables
6. Apply database schema (`prisma db push`) — skipped if DATABASE_URL secret is not set
7. Build with Vercel CLI
8. Deploy to Vercel production

---

## 8. Admin Panel

| Item | Detail |
|------|--------|
| URL | https://dolafoundation.com/admin |
| Login page | https://dolafoundation.com/admin/login |
| Default email | _(set during `npm run db:seed`)_ |
| Default password | _(set during `npm run db:seed`)_ |

**To create the first admin user**, run in Neon SQL Editor:
```sql
-- Replace with real values (password must be bcrypt hashed)
INSERT INTO "AdminUser" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'admin@dolafoundation.com', '$2b$10$...hashed_password...', 'Admin', 'ADMIN', now(), now());
```

Or run `npm run db:seed` locally with `DATABASE_URL` set.

---

## Quick Reference

| Service | Login URL | Purpose |
|---------|-----------|---------|
| GitHub | github.com/login | Source code |
| Vercel | vercel.com/login | Hosting & deployment |
| Neon | console.neon.tech | Database |
| Cloudinary | cloudinary.com/users/login | Image storage |
| Resend | resend.com/login | Email sending |
| Domain registrar | _(varies)_ | Domain management |
