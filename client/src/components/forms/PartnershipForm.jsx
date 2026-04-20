import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import api from '@/lib/api'

const schema = z.object({
  orgName:     z.string().min(2, 'Organization name is required'),
  email:       z.string().email('Valid email is required'),
  phone:       z.string().min(10, 'Valid phone number required'),
  partnership: z.string().min(1, 'Please select a partnership type'),
  message:     z.string().min(20, 'Please describe your interests (min 20 chars)'),
})

const PARTNERSHIP_TYPES = [
  'Strategic Impact Partnership',
  'Program-Based Partnership',
  'Financial Sponsorship Partnership',
  'Technical and Knowledge Partnership',
  'Community Outreach Partnership',
  'Media and communications Partnership',
  'Volunteer Engagement Partnership',
  'Corporate Social Responsibility',
]

export default function PartnershipForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await api.post('/partnerships/inquiry', data)
      toast.success("Inquiry submitted! We'll be in touch soon.")
      reset()
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 bg-white rounded-2xl p-8 shadow-card" noValidate>
      {/* Org name */}
      <div>
        <label className="form-label">Organization Name / Name of Individual</label>
        <input {...register('orgName')} className="form-input" placeholder="Your organization name / Name of Individual" />
        {errors.orgName && <p className="form-error">{errors.orgName.message}</p>}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Email</label>
          <input {...register('email')} type="email" className="form-input" placeholder="your.email@example.com" />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="form-label">Phone</label>
          <input {...register('phone')} type="tel" className="form-input" placeholder="+234 800 000-0000" />
          {errors.phone && <p className="form-error">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Partnership type */}
      <div>
        <label className="form-label">Partnership</label>
        <select {...register('partnership')} className="form-input" defaultValue="">
          <option value="" disabled>Partnership</option>
          {PARTNERSHIP_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.partnership && <p className="form-error">{errors.partnership.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="form-label">Message</label>
        <textarea
          {...register('message')}
          rows={4}
          className="form-input resize-none"
          placeholder="Tell us about your organization and partnership interests"
        />
        {errors.message && <p className="form-error">{errors.message.message}</p>}
      </div>

      <Button type="submit" variant="green" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </Button>
    </form>
  )
}
