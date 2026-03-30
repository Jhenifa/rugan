import { cn } from '@/lib/cn'

/**
 * Button
 *
 * variant:
 *   'primary'       — orange, "Make a Donation"
 *   'green'         — solid green
 *   'volunteer'     — white bg + primary text, "Volunteer With Us"
 *   'outline-green' — transparent + green border
 *   'outline-white' — transparent + white border (on dark backgrounds)
 *
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  as: Tag = 'button',
  ...props
}) {
  const variants = {
    primary:         'btn-primary',
    green:           'btn-green',
    volunteer:       'btn-volunteer',
    'outline-green': 'btn-outline-green',
    'outline-white': 'btn-outline-white',
  }

  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }

  return (
    <Tag
      className={cn('btn', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
