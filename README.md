# RUGAN Website

Full-stack website for RUGAN NGO — empowering rural girl-children through education, mentorship, and advocacy.

## Tech Stack

| Layer    | Technology                                 |
|----------|--------------------------------------------|
| Frontend | React 19, React Router v7, Tailwind CSS v3 |
| Backend  | Node.js, Express.js                        |
| Database | MongoDB + Mongoose                         |
| Forms    | React Hook Form + Zod validation           |
| Auth     | JWT (JSON Web Tokens)                      |
| Email    | Nodemailer (SMTP)                          |
| Build    | Vite                                       |

---


## Getting Started

### 1. Install all dependencies

```bash
cd rugan
npm run install:all
```

> If you hit peer dependency conflicts, run the client install manually:
> ```bash
> npm install --prefix client --legacy-peer-deps
> ```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your MongoDB URI, JWT secret, and SMTP credentials.

### 3. Run both dev servers

```bash
npm run dev
```

- Client → http://localhost:5173
- Server → http://localhost:5000

---

## Design System

### Brand Colors (CSS Custom Properties — `globals.css`)

| Variable               | Value     | Usage                              |
|------------------------|-----------|------------------------------------|
| `--color-primary`      | `#4F7B44` | Hero, navbar logo, icon accents    |
| `--color-btn-orange`   | `#D6670F` | "Make a Donation" CTA button       |
| `--color-cta-banner`   | `#548349` | Mid-page CTA banner background     |
| `--color-footer`       | `#101828` | Footer background                  |
| `--color-teal`         | `#5B8A8C` | Partner logos + newsletter section |
| `--color-primary-light`| `#e8f2e6` | Icon box backgrounds, badges       |

> All colors are CSS custom properties. Never hardcode hex values in components — reference variables.

### Button Variants

| Class / Prop      | Appearance                          | Used for                    |
|-------------------|-------------------------------------|-----------------------------|
| `btn-primary`     | Orange solid                        | "Make a Donation"           |
| `btn-green`       | Green solid                         | General primary actions     |
| `btn-volunteer`   | White bg + primary text             | "Volunteer With Us"         |
| `btn-outline-white`| Transparent + white border         | On dark/colored backgrounds |
| `btn-outline-green`| Transparent + green border         | On light backgrounds        |

### Section Background Classes

| Class                | Color       | Used on                        |
|----------------------|-------------|--------------------------------|
| `.section-cta`       | `#548349`   | Mid-page CTA banners           |
| `.section-footer`    | `#101828`   | Footer                         |
| `.section-teal`      | `#5B8A8C`   | Partner logos, newsletter      |
| `.section-light-green`| `#f0f7ee`  | Alternating section background |
| `.section-muted`     | `#F9FAFB`   | Subtle alternating background  |

### Shared CSS Classes

- `.container-rugan` — max-width 1200px, centered, responsive padding
- `.section-padding` — vertical section spacing (responsive)
- `.section-padding-sm` — reduced vertical spacing
- `.section-title` — responsive heading for section titles
- `.section-subtitle` — muted centered subtitle
- `.card` / `.card-hover` — white card with shadow
- `.form-input` / `.form-label` / `.form-error` — form field styles
- `.badge` / `.badge-green` / `.badge-orange` — pill labels
- `.icon-box` / `.icon-box-sm` — icon containers
- `.page-hero` / `.page-hero-overlay` / `.page-hero-content` — inner page banners

---

## API Endpoints

### Auth
| Method | Endpoint           | Access     |
|--------|--------------------|------------|
| POST   | /api/auth/login    | Public     |
| GET    | /api/auth/me       | Protected  |
| POST   | /api/auth/register | Admin only |

### Blog
| Method | Endpoint              | Access     |
|--------|-----------------------|------------|
| GET    | /api/blog/posts       | Public     |
| GET    | /api/blog/posts/:slug | Public     |
| POST   | /api/blog/posts       | Protected  |
| PUT    | /api/blog/posts/:id   | Protected  |
| DELETE | /api/blog/posts/:id   | Admin only |

### Forms (Public)
| Method | Endpoint                    |
|--------|-----------------------------|
| POST   | /api/volunteers/apply       |
| POST   | /api/partnerships/inquiry   |
| POST   | /api/donations              |
| POST   | /api/newsletter/subscribe   |
| POST   | /api/newsletter/unsubscribe |
| POST   | /api/contact                |

### Admin (Protected)
| Method | Endpoint                     |
|--------|------------------------------|
| GET    | /api/volunteers              |
| PATCH  | /api/volunteers/:id/status   |
| GET    | /api/partnerships            |
| PATCH  | /api/partnerships/:id/status |
| GET    | /api/donations               |
| GET    | /api/newsletter/subscribers  |

---

## Pages

### Public Pages
| Page            | Route              | Status        |
|-----------------|--------------------|---------------|
| Home            | `/`                | Complete      |
| About           | `/about`           | Complete      |
| Team            | `/team`            | Complete      |
| Programs        | `/programs`        | Complete      |
| Program Detail  | `/programs/:slug`  | Complete      |
| Impact          | `/impact`          | Complete      |
| Volunteers      | `/volunteers`      | Complete      |
| Partnership     | `/partnership`     | Complete      |
| Blog            | `/blog`            | Complete      |
| Blog Detail     | `/blog/:slug`      | Complete      |
| Donation        | `/donate`          | Complete      |
| Donation Success| `/donate/success`  | Complete      |
| Privacy Policy  | `/privacy`         | Complete      |
| Terms & Conditions | `/terms`        | Complete      |

### Admin Pages
| Page            | Route              | Status        |
|-----------------|--------------------|---------------|
| Admin Login     | `/admin/login`     | Complete      |
| Admin Dashboard | `/admin`           | Complete      |
| Analytics       | `/admin/analytics` | Complete      |
| Blog Management | `/admin/posts`     | Complete      |
| User Management | `/admin/users`     | Complete      |
| Broadcast       | `/admin/broadcast` | Complete      |

### Program slugs
`idgc` · `healthy-period` · `rise` · `excellence-award` · `rural-to-global`

---

## Current Features & Implementation

### Fully Implemented Features
- ✅ **Public Website** — All main pages with responsive design
- ✅ **Blog System** — Create, read, update, delete blog posts with CMS
- ✅ **Donation System** — Accept donations with success tracking
- ✅ **Volunteer Management** — Accept and manage volunteer applications
- ✅ **Partnership Inquiries** — Handle partnership inquiry forms
- ✅ **Newsletter** — Email subscription and unsubscribe functionality
- ✅ **Admin Dashboard** — Analytics and metrics tracking
- ✅ **Admin CMS** — Manage blog posts, users, and communications
- ✅ **Email Notifications** — Nodemailer integration for automated emails
- ✅ **Authentication** — JWT-based admin authentication
- ✅ **Performance Optimization** — Caching middleware and optimized queries

### Recently Completed
- Admin analytics page with performance optimizations
- CMS performance improvements for faster queries
- Mobile-responsive admin interface
- Enhanced error handling across all endpoints

---

## Conventions

- **Colors** — always use CSS custom properties (`var(--color-primary)`), never raw hex in components
- **Styling** — shared/structural styles in `globals.css`; component-specific layout in Tailwind inline classes
- **Comments** — section titles only; no instructional or conversational inline comments
- **Data** — pages use placeholder shells; connect to backend via `useApi()` hook
- **Images** — place in `client/public/images/` and reference as `/images/filename.jpg`
