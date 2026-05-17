import LegalPageTemplate from "@/components/common/LegalPageTemplate";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "When you engage with RUGAN through this website, we may collect the information you choose to share with us. This may include your name, email address, phone number, organisation details, donation information, application responses, and messages submitted through our volunteer, partnership, newsletter, or contact forms. We may also receive limited technical information such as browser type, device data, and general site usage information that helps us keep the website functional and improve the experience for visitors.",
  },
  {
    title: "How We Use Information",
    body: "We use information in ways that support our mission and the people who engage with our work. This includes responding to inquiries, reviewing volunteer and partnership applications, processing donations, sharing updates about programmes and opportunities, improving website performance, and protecting the integrity of our services. We use personal information with care and in ways that are consistent with RUGAN’s commitment to dignity, respect, and responsible stewardship.",
  },
  {
    title: "How Information May Be Shared",
    body: "RUGAN may share information only where it is reasonably necessary to operate this website, support programme delivery, process donations, communicate with you, or comply with legal obligations. In some cases, this may include trusted service providers who assist with website hosting, communications, forms, or payments. We do not share personal information casually, and we aim to handle all disclosures in a way that reflects the trust people place in our organization.",
  },
  {
    title: "Data Retention and Security",
    body: "We take reasonable administrative and technical steps to safeguard the information entrusted to us and to limit access to authorized persons. We also retain information only for as long as it is needed for legitimate operational, programme, communication, recordkeeping, or legal purposes. While no website or online system can guarantee absolute security, RUGAN is committed to handling personal information thoughtfully and responsibly.",
  },
  {
    title: "Your Choices",
    body: "You may contact RUGAN at any time to ask questions about your personal information, request an update to the information you have shared, or opt out of future communications such as newsletters or non-essential updates. If information has been submitted through a school, partner, or another authorized representative, we may ask for enough detail to verify the request before taking action.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageTemplate
      title="Privacy Policy"
      path="/privacy"
      subtitle="How RUGAN collects, uses, and protects information shared through our website and related forms."
      updatedAt="Last updated: April 24, 2026"
      intro="RUGAN respects the privacy and dignity of every person who visits our website, supports our work, or engages with our programmes. This Privacy Policy explains how we collect, use, store, and protect information shared through this website."
      sections={SECTIONS}
      contactTitle="Questions About Privacy?"
      contactText="If you have questions about how your information is handled, please contact"
    />
  );
}
