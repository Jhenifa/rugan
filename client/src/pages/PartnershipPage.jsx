import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  DollarSign,
  BookOpen,
  Users2,
  Heart,
  Building2,
  Lightbulb,
  Megaphone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import PartnershipForm from "../components/forms/PartnershipForm";
import PartnerLogo from "../components/common/PartnerLogo";
import SectionHeader from "../components/ui/SectionHeader";

function DetailGroup({
  title,
  items,
  dotColor,
  background = "#FAFAFA",
  className = "",
}) {
  return (
    <div
      className={className}
      style={{ background, borderRadius: "1rem", padding: "1.25rem" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.875rem",
        }}
      >
        <span style={{ color: dotColor, fontSize: "1rem", lineHeight: 1 }}>
          <span
            style={{
              display: "block",
              width: "0.375rem",
              height: "0.375rem",
              borderRadius: "9999px",
              background: dotColor,
            }}
          />
        </span>
        <h2
          style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}
        >
          {title}
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginLeft: "0.875rem",
        }}
      >
        {items.map((item, i) => (
          <p
            key={i}
            style={{ fontSize: "0.875rem", color: "#4B5563", lineHeight: 1.65 }}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function PartnershipItems({ title, description, icon: Icon, details }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-card">
      <div
        className={`px-6 py-5 md:px-7 ${
          !open ? "bg-[#FAFAFA] hover:bg-[#EAF4EE]" : "bg-white"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full cursor-pointer items-start justify-between gap-4 border-0 bg-transparent p-0 text-left"
        >
          <div className="grid min-w-0 flex-1 grid-cols-[auto,1fr] gap-x-4 gap-y-2 sm:gap-y-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F7B441A]">
              <Icon size={22} color="#4F7B44" />
            </div>

            <h3 className="m-0 self-center pr-2 text-[1rem] font-semibold leading-6 text-[#111827]">
              {title}
            </h3>
            <p className="col-span-2 text-[14px] leading-6 text-[#6B7280] sm:col-start-2 sm:col-end-3 sm:mt-2">
              {description}
            </p>
          </div>

          <span className="mt-1 shrink-0 text-[#6B7280]">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </button>
      </div>

      {open && (
        <div className="px-6 pb-6 pt-1 md:px-7 md:pb-7">
          <div className="grid gap-5 md:grid-cols-2">
            <DetailGroup
              title="What they contribute"
              items={details.contribute}
              dotColor="#4F7B44"
            />
            <DetailGroup
              title="What RUGAN expects"
              items={details.expects}
              dotColor="#D6670F"
            />
          </div>

          <DetailGroup
            title="What they receive"
            items={details.receive}
            dotColor="#4F7B44"
            background="#EAF4EE"
            className="mt-5"
          />
        </div>
      )}
    </div>
  );
}

export default function PartnershipPage() {
  const partners = [
    {
      logo: "/images/partners/Ellipse 1.png",
      name: "Regent Club of Social Work",
    },
    {
      logo: "/images/partners/Ellipse 2.png",
      name: "Social Solutions Research Group",
    },
    {
      logo: "/images/partners/Ellipse 3.png",
      name: "Grandstand Imagery",
    },
  ];

  const partnerships = [
    {
      title: "Strategic Impact Partnership",
      description:
        "A long-term, high-level collaboration with organizations committed to advancing rural girls' development across multiple initiative",
      icon: Target,
      details: {
        contribute: [
          "Sustained funding or multi-program support",
          "Co-design of education, health or empowerment program",
          "Access to networks, tools, or infrastructure",
        ],
        expects: [
          "Long-term commitment (6-12 months minimum)",
          "Active participation in planning",
          "Strong alignment with mission",
        ],
        receive: [
          "Prominent visibility across all major initiative",
          "Comprehensive  impact reports",
          "Recognition as key contributor to RUGAN's growth and impact",
        ],
      },
    },

    {
      title: "Program-Based Partnership",
      description:
        "A collaboration focused on a specific initiative such as school outreaches, menstrual hygiene campaigns, or skill-building workshops.",
      icon: BookOpen,
      details: {
        contribute: [
          "Funding materials, or logistics for a defined program",
          "Facilitators or volunteers",
          "Technical or operational support",
        ],
        expects: [
          "Clear deliverables tied to the program",
          "Defined timeline and execution plan",
          "Active collaboration during implementation",
        ],
        receive: [
          "Visibility within the specific program",
          "Recognition in reports and communication materials",
          "Direct connection to a targeted group of beneficiaries",
        ],
      },
    },

    {
      title: "Financial Sponsorship Partnership",
      description:
        "A partnership centered on finanicial contributions to support programs or operational needs.",
      icon: DollarSign,
      details: {
        contribute: [
          "Direct funding",
          "Grants or sponsorship support",
          "Recurring financial contributions where applicable",
        ],
        expects: [
          "Clarity on funding purpose",
          "Timely disbursement for planned activities",
        ],
        receive: [
          "Transparent financial and impact reporting",
          "Acknowledgement across RUGAN plaforms",
          "Updates on how their funding drives impact",
        ],
      },
    },

    {
      title: "Technical and Knowledge  Partnership",
      description:
        "A collaboration with individuals or organizations that provide expertise, training, or educational resources to empower rural girls.",
      icon: Lightbulb,
      details: {
        contribute: [
          "Training sessions (digital skills, career guidance, health education)",
          "Mentorship programs",
          "Learning materials or tools",
        ],
        expects: [
          "Structured and relevant knowledge delivery",
          "Content adapted to rural realities",
          "Consistency where long-term engagement is agreed",
        ],
        receive: [
          "Visibility as subject matter experts",
          "Opportunity to influence and shape young girls' futures",
          "Recognition across RUGAN's platforms",
        ],
      },
    },

    {
      title: "Community Outreach Partnership",
      description:
        "A partnership with grassroots stakeholders that enable acess to rural communities and supports local engagement.",
      icon: Users2,
      details: {
        contribute: [
          "Access to communities and participants",
          "Mobilization and awareness creation",
          "On-ground coordination",
        ],
        expects: [
          "Strong local engagement and participation",
          "Support with turnout and logistics",
          "Cultural alignment and cooperation",
        ],
        receive: [
          "Recognition as community change drivers",
          "Access to RUGAN programs and resourses",
          "Strengthened local impact",
        ],
      },
    },

    {
      title: "Media and Communications Partnership",
      description:
        "A partnership focused on amplifying RUGAN's work and sharing the stories of rural girls.",
      icon: Megaphone,
      details: {
        contribute: [
          "Media coverage (articles, interviews, features)",
          "Social media amplification",
          "Campaign storytelling",
        ],
        expects: [
          "Accurate and consistent messaging",
          "Agreed deliverables such as posts or features",
          "Alignment with RUGAN's voice and mission",
        ],
        receive: [
          "Access to impactful stories and content",
          "Increased audience engagement",
          "Association with meaningful social impact",
        ],
      },
    },

    {
      title: "Volunteer Engagement Partnership",
      description:
        "A structured collaboration with individuals or groups who contribute time and effort to support RUGAN's activities",
      icon: Heart,
      details: {
        contribute: [
          "Event and outreach support",
          "Mentorship and faacilitation",
          "Administrative or operational assistance",
        ],
        expects: [
          "Commitment and reliability",
          "Respect for beneficiaries and communities",
          "Alignment with organizational values",
        ],
        receive: [
          "Practical experience in social impact work",
          "Certificates and recognition",
          "Opportunities for personal and professional growth",
        ],
      },
    },

    {
      title: "Corporate Social Responsibility Partnership",
      description:
        "A formal collaboration with companies seeking to achieve their CSR objectives through girl-child empowerment initiatives.",
      icon: Building2,
      details: {
        contribute: [
          "Program funding",
          "Employee volunteer engagement",
          "Products such a sanitary kits or learning tools",
        ],
        expects: [
          "Commitment and reliability",
          "Respect for beneficiaries and communities",
          "Alignment with organizational values",
        ],
        receive: [
          "Practical experience in social impact work",
          "Certificates and recognition",
          "Opportunities for personal and professional growth",
        ],
      },
    },
  ];

  return (
    <>
      {/* HERO */}
      <section
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(79,123,68,0.8), rgba(58,95,50,0.8)),
            url("/images/partners/Partnership-Hero.jpg")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
        }}
      >
        <motion.div
          className="container-rugan py-12 sm:py-14 lg:py-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
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
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.15] text-white">
            Make a Difference Today
          </h1>
          <p className="mx-auto mt-3 max-w-[36rem] text-[1rem] text-[rgba(255,255,255,0.82)]">
            Your donation directly empowers girls and transforms communities.
            Every contribution counts.
          </p>
        </motion.div>
      </section>

      {/* PARTNERSHIP FRAMEWORK */}
      <section className="section-padding bg-white">
        <div className="container-rugan">
          <SectionHeader
            title="Partnership Framework"
            subtitle="Explore our structured partnership opportunities and find the perfect way to collaborate with RUGAN"
            className="mx-auto max-w-2xl"
          />

          <div className="mx-auto flex max-w-5xl flex-col gap-5">
            {partnerships.map((item, i) => (
              <PartnershipItems key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="section-padding bg-[#F0FDF4]">
        <div className="container-rugan">
          <div className="mx-auto max-w-[720px]">
            <SectionHeader
              title="Let's Collaborate"
              subtitle="Get in touch to discuss partnership opportunities."
              className="mx-auto max-w-xl"
            />

            <div>
              <PartnershipForm />
            </div>
          </div>
        </div>
      </section>
      
      {/* OUR PARTNERS */}
      <section
        className="section-padding"
        style={{ background: "var(--color-teal)" }}
      >
        <div className="container-rugan">
          <SectionHeader
            title="Our Partners"
            subtitle="Trusted organisations making a difference with us."
            theme="light"
            className="mx-auto max-w-2xl"
          />

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {partners.slice(0, 3).map((partner, i) => (
              <PartnerLogo key={i} {...partner} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
