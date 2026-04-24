import PageHeroBanner from "../components/common/PageHeroBanner";
import Button from "../components/ui/Button";
import { Link } from "react-router";
import ProgramCard from "../components/common/ProgramCard";
import CTABanner from "../components/common/CTABanner";
import ChecklistItem from "../components/common/ChecklistItem";
import AnimatedCount from "../components/common/AnimatedCount";
import {
  Target,
  TrendingUp,
  Users,
  MapPin,
  Heart,
  Award,
} from "lucide-react";
import SectionHeader from "../components/ui/SectionHeader";

export default function HomePage() {
  const programs = [
    {
      title: "RUGAN IDGC School Tours (International Day of the Girl Child)",
      description:
        "Empowerment sessions in rural secondary schools to build confidence, leadership skills, self-belief and personal development.",
      image: "/images/programs/card-1.jpg",
      to: "/programmes/rugan-idgc-school-tours",
    },
    {
      title: "RUGAN Healthy Period Project",
      description:
        "Provides accurate menstrual and body health education, reduces stigma and distribute sanitary pads and essential resources.",
      image: "/images/programs/card-2.jpg",
      to: "/programmes/rugan-healthy-period-project",
    },
    {
      title: "Excellence Awards",
      description:
        "Recognizes and rewards outstanding academic performance among rural secondary school girls to motivate excellence.",
      image: "/images/programs/card-3.jpg",
      to: "/programmes/excellence-award-project",
    },
    {
      title: "The RISE Project",
      description:
        "Provide SS3 girls with accurate information and guidance on life after secondary school, including educational vocational and career pathways.",
      image: "/images/programs/card-4.jpg",
      to: "/programmes/the-rise-project",
    },
    {
      title: "Rural-to-Global Programme",
      description:
        "Highlights real-life stories of women who rose from rural backgrounds, while proving mentorship, skill training, and exposure pathways.",
      image: "/images/programs/card-5.jpg",
      to: "/programmes/rural-to-global-programme",
    },
  ];

  const Impact = [
    { title: "4,750+", description: "Girls Reached", icon: Users },
    { title: "20+", description: "Communities Served", icon: MapPin },
    { title: "70+", description: "Active Volunteers", icon: Heart },
    { title: "20+", description: "Programmes Delivered", icon: Award },
    { title: "10+", description: "States in Nigeria", icon: Target },
  ];

  const challenges = [
    "Limited access to quality education",
    "Gender inequality and early marriage pressure",
    "Lack of mentorship and role models",
    "Inadequate menstrual health resources",
    "Restricted economic opportunities",
  ];

  const Mission = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "RUGAN exists to break down the barriers facing rural girl-children and women by providing access to quality education, life skills, mentorship, and practical resources that empower them to become self-reliant, confident, and impactful leaders.",
    },
    {
      icon: TrendingUp,
      title: "Our Vission",
      description:
        "A world where every rural girl has equal access to opportunities, can realize her full potential, and grows into a global leader who shapes her community and the world with confidence and purpose.",
    },
  ];

  function IconFeatureCard({
    title,
    description,
    icon: Icon,
    variant = "outlined",
  }) {
    const isFilled = variant === "filled";

    return (
      <div
        className={`flex min-h-[240px] flex-col gap-4 rounded-[20px] p-6 sm:min-h-[260px] sm:gap-5 sm:p-8 ${
          isFilled
            ? "bg-[#4F7B44] shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
            : "bg-white border border-[#E5E7EB] shadow-[0_4px_10px_rgba(0,0,0,0.05)]"
        }`}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            isFilled ? "bg-white/20" : "bg-[#4F7B44]"
          }`}
        >
          <Icon size={24} className="text-white" />
        </div>

        <h3
          className={`text-[22px] font-bold ${
            isFilled ? "text-white" : "text-[#111]"
          }`}
        >
          {title}
        </h3>

        <p
          className={`text-base leading-7 ${
            isFilled ? "text-[#E5E7EB]" : "text-[#6B7280]"
          }`}
        >
          {description}
        </p>
      </div>
    );
  }

  function StatCard({ icon: Icon, title, description }) {
    return (
      <div className="rounded-[20px] bg-[#F9FAFB] px-5 py-7 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#E6F0EA] flex items-center justify-center">
          <Icon size={26} className="text-[#4F7B44]" />
        </div>

        <AnimatedCount
          as="h2"
          value={title}
          className="text-[32px] font-bold text-[#4F7B44]"
        />

        <p className="text-[15px] text-[#6B7280]">{description}</p>
      </div>
    );
  }

  return (
    <div>
      {/* HERO */}
      <PageHeroBanner
        title={
          <span className="block max-w-[700px] text-[clamp(2.25rem,11vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:leading-[1.08] sm:tracking-[-0.04em]">
            Empowering Rural Girls <br />
            to Become Tomorrow's <br />
            Leaders
          </span>
        }
        subtitle={
          <span className="block max-w-[42rem] pb-2 pt-4 text-[clamp(1rem,4vw,1.25rem)] font-normal leading-[1.65] tracking-[-0.02em] text-white sm:py-5 sm:leading-[1.7]">
            Breaking down barriers facing rural girl-children through quality education, life skills, mentorship, and practical resources.
          </span>
        }
        backgroundImage="/images/homepage/Hero.jpg"
        className="min-h-[560px] md:min-h-[620px] lg:min-h-[658px]"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            as={Link}
            to="/donate"
            variant="primary"
            size="lg"
            className="w-full sm:min-w-[200px] sm:w-auto"
          >
            Make a Donation
          </Button>

          <Button
            as={Link}
            to="/volunteers"
            variant="volunteer"
            size="lg"
            className="w-full sm:min-w-[200px] sm:w-auto"
          >
            Volunteer with Us
          </Button>
        </div>
      </PageHeroBanner>

      {/* CHALLENGES */}
      <section className="section-padding bg-white">
        <div className="container-rugan flex flex-col items-center justify-between gap-6 sm:gap-8 lg:flex-row lg:gap-10">
          <div className="w-full max-w-[520px] shrink-0">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-[#E5E5E5] shadow-lg">
              <img
                src="/images/homepage/rural-girls-with-card.png"
                alt="Girls education and teaching"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="w-full max-w-[560px]">
            <h1 className="mb-4 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-[#111827]">
              Breaking Down Barriers to Education
            </h1>

            <p className="mb-8 text-[#555] leading-7">
              Rural girl-children face persistant barriers to education,
              accurate information, mentorship, and economic empowerment.
              Poverty, gender inequality, early marriage, and limited community
              support restrict their opportunities and prevent them from
              building independent, impactful futures.
            </p>

            <div className="flex flex-col gap-3.5">
              {challenges.map((challenge, i) => (
                <ChecklistItem
                  key={i}
                  text={challenge}
                  variant="plain"
                  iconColor="#FFFFFF"
                  iconFill="none"
                  iconWrapperBg="#E07856"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="section-padding">
        <div className="container-rugan">
          <SectionHeader
            title="Targeted School-Based Programmes"
            subtitle="RUGAN delivers comprehensive programs that support rural girls at different stages of their life journey, equipping them with knowledge, confidence, and practical support."
            className="mx-auto max-w-2xl"
          />

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-6">
            {programs.slice(0, 3).map((program) => (
              <div key={program.title} className="lg:col-span-2">
                <ProgramCard {...program} variant="overlay" />
              </div>
            ))}

            {programs.slice(3, 5).map((program) => (
              <div key={program.title} className="lg:col-span-3">
                <ProgramCard {...program} variant="overlay" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section-padding bg-white">
        <div className="container-rugan">
          <SectionHeader
            title="Our Impact Across Nigeria"
            subtitle="Serving rural and underserved communities with targeted programs that create lasting grassroots impact"
          />

          <div className="lg:hidden">
            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:gap-6">
              {Impact.slice(0, 4).map((impact, i) => (
                <StatCard key={i} {...impact} />
              ))}
            </div>

            <div className="mx-auto mt-4 w-full max-w-[280px] sm:mt-6">
              <StatCard {...Impact[4]} />
            </div>
          </div>

          <div className="mx-auto hidden max-w-6xl gap-6 lg:grid lg:grid-cols-5">
            {Impact.map((impact, i) => (
              <StatCard key={i} {...impact} />
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="section-padding bg-gray-50">
        <div className="container-rugan grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Mission.map((item, i) => (
            <IconFeatureCard
              key={i}
              {...item}
              variant={i === 1 ? "filled" : "outlined"}
            />
          ))}
        </div>
      </section>

      {/* ACROSS NIGERIA */}
      <section className="section-padding bg-white">
        <div className="container-rugan flex flex-col items-center justify-between gap-6 sm:gap-8 lg:flex-row lg:gap-10">
          <div className="w-full max-w-[560px]">
            <h1 className="mb-4 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight text-[#111827]">
              Serving Rural Nigeria
            </h1>

            <p className="mb-8 text-[#555] leading-7">
              RUGAN currently serves rural and underserved communities, with a
              focus on rural areas in Nigeria, working directly with
              girl-children, women, families, and community stakeholders to
              create lasting grassroots impact.
            </p>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F4EA]">
                  <MapPin size={20} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    <AnimatedCount value="10+" className="inline-block" />{" "}
                    States Reached
                  </h3>
                  <p className="text-sm text-[#777]">Across rural Nigeria</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F4EA]">
                  <Users size={20} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    <AnimatedCount value="20+" className="inline-block" />{" "}
                    Communities
                  </h3>
                  <p className="text-sm text-[#777]">
                    Direct grassroots engagement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[520px] shrink-0">
            <div className="h-[260px] w-full overflow-hidden rounded-2xl border border-[#E5E5E5] shadow-lg sm:h-[320px] lg:h-[430px]">
              <img
                src="/images/homepage/group-of-girls.jpg"
                alt="Girls education and teaching"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Join Us in Empowering Rural Girls"
        subtitle="Your support helps us to reach more girls, deliver more programs, and create lasting change in rural communities across Nigeria."
        buttons={[
          {
            label: "Volunteer With Us",
            to: "/volunteers",
            variant: "volunteer",
          },
          {
            label: "Make a Donation",
            to: "/donate",
            variant: "primary",
          },
        ]}
      />
    </div>
  );
}
