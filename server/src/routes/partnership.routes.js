import { Router }                                        from 'express'
import { submitInquiry, getInquiries, updateStatus }    from '../controllers/partnership.controller.js'
import { protect, adminOnly }                           from '../middleware/auth.js'

const router = Router()

router.post('/inquiry',        submitInquiry)
router.get('/',                protect, adminOnly, getInquiries)
router.patch('/:id/status',    protect, adminOnly, updateStatus)

export default router
