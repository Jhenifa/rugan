import { useState } from 'react'
import { CreditCard, Building2, AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000]
const PAYMENT_METHODS = [
  { id: 'card',     label: 'Debit/Credit Card',  sub: 'Visa, Mastercard, Verve', icon: CreditCard },
  { id: 'transfer', label: 'Bank Transfer',       sub: 'Direct bank transfer',    icon: Building2 },
]

export default function DonationForm() {
  const [frequency,      setFrequency]      = useState('one-time')
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount,   setCustomAmount]   = useState('')
  const [paymentMethod,  setPaymentMethod]  = useState(null)

  const isCustom    = selectedAmount === 'custom'
  const finalAmount = isCustom ? customAmount : selectedAmount
  const canProceed  = finalAmount && paymentMethod

  const handleSubmit = () => {
    if (!canProceed) return
    alert(`Processing ₦${Number(finalAmount).toLocaleString()} via ${paymentMethod}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8 max-w-xl mx-auto">
      <h2 className="text-heading-lg font-bold text-neutral-900 text-center mb-6">Complete Your Donation</h2>

      {/* Frequency toggle */}
      <div className="mb-6">
        <p className="form-label">Donation Frequency</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'one-time', label: 'One-Time',  sub: 'Make a single donation' },
            { id: 'monthly',  label: 'Monthly',   sub: 'Recurring monthly donation' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFrequency(opt.id)}
              className={cn(
                'p-4 rounded-xl border-2 text-left transition-all duration-200',
                frequency === opt.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              )}
            >
              <p className="font-semibold text-neutral-900 text-body-sm">{opt.label}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Amount selector */}
      <div className="mb-6">
        <p className="form-label">Donation Amount (₦)</p>
        <div className="grid grid-cols-3 gap-3">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={cn(
                'py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200',
                selectedAmount === amount
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 text-neutral-700 hover:border-primary-300'
              )}
            >
              ₦{amount.toLocaleString()}
            </button>
          ))}
          {/* Custom */}
          <button
            onClick={() => setSelectedAmount('custom')}
            className={cn(
              'py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200',
              isCustom
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-neutral-200 text-neutral-700 hover:border-primary-300'
            )}
          >
            Custom
          </button>
        </div>

        {/* Custom input */}
        {isCustom && (
          <div className="mt-3">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="form-input"
              placeholder="Enter amount in ₦"
              min={100}
            />
          </div>
        )}
      </div>

      {/* Payment method */}
      <div className="mb-6">
        <p className="form-label">Payment Method</p>
        <div className="flex flex-col gap-3">
          {PAYMENT_METHODS.map(({ id, label, sub, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPaymentMethod(id)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200',
                paymentMethod === id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              )}
            >
              <div className="icon-box-sm">
                <Icon size={16} />
              </div>
              <div>
                <p className="font-semibold text-neutral-900 text-body-sm">{label}</p>
                <p className="text-xs text-neutral-400">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!canProceed ? (
        <div className="flex items-center gap-2 justify-center py-3 px-4 rounded-xl bg-neutral-100 text-neutral-400 text-sm">
          <AlertTriangle size={16} />
          Select an amount to continue
        </div>
      ) : (
        <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
          Donate ₦{Number(finalAmount).toLocaleString()}
        </Button>
      )}
    </div>
  )
}
