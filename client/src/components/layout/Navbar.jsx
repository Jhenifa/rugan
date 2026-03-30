import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, X, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { label: 'Home',        to: '/' },
  {
    label: 'About',
    to: '/about',
    children: [
      { label: 'About Us',  to: '/about' },
      { label: 'Our Team',  to: '/team' },
    ],
  },
  { label: 'Programs',    to: '/programs' },
  { label: 'Impact',      to: '/impact' },
  { label: 'Volunteers',  to: '/volunteers' },
  { label: 'Partnership', to: '/partnership' },
  { label: 'Blog',        to: '/blog' },
]

export default function Navbar() {
  const [isOpen, setIsOpen]         = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const { pathname }                = useLocation()

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); setDropdownOpen(null) }, [pathname])

  // Shrink navbar on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm'
      )}
    >
      <nav className="container-rugan flex items-center justify-between h-16 lg:h-18">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          {/* Replace src with actual logo asset */}
          <img src="/logo.png" alt="RUGAN" className="h-8 w-auto" onError={(e) => { e.target.style.display = 'none' }} />
          <span className="font-bold text-lg text-primary-700 tracking-tight">RUGAN</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) =>
            link.children ? (
              // Dropdown
              <li key={link.label} className="relative">
                <button
                  onMouseEnter={() => setDropdownOpen(link.label)}
                  onMouseLeave={() => setDropdownOpen(null)}
                  className="flex items-center gap-1 px-3 py-2 text-body-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                >
                  {link.label}
                  <ChevronDown size={14} className={cn('transition-transform', dropdownOpen === link.label && 'rotate-180')} />
                </button>

                {dropdownOpen === link.label && (
                  <div
                    className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-card-hover border border-neutral-100 py-2 min-w-[160px]"
                    onMouseEnter={() => setDropdownOpen(link.label)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          cn('block px-4 py-2 text-body-sm hover:bg-primary-50 hover:text-primary-600 transition-colors',
                            isActive ? 'text-primary-600 font-medium' : 'text-neutral-700')
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            ) : (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn('block px-3 py-2 text-body-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50')
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        {/* CTA + mobile hamburger */}
        <div className="flex items-center gap-3">
          <Button as={Link} to="/donate" variant="primary" size="sm" className="hidden sm:inline-flex">
            Make a Donation
          </Button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-white px-4 pb-6 pt-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn('block px-4 py-3 rounded-xl text-body-sm font-medium transition-colors',
                      isActive ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50')
                  }
                >
                  {link.label}
                </NavLink>
                {/* Mobile dropdown children */}
                {link.children?.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) =>
                      cn('block px-8 py-2.5 rounded-xl text-body-sm transition-colors',
                        isActive ? 'text-primary-600 font-medium' : 'text-neutral-500 hover:text-primary-600')
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </li>
            ))}
          </ul>
          <Button as={Link} to="/donate" variant="primary" className="w-full mt-4">
            Make a Donation
          </Button>
        </div>
      )}
    </header>
  )
}
