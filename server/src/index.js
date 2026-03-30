import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import helmet     from 'helmet'
import morgan     from 'morgan'
import rateLimit  from 'express-rate-limit'

import { connectDB }        from './config/db.js'
import { errorHandler }     from './middleware/errorHandler.js'
import { notFound }         from './middleware/notFound.js'

// ── Route imports ──────────────────────────────────────────────────────────
import authRoutes        from './routes/auth.routes.js'
import blogRoutes        from './routes/blog.routes.js'
import volunteerRoutes   from './routes/volunteer.routes.js'
import partnershipRoutes from './routes/partnership.routes.js'
import donationRoutes    from './routes/donation.routes.js'
import newsletterRoutes  from './routes/newsletter.routes.js'
import contactRoutes     from './routes/contact.routes.js'

const app  = express()
const PORT = process.env.PORT || 5000

// ── Security & Middleware ──────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? 'https://rugan.org' : 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))

// ── Rate limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests, please try again later.' })
app.use('/api', limiter)

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes)
app.use('/api/blog',         blogRoutes)
app.use('/api/volunteers',   volunteerRoutes)
app.use('/api/partnerships', partnershipRoutes)
app.use('/api/donations',    donationRoutes)
app.use('/api/newsletter',   newsletterRoutes)
app.use('/api/contact',      contactRoutes)

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }))

// ── Error handlers ─────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start ──────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
})
