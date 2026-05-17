import { ARTICLES } from "../pages/blog/articleData.js";
import { PROGRAMME_LIST, PROGRAMMES } from "../data/programmes.js";
import { TEAM_MEMBERS } from "../data/team.js";
import { VOLUNTEER_FAQS } from "../data/volunteer.js";

const STATIC_PAGE_ROUTES = [
  {
    path: "/",
    title: "Empowering Rural Girl-Children in Nigeria",
    description:
      "RUGAN empowers rural girl-children in Nigeria through education, mentorship, menstrual health support, and leadership development across underserved communities.",
    image: "/images/homepage/Hero.jpg",
    pageType: "AboutPage",
    shell: {
      intro:
        "RUGAN is a Nigerian nonprofit helping rural girls access education, mentorship, menstrual health support, and practical opportunities for long-term leadership and independence.",
      sections: [
        {
          heading: "Core focus areas",
          items: [
            "School-based empowerment programmes",
            "Menstrual health education and pad distribution",
            "Leadership and mentoring opportunities",
            "Rural-to-global exposure and skills development",
          ],
        },
        {
          heading: "Explore key pages",
          links: [
            { label: "About RUGAN", href: "/about" },
            { label: "Our Programmes", href: "/programmes" },
            { label: "Impact stories", href: "/impact" },
            { label: "Volunteer with RUGAN", href: "/volunteers" },
            { label: "Partner with RUGAN", href: "/partnership" },
            { label: "Donate to support girls", href: "/donate" },
          ],
        },
      ],
    },
  },
  {
    path: "/about",
    title: "About Us",
    description:
      "Learn about RUGAN's founding story, impact timeline, focus areas, and the principles guiding its work for rural girls in Nigeria.",
    image: "/images/about/founder.jpg",
    pageType: "AboutPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
    ],
    shell: {
      intro:
        "RUGAN was founded to remove structural barriers facing rural girls through quality education, dignity-centered health information, mentorship, and advocacy.",
      sections: [
        {
          heading: "What RUGAN does",
          items: [
            "Runs school empowerment tours and advocacy programmes",
            "Promotes menstrual health dignity and access",
            "Recognizes academic excellence",
            "Builds leadership and life-planning skills",
          ],
        },
        {
          heading: "Continue exploring",
          links: [
            { label: "Meet the RUGAN team", href: "/team" },
            { label: "Explore our programmes", href: "/programmes" },
            { label: "Read impact highlights", href: "/impact" },
          ],
        },
      ],
    },
  },
  {
    path: "/team",
    title: "Our Team",
    description:
      "Meet the RUGAN leadership and programme team driving rural girl-child empowerment through education, mentorship, and community transformation.",
    image: "/images/team/fidel.jpg",
    pageType: "AboutPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Our Team", path: "/team" },
    ],
    shell: {
      intro:
        "The RUGAN team brings together nonprofit leadership, programme management, advocacy, education, and operations expertise focused on advancing opportunities for rural girls.",
      sections: [
        {
          heading: "Leadership highlights",
          items: TEAM_MEMBERS.slice(0, 3).map(
            (member) => `${member.name} - ${member.role}`,
          ),
        },
      ],
    },
  },
  {
    path: "/programmes",
    title: "Our Programmes",
    description:
      "Explore RUGAN's education, menstrual health, mentorship, and leadership programmes designed to empower girls across underserved communities.",
    image: "/images/programs/programs-hero.jpg",
    pageType: "CollectionPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Programmes", path: "/programmes" },
    ],
    shell: {
      intro:
        "RUGAN's programmes are designed to meet girls at different stages of their educational and personal development journey, from school tours to life-transition support.",
      sections: [
        {
          heading: "Featured programmes",
          links: PROGRAMME_LIST.map((programme) => ({
            label: programme.cardTitle,
            href: `/programmes/${programme.slug}`,
          })),
        },
      ],
    },
  },
  {
    path: "/impact",
    title: "Our Impact",
    description:
      "See RUGAN's measurable reach across states, communities, programmes, volunteers, and the stories of girls transformed by its work.",
    image: "/images/impact/Impact-hero.jpg",
    pageType: "CollectionPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Impact", path: "/impact" },
    ],
    shell: {
      intro:
        "RUGAN tracks real-world outcomes across programme delivery, community reach, menstrual dignity interventions, and leadership pathways for girls.",
      sections: [
        {
          heading: "Impact at a glance",
          items: [
            "4,750+ girls reached",
            "20+ communities served",
            "20+ programmes delivered",
            "70+ active volunteers",
          ],
        },
      ],
    },
  },
  {
    path: "/volunteers",
    title: "Volunteer",
    description:
      "Volunteer with RUGAN and support girls through community outreach, school programmes, digital storytelling, mentorship, and operations.",
    image: "/images/volunteers/hero.jpg",
    pageType: "AboutPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Volunteer", path: "/volunteers" },
    ],
    faq: VOLUNTEER_FAQS,
    shell: {
      intro:
        "RUGAN volunteers support school outreaches, community engagement, field coordination, storytelling, and practical implementation that helps girls thrive.",
      sections: [
        {
          heading: "Why volunteer",
          items: [
            "Gain practical social impact experience",
            "Support girls in underserved communities",
            "Contribute remotely or on-site depending on role",
          ],
        },
      ],
    },
  },
  {
    path: "/partnership",
    title: "Partner With RUGAN",
    description:
      "Partner with RUGAN through CSR, programme funding, outreach collaboration, technical support, or media amplification to empower rural girls in Nigeria.",
    image: "/images/partners/Partnership-Hero.jpg",
    pageType: "AboutPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Partnership", path: "/partnership" },
    ],
    shell: {
      intro:
        "RUGAN works with companies, foundations, community stakeholders, experts, and media partners to expand education, dignity, and opportunity for girls.",
      sections: [
        {
          heading: "Partnership types",
          items: [
            "Strategic impact partnerships",
            "Programme-based partnerships",
            "Financial sponsorship partnerships",
            "Technical and knowledge partnerships",
            "Media and communications partnerships",
          ],
        },
      ],
    },
  },
  {
    path: "/blog",
    title: "Blog",
    description:
      "Read RUGAN insights, field updates, educational guidance, and stories about girls' education, menstrual health, advocacy, and leadership.",
    image: "/images/blog/hero.jpg",
    pageType: "CollectionPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ],
    shell: {
      intro:
        "The RUGAN blog covers menstrual health, period poverty, girls' education, programme stories, and practical advice that supports students, families, and partners.",
      sections: [
        {
          heading: "Recent articles",
          links: ARTICLES.map((article) => ({
            label: article.title,
            href: `/blog/${article.slug}`,
          })),
        },
      ],
    },
  },
  {
    path: "/donate",
    title: "Donate",
    description:
      "Donate to RUGAN to fund school outreaches, menstrual health education, sanitary supplies, mentorship, and educational support for rural girls in Nigeria.",
    image: "/images/homepage/Hero.jpg",
    pageType: "CheckoutPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Donate", path: "/donate" },
    ],
    shell: {
      intro:
        "Every donation to RUGAN helps fund school outreaches, pad distribution, mentorship, and the educational growth of girls in underserved communities.",
      sections: [
        {
          heading: "Your donation supports",
          items: [
            "School outreaches and advocacy sessions",
            "Menstrual hygiene support for girls",
            "Scholarships and learning support",
            "Mentorship and life-skills development",
          ],
        },
      ],
    },
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "Review how RUGAN collects, uses, stores, and protects information submitted through its website, forms, donations, and newsletter.",
    image: "/icons/favicon.jpg",
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy" },
    ],
  },
  {
    path: "/terms",
    title: "Terms of Service",
    description:
      "Read the terms governing access to and use of RUGAN's website, content, programmes, forms, and donation experiences.",
    image: "/icons/favicon.jpg",
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Terms of Service", path: "/terms" },
    ],
  },
];

export const PROGRAMME_ROUTE_ENTRIES = PROGRAMME_LIST.map((programme) => ({
  path: `/programmes/${programme.slug}`,
  title: programme.title,
  description: programme.overview,
  image: programme.heroImage,
  pageType: "WebPage",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Programmes", path: "/programmes" },
    { name: programme.cardTitle, path: `/programmes/${programme.slug}` },
  ],
  service: {
    name: programme.cardTitle,
    description: programme.overview,
    serviceType: "Girls empowerment programme",
    audience: "Girls in rural and underserved communities",
  },
  shell: {
    intro: programme.overview,
    sections: [
      {
        heading: "Key activities",
        items: programme.activities,
      },
    ],
  },
}));

export const ARTICLE_ROUTE_ENTRIES = ARTICLES.map((article) => ({
  path: `/blog/${article.slug}`,
  title: article.title,
  description: article.excerpt,
  image: article.image,
  pageType: "ArticlePage",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: article.title, path: `/blog/${article.slug}` },
  ],
  article: {
    authorName: article.author,
    publishedTime: article.date,
    section: "Blog",
    keywords: ["girls education", "menstrual health", "RUGAN"],
  },
  shell: {
    intro: article.excerpt,
    sections: [
      {
        heading: "Article overview",
        items: article.content
          .filter((block) => block.type === "heading")
          .slice(0, 4)
          .map((block) => block.text),
      },
    ],
  },
}));

export const STATIC_ROUTE_ENTRIES = [
  ...STATIC_PAGE_ROUTES,
  ...PROGRAMME_ROUTE_ENTRIES,
  ...ARTICLE_ROUTE_ENTRIES,
];

export function getStaticRouteEntry(pathname) {
  return STATIC_ROUTE_ENTRIES.find((entry) => entry.path === pathname) || null;
}

export function getProgrammeBySlug(slug) {
  return PROGRAMMES[slug] || null;
}
