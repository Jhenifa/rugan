import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { preloadBlogResources } from '@/lib/blogCache'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  {
    label: 'About',
    to: '/about',
    children: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Team', to: '/team' },
    ],
  },
  { label: 'Programmes', to: '/programmes' },
  { label: 'Impact', to: '/impact' },
  { label: 'Volunteers', to: '/volunteers' },
  { label: 'Partnership', to: '/partnership' },
  { label: 'Blog', to: '/blog' },
]

const base = 'block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200'
const idle = 'text-gray-700'
const hover = 'hover:bg-[#F0FDF4] hover:text-[#4F7B44]'
const active = 'bg-[#F0FDF4] text-[#4F7B44]'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const { pathname } = useLocation()
  const closeTimer = useRef(null)

  useEffect(() => {
    setIsOpen(false)
    setDropdownOpen(null)
  }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const openDropdown = (label) => {
    clearTimeout(closeTimer.current)
    setDropdownOpen(label)
  }

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(null), 120)
  }

  const closeMenu = () => setIsOpen(false)

  const handleNavIntent = (to) => {
    if (to === '/blog') {
      preloadBlogResources()
    }
  }

  const isLinkActive = (link) => {
    if (link.to === '/') {
      return pathname === '/'
    }

    const childPaths = link.children?.map((child) => child.to) ?? []

    return (
      pathname === link.to ||
      pathname.startsWith(link.to + '/') ||
      childPaths.some((childPath) => pathname === childPath || pathname.startsWith(childPath + '/'))
    )
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm',
      )}
    >
      <nav className="container-rugan flex h-16 items-center justify-between lg:h-[4.5rem]">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img
              src="/icons/rugan-logo.jpg"
              alt="RUGAN"
              style={{ height: '2rem', width: 'auto', borderRadius: '4px' }}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
              RUGAN
            </span>
          </Link>
        </motion.div>

        <motion.ul
          className="hidden items-center gap-0.5 lg:flex"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {NAV_LINKS.map((link) => {
            if (link.children) {
              const childPaths = link.children.map((child) => child.to)
              const parentActive = childPaths.some((path) => pathname === path || pathname.startsWith(path + '/'))

              return (
                <li key={link.label} className="relative">
                  <button
                    onMouseEnter={() => openDropdown(link.label)}
                    onMouseLeave={closeDropdown}
                    className={cn(base, 'flex items-center gap-1', parentActive ? active : cn(idle, hover))}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={cn(
                        'transition-transform duration-200',
                        dropdownOpen === link.label && 'rotate-180',
                      )}
                    />
                  </button>

                  {dropdownOpen === link.label && (
                    <div
                      className="absolute left-0 top-full min-w-[160px] rounded-xl bg-white py-2"
                      style={{
                        boxShadow: 'var(--shadow-card-hover)',
                        border: '1px solid #F3F4F6',
                        marginTop: '2px',
                      }}
                      onMouseEnter={() => openDropdown(link.label)}
                      onMouseLeave={closeDropdown}
                    >
                      {link.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          end
                          className={({ isActive: childIsActive }) =>
                            cn(
                              'block px-4 py-2 text-sm transition-colors duration-200',
                              childIsActive
                                ? 'bg-[#F0FDF4] font-medium text-[#4F7B44]'
                                : 'text-gray-700 hover:bg-[#F0FDF4] hover:text-[#4F7B44]',
                            )
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </li>
              )
            }

            return (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onMouseEnter={() => handleNavIntent(link.to)}
                  onFocus={() => handleNavIntent(link.to)}
                  className={({ isActive: linkIsActive }) => cn(base, linkIsActive ? active : cn(idle, hover))}
                >
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </motion.ul>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hidden lg:block">
            <Button
              as={Link}
              to="/donate"
              variant="primary"
              size="md"
            >
              Make a Donation
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 lg:hidden',
              isOpen
                ? 'border-[#D8E6D4] bg-[#F0FDF4] text-[#4F7B44] shadow-[0_10px_24px_rgba(79,123,68,0.15)]'
                : 'border-[#E5E7EB] bg-white text-gray-600 hover:border-[#D8E6D4] hover:bg-[#F9FAFB]',
            )}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-x-0 bottom-0 top-16 z-40 bg-[#101828]/40 backdrop-blur-[3px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={closeMenu}
              aria-label="Close mobile menu"
            />

            <motion.div
              className="fixed inset-x-3 bottom-3 top-[4.5rem] z-40 overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(16,24,40,0.22)] lg:hidden"
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-full flex-col overflow-hidden bg-[linear-gradient(to_bottom,#F8FBF8_0%,#FFFFFF_42%,#FAFAFA_100%)]">
                <motion.ul
                  className="flex-1 overflow-y-auto px-4 pb-4 pt-4"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                  }}
                >
                  {NAV_LINKS.map((link, index) => {
                    const linkActive = isLinkActive(link)

                    return (
                      <motion.li
                        key={link.label}
                        className="mb-3 last:mb-0"
                        variants={{
                          hidden: { opacity: 0, y: 12 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <div
                          className={cn(
                            'rounded-[22px] border p-2.5 transition-all duration-300',
                            linkActive
                              ? 'border-[#D8E6D4] bg-white shadow-[0_14px_30px_rgba(79,123,68,0.12)]'
                              : 'border-[#E7ECE9] bg-white/72 backdrop-blur-sm',
                          )}
                        >
                          <NavLink
                            to={link.to}
                            end={link.to === '/'}
                            onClick={closeMenu}
                            onMouseEnter={() => handleNavIntent(link.to)}
                            onFocus={() => handleNavIntent(link.to)}
                            className="group block rounded-[18px] p-2.5"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[0.75rem] font-bold',
                                    linkActive
                                      ? 'bg-[#4F7B44] text-white'
                                      : 'bg-[#E8F2E6] text-[#4F7B44]',
                                  )}
                                >
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="block text-[1rem] font-semibold text-[#111827]">
                                  {link.label}
                                </span>
                              </div>
                              <ArrowRight
                                size={16}
                                className={cn(
                                  'shrink-0 transition-transform duration-300',
                                  linkActive ? 'text-[#4F7B44]' : 'text-[#98A2B3]',
                                  'group-hover:translate-x-1',
                                )}
                              />
                            </div>
                          </NavLink>

                          {link.children && (
                            <div className="mt-1 flex flex-wrap gap-2 pl-[3.9rem]">
                              {link.children.map((child) => {
                                const childActive =
                                  pathname === child.to || pathname.startsWith(child.to + '/')

                                return (
                                  <NavLink
                                    key={child.to}
                                    to={child.to}
                                    end
                                    onClick={closeMenu}
                                    className={cn(
                                      'inline-flex items-center rounded-full border px-3 py-2 text-[0.75rem] font-medium transition-colors duration-200',
                                      childActive
                                        ? 'border-[#4F7B44] bg-[#F0FDF4] text-[#4F7B44]'
                                        : 'border-[#E5E7EB] bg-white text-[#667085] hover:border-[#D8E6D4] hover:text-[#4F7B44]',
                                    )}
                                  >
                                    {child.label}
                                  </NavLink>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </motion.li>
                    )
                  })}
                </motion.ul>

                <div className="border-t border-[#E9EEEA] bg-white/92 px-4 pb-4 pt-3 backdrop-blur-sm">
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      as={Link}
                      to="/donate"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={closeMenu}
                    >
                      Make a Donation
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
