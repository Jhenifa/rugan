# RUGAN Website

Full-stack website for RUGAN NGO — empowering rural girl-children through education, mentorship, and advocacy.

## Tech Stack

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Frontend | React 19, React Router v7, Tailwind CSS v3  |
| Backend  | Node.js, Express.js                         |
| Database | MongoDB + Mongoose                          |
| Forms    | React Hook Form + Zod validation            |
| Auth     | JWT (JSON Web Tokens)                       |
| Email    | Nodemailer (SMTP)                           |
| Build    | Vite                                        |

---

## Project Structure

```
rugan/
├── package.json              # Root — runs both client & server concurrently
├── .gitignore
│
├── client/                   # React frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js    # Design tokens (colors, typography, spacing)
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── router.jsx        # All page routes
│       ├── styles/
│       │   └── globals.css   # Tailwind directives + component classes
│       ├── lib/
│       │   ├── cn.js         # Tailwind class merge utility
│       │   └── api.js        # Axios instance with interceptors
│       ├── hooks/
│       │   ├── useApi.js     # Generic GET data fetching hook
│       │   └── useScrollTop.js
│       ├── context/          # React context (auth, etc.) — add as needed
│       ├── assets/           # images/, icons/, fonts/
│       │
│       ├── components/
│       │   ├── ui/           # Primitive building blocks
│       │   │   ├── Button.jsx
│       │   │   ├── Badge.jsx
│       │   │   ├── IconBox.jsx
│       │   │   └── SectionHeader.jsx
│       │   ├── layout/       # App shell
│       │   │   ├── RootLayout.jsx
│       │   │   ├── Navbar.jsx
│       │   │   └── Footer.jsx
│       │   ├── common/       # Reusable page-level components
│       │   │   ├── PageHeroBanner.jsx
│       │   │   ├── CTABanner.jsx
│       │   │   ├── StatCard.jsx
│       │   │   ├── IconFeatureCard.jsx
│       │   │   ├── ProgramCard.jsx
│       │   │   ├── TeamMemberCard.jsx
│       │   │   ├── BlogCard.jsx
│       │   │   ├── SuccessStoryCard.jsx
│       │   │   ├── ChecklistItem.jsx
│       │   │   ├── PhotoGallery.jsx
│       │   │   ├── Timeline.jsx
│       │   │   ├── FAQAccordion.jsx
│       │   │   └── PartnerLogo.jsx
│       │   └── forms/        # Form components (with validation)
│       │       ├── VolunteerForm.jsx
│       │       ├── PartnershipForm.jsx
│       │       ├── DonationForm.jsx
│       │       └── NewsletterForm.jsx
│       │
│       └── pages/
│           ├── HomePage.jsx
│           ├── AboutPage.jsx
│           ├── TeamPage.jsx
│           ├── ProgramsPage.jsx
│           ├── programs/
│           │   └── ProgramDetailPage.jsx  # Reusable for all 5 programs
│           ├── ImpactPage.jsx
│           ├── VolunteerPage.jsx
│           ├── PartnershipPage.jsx
│           ├── BlogPage.jsx
│           └── DonationPage.jsx
│
└── server/                   # Express backend
    ├── package.json
    ├── .env.example
    └── src/
        ├── index.js          # App entry, middleware, route mounting
        ├── config/
        │   └── db.js         # MongoDB connection
        ├── middleware/
        │   ├── auth.js       # JWT protect + adminOnly guards
        │   ├── errorHandler.js
        │   └── notFound.js
        ├── models/
        │   ├── User.model.js
        │   ├── BlogPost.model.js
        │   ├── VolunteerApplication.model.js
        │   ├── PartnershipInquiry.model.js
        │   ├── Donation.model.js
        │   └── NewsletterSubscriber.model.js
        ├── controllers/
        │   ├── auth.controller.js
        │   ├── blog.controller.js
        │   ├── volunteer.controller.js
        │   ├── partnership.controller.js
        │   ├── donation.controller.js
        │   ├── newsletter.controller.js
        │   └── contact.controller.js
        ├── routes/
        │   ├── auth.routes.js
        │   ├── blog.routes.js
        │   ├── volunteer.routes.js
        │   ├── partnership.routes.js
        │   ├── donation.routes.js
        │   ├── newsletter.routes.js
        │   └── contact.routes.js
        └── utils/
            ├── email.js      # Nodemailer helper
            └── helpers.js    # asyncHandler, paginate, sanitize
```

---

## Getting Started

### 1. Clone & install all dependencies

```bash
git clone <repo-url>
cd rugan
npm run install:all
```

> **Note:** If you hit any peer dependency conflicts, run the client install manually:
> ```bash
> npm install --prefix client --legacy-peer-deps
> ```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI, JWT secret, SMTP credentials
```

### 3. Run development servers

```bash
npm run dev
# Client → http://localhost:5173
# Server → http://localhost:5000
```

---

## API Endpoints

### Auth
| Method | Endpoint             | Access       | Description          |
|--------|----------------------|--------------|----------------------|
| POST   | /api/auth/login      | Public       | Login                |
| GET    | /api/auth/me         | Protected    | Get current user     |
| POST   | /api/auth/register   | Admin only   | Create editor user   |

### Blog
| Method | Endpoint             | Access       | Description          |
|--------|----------------------|--------------|----------------------|
| GET    | /api/blog/posts      | Public       | List all posts       |
| GET    | /api/blog/posts/:slug| Public       | Get single post      |
| POST   | /api/blog/posts      | Protected    | Create post          |
| PUT    | /api/blog/posts/:id  | Protected    | Update post          |
| DELETE | /api/blog/posts/:id  | Admin only   | Delete post          |

### Forms (Public)
| Method | Endpoint                      | Description               |
|--------|-------------------------------|---------------------------|
| POST   | /api/volunteers/apply         | Submit volunteer form     |
| POST   | /api/partnerships/inquiry     | Submit partnership form   |
| POST   | /api/donations                | Record bank transfer      |
| POST   | /api/newsletter/subscribe     | Newsletter signup         |
| POST   | /api/newsletter/unsubscribe   | Newsletter opt-out        |
| POST   | /api/contact                  | General contact form      |

### Admin (Protected)
| Method | Endpoint                       | Description               |
|--------|--------------------------------|---------------------------|
| GET    | /api/volunteers                | List applications         |
| PATCH  | /api/volunteers/:id/status     | Update application status |
| GET    | /api/partnerships              | List inquiries            |
| PATCH  | /api/partnerships/:id/status   | Update inquiry status     |
| GET    | /api/donations                 | List donations            |
| GET    | /api/newsletter/subscribers    | List subscribers          |

---

## Pages Overview

| Page                | Route                    | Template          |
|---------------------|--------------------------|-------------------|
| Homepage            | /                        | Unique            |
| About               | /about                   | Unique            |
| Team                | /team                    | Unique            |
| Programs            | /programs                | Unique            |
| Program Detail (×5) | /programs/:slug          | Shared template   |
| Impact              | /impact                  | Unique            |
| Volunteers          | /volunteers              | Unique            |
| Partnership         | /partnership             | Unique            |
| Blog                | /blog                    | Unique            |
| Donation            | /donate                  | Unique            |

### Program slugs
- `idgc`
- `healthy-period`
- `rise`
- `excellence-award`
- `rural-to-global`

---