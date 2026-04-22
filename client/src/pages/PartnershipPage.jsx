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
          "Long-term commitment (6–12 months minimum)",
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

  function PartnershipItems({ title, description, icon: Icon, details }) {
    const [open, setOpen] = useState(false);

    return (
      <div className="border border-[#E5E7EB] rounded-[12px] bg-white overflow-hidden">
        <div
          className={`bg-[#FAFAFA] px-[30px] py-[20px] ${
            !open ? "hover:bg-[#EAF4EE]" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center bg-transparent border-0 cursor-pointer text-left p-0"
          >
            <div className="flex gap-[12px] items-start">
              <div className="bg-[#4F7B441A] p-[10px] rounded-[8px]">
                <Icon size={24} color="#4F7B44" />
              </div>

              <div>
                <h3 className="m-0 font-semibold">{title}</h3>
                <p className="m-0 text-[14px] text-[#6B7280]">
                  {description}
                </p>
              </div>
            </div>

            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {open && (
          <div className="p-[30px]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-[16px]">
                <div className="flex gap-2 items-center"> 
                  <span className="text-[#4F7B44]">•</span> 
                  <h2 className="mb-[8px]">What they contribute</h2>
                </div>
                {details.contribute.map((item, i) => (
                  <p key={i} className="my-[4px] text-[14px] px-5">
                    {item}
                  </p>
                ))}
              </div>

              <div className="p-[16px]">
                <div className="flex gap-2"> 
                  <span className="text-red-500">•</span> 
                  <h2 className="mb-[8px]">What RUGAN expects</h2>
                </div>
                {details.expects.map((item, i) => (
                  <p key={i} className="my-[4px] text-[14px] px-5">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-[20px] p-[16px] bg-[#EAF4EE] rounded-[10px]">
              <div className="flex gap-2"> 
                <span className="text-[#4F7B44]">•</span> 
                <h2 className="mb-[8px]">What they receive</h2> 
              </div>
              {details.receive.map((item, i) => (
                <p key={i} className="my-[4px] text-[14px] px-5">
                  {item}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

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
          padding: "3.5rem 0",
          textAlign: "center",
        }}
      >
        <motion.div
          className="container-rugan"
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
          <h1 className="text-white font-bold text-[clamp(2rem,4vw,2.75rem)]">
            Make a Difference Today
          </h1>
          <p className="text-[1rem] text-[rgba(255,255,255,0.82)] max-w-[36rem] mx-auto">
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
            subtitle="Explore our structured partnership opportunities and find the perfect wat to collaborate with RUGAN"
          />

          <div className="flex flex-col gap-8">
            {partnerships.map((item, i) => (
              <PartnershipItems key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* OUR PARTNERS */} 
      <section className="section-padding" style={{ background: "var(--color-teal)" }} > 
        <div className="container-rugan"> 
          <div style={{ textAlign: "center"}}> 
            <h1 
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "white", }} 
            > 
              Our Partners 
            </h1> 
            <p 
              style={{ marginTop: "0.5rem", color: "rgba(255,255,255,0.8)", fontSize: "1rem", }} 
            > 
              Trusted organization making a difference with us. 
            </p> 
            <div 
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "32px", marginTop: "32px", justifyItems: "center", alignItems: "center", }} 
            > 
              {partners.slice(0, 3).map((partners, i ) => ( 
                <PartnerLogo key={i} {...partners} variant="overlay" /> 
              ))} 
            </div> 
          </div> 
        </div> 
      </section>

      {/* FORM */}
      <section className="section-padding bg-[#F0FDF4]">
        <div className="container-rugan" style={{ maxWidth: "720px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <SectionHeader
                title="Let's Collaborate"
                subtitle="Get in touch to discuss partnership opportunities."              
              />
          </div>
          <div>
              <PartnershipForm />
          </div>
        </div>
      </section>
    </>
  );
}
