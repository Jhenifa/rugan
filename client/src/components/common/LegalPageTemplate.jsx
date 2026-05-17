import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import PageHeroBanner from "@/components/common/PageHeroBanner";
import SEO from "@/components/SEO";

export default function LegalPageTemplate({
  title,
  subtitle,
  updatedAt,
  intro,
  sections,
  path,
  contactTitle = "Questions?",
  contactText,
}) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: title, path: path || "/" },
  ];

  return (
    <>
      <SEO
        title={title}
        description={intro}
        path={path}
        pageType="WebPage"
        breadcrumbs={breadcrumbs}
      />
      <PageHeroBanner
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        centerText
      />

      <section className="section-padding" style={{ background: "#FAFAFA" }}>
        <div className="container-rugan">
          <motion.div
            className="mx-auto flex max-w-[860px] flex-col gap-5 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7"
            >
              <span className="badge badge-green">{updatedAt}</span>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "0.9375rem",
                  color: "#4B5563",
                  lineHeight: 1.75,
                }}
              >
                {intro}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {sections.map((section) => (
                <motion.div
                  key={section.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-7"
                >
                  <h2
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {section.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "#4B5563",
                      lineHeight: 1.75,
                    }}
                  >
                    {section.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[#D8E6D4] bg-[#F0FDF4] p-5 sm:p-7"
            >
              <div className="flex items-start gap-3">
                <div className="icon-box-sm">
                  <Mail size={16} />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {contactTitle}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "#4B5563",
                      lineHeight: 1.7,
                    }}
                  >
                    {contactText}{" "}
                    <a
                      href="mailto:info@rugan.org"
                      style={{ color: "var(--color-primary)", fontWeight: 600 }}
                    >
                      info@rugan.org
                    </a>
                    .
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
