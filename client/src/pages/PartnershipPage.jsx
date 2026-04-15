import PartnershipForm from "../components/forms/PartnershipForm";
import PartnerLogo from "../components/common/PartnerLogo";
import PageHeroBanner from "../components/common/PageHeroBanner";
import SectionHeader from "../components/ui/SectionHeader";
import { CheckCircle, Award, HandshakeIcon, Building2 } from "lucide-react";



export default function PartnershipPage() {
  const partners = [
    {
      logo: "JOY.PNG",
      name: "Regent Club of Social Work",
    },
    {
      logo: "JOY.PNG",
      name: "Social Solutions Research Group",
    },
    {
      logo: "JOY.PNG",
      name: "Grandstand Imagery",
    },
  ]
  const WhyPartner =[
    {
      title: "Proven Impact",
      description: "Partner with an organization that has reached 12,500+ girls and transformed 150+ communities.",
      icon: CheckCircle,
    },
    {
      title:"Brand Alignment",
      description: "Demonstrate your commitment to gender equality and social responsibility.",
      icon: Award,
    },
    {
      title: "Full Transparency",
      description: "Recieve detailed reports showing exactly how your investment creates change.",
      icon: HandshakeIcon,
    },
  ]

  const Opportunities = [
    {
      title:"Corporate Partnership",
      description:"Long-term strategic partnerships with corporation committed to social impact.",
      icon:Building2,
    },
    {
      title:"Program Sponsorship",
      description:"Support specific programs that aligns with your organization's value.",
      icon:HandshakeIcon,
    },
    {
      title:"In-Kind Donations",
      description:"Contribute products, service, or expertise to support our mission.",
      icon:Award,
    },
  ]

  function PartnershipCard({ title, description, icon: Icon }) {
  return (
    <div
      style={{
        borderRadius: "24px",
        padding: "24px",
        background: "#F9FAFB",
        border: "1px solid #C8CBD0",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Icon size={32} color="#4F7B44" />

      <h1
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          fontSize: "14px",
          color: "#4B5563",
          lineHeight: "1.5",
        }}
      >
        {description}
      </p>
    </div>
  );
}


  function Partner({ title, description, icon: Icon}) {
  return (
    <div
      style={{
        borderRadius: "1rem",
        padding: "1.5rem 1.25rem",
        background: "#F9FAFB",
        border: "1px solid #C8CBD0",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "1rem",
        textAlign: "left",

        flex: 1,
        minWidth: "280px",
        maxWidth: "360px",
      }}
    >

      <div
        style={{
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "25%",
          background: "#4F7B44",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        
        <Icon size={22} color="white" />
      </div>
      <h1 style={{ fontSize: "18px", fontWeight: 700, }}>
        {title}
      </h1>
      <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "gray" }}>
        {description}
      </p>
    </div>
  );
}


  return (
    <>
        {/* HERO SECTION */}
    <PageHeroBanner
      title="Partner with Us"
      subtitle="Join forces with RUGAN to create lasting changes and empower the next generation of girl leaders."
      backgroundImage="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200&auto=format&fit=crop"
    />
          {/* WHY PARTNER */}
    <section className="section-padding" style={{ background: "#F9FAFB" }}>
      <div className="container-rugan">
        <SectionHeader
          title="Why partner with RUGAN"
          subtitle="Partnering with RUGAN means investing in education, gender equity, and sustainable community development. Our grassroots reach and proven results makes us a credible partner for social impact."
        />
        <div
          style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          width: "100%",
          }}
        >
          {WhyPartner.map((item, i) => (
            <Partner key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
              {/* OPPORTUNITIES */}
    <section className="section-padding" style={{ background: "#F9FAFB" }}>
      <div className="container-rugan">
          <SectionHeader
            title="Partnership Opportunities"
            subtitle="Multiple ways to collaborate and create impact."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {Opportunities.map((item, i) => (
              <PartnershipCard key={i} {...item} />
            ))}
          </div>
      </div>
    </section>
            {/* OUR PARTNERS */}
      <section className="section-padding"
        style={{ background: "var(--color-teal)" }}
      >
        <div className="container-rugan">
          <div style={{ textAlign: "center"}}>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "white",
              }}
            >
              Our Partners
            </h1>
            <p style={{
                marginTop: "0.5rem",
                color: "rgba(255,255,255,0.8)",
                fontSize: "1rem",
              }}
            >
              Trusted organization making a difference with us.
            </p>
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "32px",
                marginTop: "32px",
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              {partners.slice(0, 3).map((partners, i ) => (
                <PartnerLogo key={i} {...partners} variant="overlay" />
              ))}
            </div>
          </div>
        </div>
      </section>
              {/* CALL FOR COLLABORATION */}
      <section
        className="section-padding"
        style={{ background: "#E1EDDE" }}
      >
        <div className="container-rugan" style={{ maxWidth: "720px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "black",
              }}
            >
              Let's Collaborate
            </h2>
            <p
              style={{
                marginTop: "0.5rem",
                color: "gray",
                fontSize: "1rem",
              }}
            >
              Get in touch to discuss partnership opportunities.
            </p>
          </div>
          <div>
            <PartnershipForm />
          </div>
        </div>
        </section>
    </>
  )
}
