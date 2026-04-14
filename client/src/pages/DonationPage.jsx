import { motion } from "framer-motion";
import { fadeUp, staggerContainer, scaleIn, viewportOnce } from "@/lib/motion";
import { Heart, Building2, GraduationCap, Users, Clock } from "lucide-react";
import DonationForm from "@/components/forms/DonationForm";
import SectionHeader from "@/components/ui/SectionHeader";

/* ── Why Donate Cards ── */
const WHY_DONATE = [
  {
    icon: Building2,
    title: "School Outreaches",
    description:
      "Funding empowerment sessions and tours in rural secondary schools.",
  },
  {
    icon: Heart,
    title: "Menstrual Hygiene",
    description:
      "Providing sanitary pads and hygiene resources to keep girls in school.",
  },
  {
    icon: GraduationCap,
    title: "Scholarships",
    description:
      "Supporting educational costs and vocational training for promising students.",
  },
  {
    icon: Users,
    title: "Mentorship",
    description:
      "Connecting girls with role models and guidance for their future.",
  },
];

/* ── Why Donate Card ── */
function WhyCard({ icon: Icon, title, description }) {
  return (
    <div
      style={{
        background: "#F0FDF4",
        borderRadius: "0.875rem",
        border: "1px solid #4F7B4433",
        padding: "1.75rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "0.625rem",
      }}
    >
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "0.75rem",
          background: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.25rem",
        }}
      >
        <Icon size={20} color="white" />
      </div>
      <p
        style={{
          fontSize: "0.9375rem",
          fontWeight: 700,
          color: "var(--color-primary)",
        }}
      >
        {title}
      </p>
      <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}

/* ── Page ── */
export default function DonationPage() {
  return (
    <>
      {/* Hero — primary green, heart icon, centered */}
      <section
        style={{
          background: "linear-gradient(to bottom, #4F7B44, #3a5f32)",
          padding: "3.5rem 0",
          textAlign: "center",
        }}
      >
        <motion.div
          className="container-rugan"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "0.875rem",
              background: "rgba(255,255,255,0.18)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}
          >
            <Heart size={24} color="white" fill="white" />
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "white",
              marginBottom: "0.75rem",
              lineHeight: 1.15,
            }}
          >
            Make a Difference Today
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "36rem",
              margin: "0 auto",
            }}
          >
            Your donation directly empowers girls and transforms communities.
            Every contribution counts.
          </p>
        </motion.div>
      </section>

      {/* Why Donate */}
      <section className="section-padding">
        <div className="container-rugan">
          <SectionHeader
            title="Why Donate?"
            subtitle="Your contribution directly enables:"
          />
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.25rem",
            }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {WHY_DONATE.map((item, i) => (
              <motion.div key={i} variants={scaleIn}>
                <WhyCard {...item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="section-padding-sm" style={{ background: "#FAFAFA" }}>
        <div className="container-rugan">
          <DonationForm />
        </div>
      </section>

      {/* Bank Transfer Details */}
      <section
        id="bank-transfer-details"
        className="section-padding"
        style={{ background: "#F0FDF4" }}
      >
        <div className="container-rugan" style={{ maxWidth: "848px" }}>
          <div
            style={{
              background: "#E1EDDE",
              border: "1px solid #F3E8FF",
              borderRadius: "1rem",
              padding: "2rem",
            }}
          >
            {/* Header — centered */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                marginBottom: "1.5rem",
              }}
            >
              <Building2 size={20} style={{ color: "var(--color-primary)" }} />
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Bank Transfer Details
              </h3>
            </div>

            {/* Bank Name + Account Name */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "0.625rem",
                  padding: "0.875rem 1rem",
                  border: "1px solid #E5E7EB",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#9CA3AF",
                    marginBottom: "0.25rem",
                  }}
                >
                  Bank Name
                </p>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  First Bank of Nigeria
                </p>
              </div>
              <div
                style={{
                  background: "white",
                  borderRadius: "0.625rem",
                  padding: "0.875rem 1rem",
                  border: "1px solid #E5E7EB",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#9CA3AF",
                    marginBottom: "0.25rem",
                  }}
                >
                  Account Name
                </p>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  RUGAN NGO
                </p>
              </div>
            </div>

            {/* Account Number */}
            <div
              style={{
                background: "white",
                borderRadius: "0.625rem",
                padding: "0.875rem 1rem",
                border: "1px solid #E5E7EB",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#9CA3AF",
                  marginBottom: "0.25rem",
                }}
              >
                Account Number
              </p>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "0.05em",
                }}
              >
                2281542767
              </p>
            </div>

            {/* Proof of payment */}
            <div
              style={{
                background: "white",
                borderRadius: "0.625rem",
                padding: "0.875rem 1rem",
                border: "1px solid #E5E7EB",
              }}
            >
              <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                Please send proof of payment to{" "}
                <a
                  href="mailto:rugan.ng@gmail.com"
                  style={{ color: "var(--color-primary)", fontWeight: 500 }}
                >
                  rugan.ng@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
