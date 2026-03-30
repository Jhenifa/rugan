import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * ChecklistItem
 * Used on: Program detail pages (Key Activities), Volunteer page (Benefits/Expectations)
 *
 * Props:
 *   text    — the checklist item text
 *   variant — 'card' (bordered box) | 'plain' (inline with icon)
 */
export default function ChecklistItem({ text, variant = 'card', className }) {
  if (variant === 'plain') {
    return (
      <li className={cn('flex items-start gap-2.5 text-body-sm text-neutral-700', className)}>
        <CheckCircle2 size={18} className="text-primary-500 mt-0.5 shrink-0" />
        <span>{text}</span>
      </li>
    )
  }

  // Card variant — bordered box
  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border border-neutral-200 bg-white', className)}>
      <CheckCircle2 size={18} className="text-primary-500 mt-0.5 shrink-0" />
      <span className="text-body-sm text-neutral-700">{text}</span>
    </div>
  )
}
