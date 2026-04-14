import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import api from '@/lib/api'

const schema = z.object({
  firstName:    z.string().min(2, 'First name is required'),
  lastName:     z.string().min(2, 'Last name is required'),
  email:        z.string().email('Valid email address required'),
  whatsapp:     z.string().min(10, 'Valid WhatsApp number required'),
  skills:       z.string().min(3, 'Please describe your skills'),
  availability: z.string().min(1, 'Please select your availability'),
  motivation:   z.string().min(20, 'Please tell us why you want to volunteer (min 20 chars)'),
})

const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Remote', 'Flexible']

export default function VolunteerForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await api.post('/volunteers/apply', data)
      toast.success("Application submitted! We'll be in touch soon.")
      reset()
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} noValidate>

      {/* First Name + Last Name */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="form-label">First Name</label>
          <input {...register('firstName')} className="form-input" placeholder="Your first name" />
          {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="form-label">Last Name</label>
          <input {...register('lastName')} className="form-input" placeholder="Your last name" />
          {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Email + WhatsApp */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="form-label">Email Address</label>
          <input {...register('email')} type="email" className="form-input" placeholder="your@email.com" />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="form-label">WhatsApp Number</label>
          <input {...register('whatsapp')} type="tel" className="form-input" placeholder="+234 800 000 0000" />
          {errors.whatsapp && <p className="form-error">{errors.whatsapp.message}</p>}
        </div>
      </div>

      {/* Skills — 2-row textarea */}
      <div>
        <label className="form-label">Skills &amp; Experience</label>
        <textarea
          {...register('skills')}
          rows={2}
          className="form-input"
          style={{ resize: 'none' }}
          placeholder="e.g. Teaching, Social work, Photography..."
        />
        {errors.skills && <p className="form-error">{errors.skills.message}</p>}
      </div>

      {/* Availability */}
      <div>
        <label className="form-label">Availability</label>
        <select {...register('availability')} className="form-input">
          <option value="">Select availability</option>
          {AVAILABILITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errors.availability && <p className="form-error">{errors.availability.message}</p>}
      </div>

      {/* Motivation */}
      <div>
        <label className="form-label">Why do you want to volunteer with RUGAN?</label>
        <textarea
          {...register('motivation')}
          rows={4}
          className="form-input"
          style={{ resize: 'none' }}
          placeholder="Tell us about your motivation..."
        />
        {errors.motivation && <p className="form-error">{errors.motivation.message}</p>}
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  )
}
