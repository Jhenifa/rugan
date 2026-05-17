import LegalPageTemplate from "@/components/common/LegalPageTemplate";

const SECTIONS = [
  {
    title: "Use of the Website",
    body: "The RUGAN website is provided to share information about our mission, programmes, impact, partnerships, volunteer opportunities, and ways to support our work. By using this website, you agree to use it lawfully, respectfully, and in a way that does not interfere with the rights, safety, or experience of other visitors or with the functioning of the site itself.",
  },
  {
    title: "Content and Materials",
    body: "Unless otherwise stated, the text, images, branding, and other materials on this website belong to RUGAN or are used with permission for our communications and programme storytelling. You may view, share, or reference the content for personal, educational, or non-commercial purposes, but you may not reproduce, alter, misrepresent, or use it in a way that suggests endorsement by RUGAN without prior written permission.",
  },
  {
    title: "Forms, Applications, and Submissions",
    body: "When you submit a message, inquiry, application, newsletter signup, or other form through this website, you are responsible for ensuring that the information you provide is accurate and appropriate. Submission of a form does not automatically create a partnership, volunteer placement, programme slot, or other formal relationship with RUGAN; it allows our team to review your information and respond where appropriate.",
  },
  {
    title: "Donations and Third-Party Services",
    body: "RUGAN may provide opportunities to donate or engage through third-party tools, payment platforms, embedded media, or linked services. Where those tools are used, additional terms or privacy practices from those providers may also apply. RUGAN is committed to using its platforms responsibly, but we encourage users to review the relevant third-party terms when interacting with external services.",
  },
  {
    title: "Changes and Contact",
    body: "We may update these Terms of Service from time to time to reflect changes to our website, operations, programmes, or legal obligations. Your continued use of the site after updates are posted means you accept the revised terms. We encourage visitors, supporters, volunteers, and partners to review this page periodically so they remain informed about the standards that guide use of the website.",
  },
];

export default function TermsPage() {
  return (
    <LegalPageTemplate
      title="Terms of Service"
      path="/terms"
      subtitle="The terms that govern access to and use of the RUGAN website and its forms."
      updatedAt="Last updated: April 24, 2026"
      intro="These Terms of Service apply to your use of the RUGAN website. They are designed to support a respectful, trustworthy, and mission-aligned online space for everyone who learns about, supports, and engages with our work."
      sections={SECTIONS}
      contactTitle="Questions About These Terms?"
      contactText="If you need clarification about these Terms of Service, please contact"
    />
  );
}
