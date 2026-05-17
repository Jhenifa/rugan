export const VOLUNTEER_WHO = [
  { label: "Students and Young Professionals" },
  { label: "Educators for Outreaches" },
  { label: "Community Advocates" },
  { label: "Committed Individuals" },
];

export const VOLUNTEER_STORIES = [
  {
    label: "Stories of Impact from RUGAN Volunteers",
    videoUrl: "https://www.youtube.com/embed/ZPWM55hwx6o",
  },
];

export const VOLUNTEER_PHOTOS = Array.from({ length: 12 }, (_, index) => ({
  src: `/images/volunteers/vol-${index + 1}.jpg`,
  alt: `RUGAN volunteer ${index + 1}`,
}));

export const VOLUNTEER_OPPORTUNITIES = [
  {
    title: "Programme Manager Volunteer",
    commitment: "Flexible (Project-based)",
    location: "On-site (Nigeria)",
    description: "Supports implementation of school outreaches and workshops.",
    responsibilities: [
      "Coordinate outreach logistics",
      "Supervise field activities",
      "Report on programme outcomes",
    ],
  },
  {
    title: "Community Outreach Volunteer",
    commitment: "5-10 hours/month",
    location: "On-site or Hybrid",
    description:
      "Assists with mobilization and coordination in local communities.",
    responsibilities: [
      "Mobilize community members",
      "Support event setup",
      "Engage with participants",
    ],
  },
  {
    title: "Content and Media Volunteer",
    commitment: "Flexible",
    location: "Remote",
    description:
      "Supports documentation and storytelling for RUGAN's digital platforms.",
    responsibilities: [
      "Create social media content",
      "Document events with photos and videos",
      "Write blog posts",
    ],
  },
];

export const VOLUNTEER_BENEFITS = [
  "Make a meaningful difference in girls' lives",
  "Gain leadership and mentoring experience",
  "Connect with like-minded changemakers",
  "Access training and development programmes",
  "Receive a RUGAN volunteering certificate",
  "Work with flexible scheduling options",
];

export const VOLUNTEER_EXPECTATIONS = [
  "Commitment to RUGAN's mission and values",
  "Regular attendance and punctuality",
  "Professional conduct at all times",
  "Respect for confidentiality",
  "Completion of required training",
  "Openness to feedback and continuous learning",
];

export const VOLUNTEER_FAQS = [
  {
    question: "Do I need prior experience to volunteer?",
    answer:
      "No, prior experience is not mandatory. RUGAN welcomes individuals who are passionate about advancing the rural girl child. Some roles benefit from prior experience, but commitment, willingness to learn, and alignment with the mission matter most.",
  },
  {
    question: "How much time do I need to commit?",
    answer:
      "Most roles require a minimum commitment of three to five hours per week, depending on the project or department. Event-based or campaign-specific roles can be more flexible and short-term.",
  },
  {
    question: "Can I volunteer remotely?",
    answer:
      "Yes. RUGAN offers both remote and on-site volunteer opportunities. Remote roles include social media management, content writing, graphic design, research and data support, fundraising, and partnership outreach.",
  },
  {
    question: "What is the application process?",
    answer:
      "Complete the volunteer application form, wait for the team to review submissions, and, where needed, attend a short virtual interview. Selected volunteers then go through onboarding and orientation before receiving role assignments and project briefings.",
  },
  {
    question: "Are there age requirements for volunteers?",
    answer:
      "Yes. Volunteers must generally be at least 18 years old. Individuals under 18 may participate in selected programmes or community initiatives with parental or guardian consent.",
  },
];

