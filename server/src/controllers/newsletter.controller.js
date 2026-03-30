import NewsletterSubscriber from '../models/NewsletterSubscriber.model.js'
import { AppError }         from '../middleware/errorHandler.js'

export async function subscribe(req, res, next) {
  try {
    const { email } = req.body
    if (!email) throw new AppError('Email is required', 400)

    const existing = await NewsletterSubscriber.findOne({ email })
    if (existing) {
      if (existing.isActive) {
        return res.json({ success: true, message: 'Already subscribed!' })
      }
      existing.isActive = true
      await existing.save()
      return res.json({ success: true, message: 'Welcome back! You are now re-subscribed.' })
    }

    await NewsletterSubscriber.create({ email })
    res.status(201).json({ success: true, message: 'Subscribed successfully!' })
  } catch (err) {
    next(err)
  }
}

export async function unsubscribe(req, res, next) {
  try {
    const { email } = req.body
    const subscriber = await NewsletterSubscriber.findOne({ email })
    if (!subscriber) throw new AppError('Email not found', 404)

    subscriber.isActive = false
    await subscriber.save()
    res.json({ success: true, message: 'Unsubscribed successfully.' })
  } catch (err) {
    next(err)
  }
}

export async function getSubscribers(req, res, next) {
  try {
    const subscribers = await NewsletterSubscriber.find({ isActive: true }).sort({ subscribedAt: -1 })
    res.json({ success: true, data: subscribers, total: subscribers.length })
  } catch (err) {
    next(err)
  }
}
