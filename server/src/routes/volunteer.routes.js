import { Router }                                              from 'express'
import { submitApplication, getApplications, updateStatus }  from '../controllers/volunteer.controller.js'
import { protect, adminOnly }                                from '../middleware/auth.js'

const router = Router()

router.post('/apply',              submitApplication)
router.get('/',                    protect, adminOnly, getApplications)
router.patch('/:id/status',        protect, adminOnly, updateStatus)

export default router
