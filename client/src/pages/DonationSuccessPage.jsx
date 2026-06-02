import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { CheckCircle, Heart, Award, Eye, Users, Mail } from "lucide-react";
import { Link } from "react-router";
import SEO from "@/components/SEO";

export default function DonationSuccessPage() {
  return (
    <>
      <SEO
        title="Donation Confirmed"
        description="Thank you for supporting RUGAN. Your contribution will help empower girls, provide menstrual health supplies, and strengthen rural communities."
        path="/donation/success"
        noindex
        nofollow
        pageType="WebPage"
      />
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(to bottom, #4F7B44, #3a5f32)",
          padding: "4rem 0",
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
              width: "4rem",
              height: "4rem",
              borderRadius: "1rem",
              background: "rgba(255,255,255,0.18)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}
          >
            <CheckCircle size={32} color="white" fill="white" />
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
            Thank You for Your Donation!
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "36rem",
              margin: "0 auto",
            }}
          >
            Your generous contribution will help empower girls and transform
            communities. We've sent a confirmation email to your inbox.
          </p>
        </motion.div>
      </section>

      {/* What happens next */}
      <section className="section-padding">
        <div
          className="container-rugan"
          style={{ maxWidth: "800px", textAlign: "center" }}
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              variants={fadeUp}
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "1rem",
              }}
            >
              What Happens Next?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: "1.125rem",
                color: "#6B7280",
                marginBottom: "2rem",
              }}
            >
              Your donation is being processed and will be put to immediate use
              in our programs.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginTop: "2rem",
              }}
            >
              {[
                {
                  icon: Award,
                  title: "Impact",
                  description:
                    "Your donation directly funds menstrual hygiene kits, scholarships, and mentorship programs.",
                  gradient: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
                  accentColor: "#1E40AF",
                },
                {
                  icon: Eye,
                  title: "Transparency",
                  description:
                    "We provide regular updates on how your contribution is making a difference.",
                  gradient: "linear-gradient(135deg, #92400E 0%, #D97706 100%)",
                  accentColor: "#92400E",
                },
                {
                  icon: Users,
                  title: "Community",
                  description: (
                    <>
                      <Link
                        to="/volunteers"
                        style={{
                          color: "white",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        Join
                      </Link>
                      {
                        " thousands of volunteers who are creating lasting change in Nigeria."
                      }
                    </>
                  ),
                  gradient: "linear-gradient(135deg, #9F1239 0%, #DC2626 100%)",
                  accentColor: "#9F1239",
                },
                {
                  icon: Mail,
                  title: "Stay Connected",
                  description: (
                    <>
                      <Link
                        to="/blog"
                        style={{
                          color: "white",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        Subscribe
                      </Link>
                      {
                        " to our newsletter for updates on programs, stories, and the impact of your donation."
                      }
                    </>
                  ),
                  gradient: "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)",
                  accentColor: "#0F766E",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  style={{
                    background: item.gradient,
                    borderRadius: "1.25rem",
                    padding: "2.5rem 1.5rem",
                    textAlign: "center",
                    border: "none",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: "transform 200ms, box-shadow 200ms",
                    cursor: "default",
                  }}
                  whileHover={{
                    transform: "translateY(-4px)",
                    boxShadow:
                      "0 25px 35px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <div
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "0.875rem",
                      background: "rgba(255,255,255,0.2)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <item.icon size={24} color="white" />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "white",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.9)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} style={{ marginTop: "3rem" }}>
              <Link
                to="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--color-primary)",
                  color: "white",
                  padding: "0.875rem 2rem",
                  borderRadius: "0.75rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "background 200ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#3a5f32";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-primary)";
                }}
              >
                Return Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
