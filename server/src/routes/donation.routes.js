// donation.routes.js
import { Router }                                              from 'express'
import { recordDonation, handleWebhook, getDonations }        from '../controllers/donation.controller.js'
import { protect, adminOnly }                                 from '../middleware/auth.js'

const donationRouter = Router()
donationRouter.post('/',          recordDonation)
donationRouter.post('/webhook',   handleWebhook)
donationRouter.get('/',           protect, adminOnly, getDonations)

export default donationRouter
