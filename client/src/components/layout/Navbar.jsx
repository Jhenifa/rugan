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
      { label: 'About Us', to: '/about' },
      { label: 'Our Team', to: '/team' },
    ],
  },
  { label: 'Programs',    to: '/programs' },
  { label: 'Impact',      to: '/impact' },
  { label: 'Volunteers',  to: '/volunteers' },
  { label: 'Partnership', to: '/partnership' },
  { label: 'Blog',        to: '/blog' },
]

const navLinkBase = 'block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200'
const navLinkIdle = 'text-gray-700'
const navLinkHover = 'hover:bg-[#F0FDF4] hover:text-[#4F7B44]'
const navLinkActive = 'bg-[#F0FDF4] text-[#4F7B44]'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const { pathname } = useLocation()

  useEffect(() => { setIsOpen(false); setDropdownOpen(null) }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={cn('sticky top-0 z-50 w-full bg-white transition-shadow duration-300', scrolled ? 'shadow-md' : 'shadow-sm')}>
      <nav className="container-rugan flex items-center justify-between h-16 lg:h-[4.5rem]">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo.png"
            alt="RUGAN"
            className="h-8 w-auto"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--color-primary)' }}>
            RUGAN
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <li key={link.label} className="relative">
                <button
                  onMouseEnter={() => setDropdownOpen(link.label)}
                  onMouseLeave={() => setDropdownOpen(null)}
                  className={cn(navLinkBase, navLinkIdle, navLinkHover, 'flex items-center gap-1')}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform duration-200', dropdownOpen === link.label && 'rotate-180')}
                  />
                </button>

                {dropdownOpen === link.label && (
                  <div
                    className="absolute top-full left-0 mt-1 bg-white rounded-xl py-2 min-w-[160px]"
                    style={{ boxShadow: 'var(--shadow-card-hover)', border: '1px solid #F3F4F6' }}
                    onMouseEnter={() => setDropdownOpen(link.label)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          cn('block px-4 py-2 text-sm transition-colors duration-200',
                            isActive
                              ? 'text-[#4F7B44] font-medium bg-[#F0FDF4]'
                              : 'text-gray-700 hover:bg-[#F0FDF4] hover:text-[#4F7B44]')
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
                    cn(navLinkBase, isActive ? navLinkActive : cn(navLinkIdle, navLinkHover))
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <Button as={Link} to="/donate" variant="primary" size="sm" className="hidden sm:inline-flex">
            Make a Donation
          </Button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white px-4 pb-6 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
          <ul className="flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn('block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200',
                      isActive ? 'bg-[#F0FDF4] text-[#4F7B44]' : 'text-gray-700 hover:bg-[#F0FDF4] hover:text-[#4F7B44]')
                  }
                >
                  {link.label}
                </NavLink>
                {link.children?.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) =>
                      cn('block px-8 py-2.5 rounded-xl text-sm transition-colors duration-200',
                        isActive ? 'text-[#4F7B44] font-medium' : 'text-gray-500 hover:bg-[#F0FDF4] hover:text-[#4F7B44]')
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
