import { Link } from 'react-router'
import { Facebook, Twitter, Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'About Us',   to: '/about' },
  { label: 'Our Impact', to: '/impact' },
  { label: 'Our Team',   to: '/team' },
  { label: 'Blog',       to: '/blog' },
]

const PROGRAMS = [
  { label: 'RUGAN IDGC School Tours',      to: '/programs/idgc' },
  { label: 'RUGAN Healthy Period Project', to: '/programs/healthy-period' },
  { label: 'The RISE Project',             to: '/programs/rise' },
  { label: 'Excellence Award Project',     to: '/programs/excellence-award' },
  { label: 'Rural to Global Programme',   to: '/programs/rural-to-global' },
]

const SOCIALS = [
  { icon: Facebook,  href: '#', label: 'Facebook' },
  { icon: Twitter,   href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin,  href: '#', label: 'LinkedIn' },
]

const mutedWhite = { color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }

export default function Footer() {
  return (
    <footer className="section-footer">
      <div className="container-rugan py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="RUGAN"
                className="h-8 w-auto"
                style={{ filter: 'brightness(0) saturate(100%) invert(55%) sepia(40%) saturate(500%) hue-rotate(80deg) brightness(90%)' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <span className="font-bold text-lg tracking-tight text-white">RUGAN</span>
            </Link>
            <p style={{ ...mutedWhite, lineHeight: '1.65' }}>
              Empowering girl-children through education, mentorship,
              and advocacy to build a more equitable future for all.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} style={mutedWhite} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Programs
            </h4>
            <ul className="flex flex-col gap-2.5">
              {PROGRAMS.map((p) => (
                <li key={p.to}>
                  <Link to={p.to} style={mutedWhite} className="hover:text-white transition-colors">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-3 mb-6">
              <li>
                <a
                  href="mailto:rugan.ng@gmail.com"
                  style={mutedWhite}
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Mail size={15} style={{ flexShrink: 0 }} />
                  <span>rugan.ng@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2348143158700"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={mutedWhite}
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <MessageCircle size={15} style={{ flexShrink: 0 }} />
                  <span>+234 814 315 8700</span>
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: '2.25rem', height: '2.25rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    transition: 'background 200ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div
          className="container-rugan py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}
        >
          <p>© {new Date().getFullYear()} RUGAN. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
