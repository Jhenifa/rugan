import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Linkedin, Mail } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const TEAM = [
  {
    name: "Fidel Bethel Nnadi",
    role: "Founder and Executive Director",
    bio: "Licensed social worker, researcher, and youth development practitioner committed to advancing opportunities for young people especially girls in rural communities. She holds a first-class degree in Social Work and postgraduate training in Social Work Practice with Children and Youth. Her work integrates research and practice to address structural inequalities affecting young people.",
    image: "/images/team/fidel.jpg",
    linkedin: "https://www.linkedin.com/in/fidelnnadi",
    email: "fidellnnadi@gmail.com",
  },
  {
    name: "Cynthia Chimarame Ugwu",
    role: "Co-founder and Chief Operating Officer",
    bio: "Product manager and operations strategist with years of experience in the technology sector. She brings a systems-driven approach to leadership, combining strategic execution, operational excellence, and stakeholder management to drive sustainable organizational growth. She leads strategy implementation, partnerships, and internal operations.",
    image: "/images/team/cynthia.jpg",
    linkedin: "https://www.linkedin.com/in/cynthia-ugwu-472754201",
    email: "cynthiaugwuu@gmail.com",
  },
  {
    name: "Juliet Chigoziem Azegba",
    role: "Programme Manager",
    bio: "Social worker and advocate for children, girls, and women. She holds a bachelor's degree in social work and is currently undergoing postgraduate training in Family Social Work at the University of Nigeria, Nsukka. She has extensive experience coordinating programmes, leading sensitization campaigns and community awareness sessions to support girls and their families.",
    image: "/images/team/juliet.jpg",
    linkedin: null,
    email: null,
  },
  {
    name: "Ogbu Kaosisochukwu Nkemdilim ESQ (AIMC)",
    role: "Secretary, Board of Trustee & Legal Adviser",
    bio: "Legal practitioner with eight years' experience in Civil and Criminal litigation, Election Petition, Corporate Practice, Real Estate, Arbitration, Family Law and Regulatory Compliance. Called to Nigerian Bar in 2019, she holds an LL.B from the University of Nigeria Nsukka and is an Associate of Institute of Chartered Mediators and Conciliators (ICMC). Currently serves as head of Chambers at Y. N. Akirikwen, SAN & Associate.",
    image: "/images/team/ogbu.jpg",
    linkedin: null,
    email: null,
  },
  {
    name: "Onyekachi Edwina Nnadi-Onoja",
    role: "Board Member",
    bio: "Dedicated teacher and educator, holding a first-class degree from the University of Nigeria, Nsukka (UNN). With extensive experience in girls' education and advocacy, she is a strong champion for initiatives that empower young girls, promote access to quality education, and address social inequalities. Her expertise provides strategic insight and guidance to RUGAN.",
    image: "/images/team/onyekachi.jpg",
    linkedin: null,
    email: null,
  },
];

function SocialLink({ href, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: "2.125rem",
        height: "2.125rem",
        borderRadius: "0.5rem",
        border: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6B7280",
        transition: "border-color 200ms, color 200ms",
        background: "transparent",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-primary)";
        e.currentTarget.style.color = "var(--color-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E5E7EB";
        e.currentTarget.style.color = "#6B7280";
      }}
    >
      <Icon size={15} />
    </button>
  );
}

function MemberCard({ name, role, bio, image, linkedin, email }) {
  const [copied, setCopied] = useState(false);
  const hasSocials = linkedin || email;

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    let success = false;
    try {
      success = document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }

    document.body.removeChild(textarea);
    return success;
  };

  const handleCopyEmail = () => {
    console.log("Copy email clicked:", email);
    if (!email) return;

    const copyPromise = navigator.clipboard
      ? navigator.clipboard.writeText(email)
      : Promise.resolve(fallbackCopy(email));

    copyPromise
      .then((result) => {
        const success = typeof result === "boolean" ? result : true;
        if (success) {
          console.log("Email copied to clipboard:", email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          console.error("Clipboard copy returned false");
        }
      })
      .catch((err) => {
        console.error("Clipboard write failed:", err);
        fallbackCopy(email) && setCopied(true);
      });
  };

  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "1rem",
        overflow: "hidden",
        background: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ aspectRatio: "4/3", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
      </div>
      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "0.2rem",
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "#5B8A8C",
            marginBottom: "0.75rem",
          }}
        >
          {role}
        </p>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "#6B7280",
            lineHeight: 1.65,
            flex: 1,
          }}
        >
          {bio}
        </p>
        {hasSocials && (
          <div
            style={{
              display: "flex",
              gap: "0.625rem",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #F3F4F6",
              position: "relative",
            }}
          >
            {linkedin && (
              <SocialLink
                href={linkedin}
                icon={Linkedin}
                label={`${name} LinkedIn`}
                onClick={() => window.open(linkedin, "_blank", "noopener")}
              />
            )}
            {email && (
              <div style={{ position: "relative" }}>
                <SocialLink
                  href={email}
                  icon={Mail}
                  label={`Copy email for ${name}`}
                  onClick={handleCopyEmail}
                />
                {copied && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-2rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#111827",
                      color: "#fff",
                      fontSize: "0.75rem",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "0.375rem",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      zIndex: 10,
                    }}
                  >
                    Email copied
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamPage() {
  const row1 = TEAM.slice(0, 2);
  const row2 = TEAM.slice(2);

  return (
    <>
      <section
        style={{
          background: "var(--color-primary)",
          padding: "4rem 0",
          textAlign: "center",
        }}
      >
        <div className="container-rugan">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "white",
              marginBottom: "0.75rem",
            }}
          >
            Meet Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "40rem",
              margin: "0 auto",
            }}
          >
            Passionate individuals dedicated to empowering girls and
            transforming communities
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-rugan">
          <SectionHeader
            title="Leadership Team"
            subtitle="Guiding our vision and strategy with passion and expertise"
          />

          {/* Row 1 — 2 cards centred */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            style={{ maxWidth: "860px", margin: "0 auto 1.5rem" }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {row1.map((m) => (
              <motion.div
                key={m.name}
                variants={fadeUp}
                style={{ height: "100%" }}
              >
                <MemberCard {...m} />
              </motion.div>
            ))}
          </motion.div>

          {/* Row 2 — 3 cards full width */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {row2.map((m) => (
              <motion.div
                key={m.name}
                variants={fadeUp}
                style={{ height: "100%" }}
              >
                <MemberCard {...m} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
