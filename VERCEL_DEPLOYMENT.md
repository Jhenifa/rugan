# Vercel Deployment

This repository is configured to deploy to Vercel as two projects from the same Git repository:

- `client` for the Vite frontend
- `server` for the Express API

## 1. Backend project

- Import the repository into Vercel
- Set the Root Directory to `server`
- Framework Preset: `Other`
- Build Command: leave empty
- Output Directory: leave empty

### Backend environment variables

Set these in Vercel for the `server` project:

- `NODE_ENV=production`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `PAYSTACK_SECRET_KEY`
- `VOLUNTEER_SHEET_ID`
- `GOOGLE_CREDENTIALS`
- `FRONTEND_URL`
- `CORS_ORIGIN`

Recommended `CORS_ORIGIN` value:

```text
https://your-frontend-domain.vercel.app,https://rugan.org,https://www.rugan.org
```

If you want to allow any frontend origin temporarily during setup, use:

```text
*
```

## 2. Frontend project

- Import the same repository again into Vercel
- Set the Root Directory to `client`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### Frontend environment variables

Set this in Vercel for the `client` project:

- `VITE_API_BASE_URL=https://your-backend-domain.vercel.app`

The frontend app automatically appends `/api` if you provide only the backend origin.

## 3. Post-deploy checks

- Visit `https://your-backend-domain.vercel.app/api/health`
- Visit the frontend site and submit a newsletter form
- Test donations and update the Paystack webhook URL to:

```text
https://your-backend-domain.vercel.app/api/donations/webhook
```

## Notes

- Local development still uses the Vite proxy in `client/vite.config.js`
- The Vercel frontend config rewrites SPA routes to `index.html` so React Router deep links work
