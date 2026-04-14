import { Link } from "react-router";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const QUICK_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Our Impact", to: "/impact" },
  { label: "Our Team", to: "/team" },
  { label: "Blog", to: "/blog" },
  { label: "FAQ", to: "/volunteers#faq" },
];

const PROGRAMS = [
  {
    label: "RUGAN IDGC School Tours",
    to: "/programmes/rugan-idgc-school-tours",
  },
  {
    label: "RUGAN Healthy Period Project",
    to: "/programmes/rugan-healthy-period-project",
  },
  { label: "The RISE Project", to: "/programmes/the-rise-project" },
  {
    label: "Excellence Award Project",
    to: "/programmes/excellence-award-project",
  },
  {
    label: "Rural to Global Programme",
    to: "/programmes/rural-to-global-programme",
  },
];

const SOCIALS = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/1E1x2wHhog/?mibextid=wwXIfr",
    label: "Facebook",
  },
  {
    icon: Twitter,
    href: "https://www.facebook.com/share/1E1x2wHhog/?mibextid=wwXIfr",
    label: "Twitter",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/theruralgirladvancementnetwork?igsh=dWw5cGtyZGhrOTd0",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/theruralgirlchildadvancementnetwork/",
    label: "LinkedIn",
  },
];

const mutedWhite = { color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" };
const contactIconStyle = { color: "var(--color-primary)", flexShrink: 0 };

/* ── WhatsApp SVG logo (official brand icon) ── */
function WhatsAppIcon({ size = 15 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      style={{ flexShrink: 0 }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="section-footer">
      <div className="container-rugan py-14 lg:py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img
                src="/icons/rugan-logo.jpg"
                alt="RUGAN"
                className="h-8 w-auto"
                style={{ borderRadius: "9px" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="font-bold text-lg tracking-tight text-white">
                RUGAN
              </span>
            </Link>
            <p style={{ ...mutedWhite, lineHeight: "1.65" }}>
              Empowering girl-children through education, mentorship, and
              advocacy to build a more equitable future for all.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={mutedWhite}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programmes */}
          <motion.div variants={fadeUp} className="md:col-span-3">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Programmes
            </h4>
            <ul className="flex flex-col gap-2.5">
              {PROGRAMS.map((p) => (
                <li key={p.to}>
                  <Link
                    to={p.to}
                    style={mutedWhite}
                    className="hover:text-white transition-colors"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div variants={fadeUp} className="md:col-span-3">
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
                  <Mail size={15} style={contactIconStyle} />
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
                  <span style={contactIconStyle}>
                    <WhatsAppIcon size={15} />
                  </span>
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
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "0.5rem",
                    background: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    transition: "background 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="container-rugan py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}
        >
          <p>© {new Date().getFullYear()} RUGAN. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
