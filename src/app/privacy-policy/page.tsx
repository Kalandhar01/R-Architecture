import type { Metadata } from "next";
import Link from "next/link";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | Ractysh Design Private Limited",
  description:
    "Privacy Policy for Ractysh Design Private Limited. Learn how we collect, use and protect your personal information.",
  openGraph: {
    title: "Privacy Policy | Ractysh Design Private Limited",
    description:
      "Privacy Policy for Ractysh Design Private Limited. Learn how we collect, use and protect your personal information.",
  },
};

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content:
      "Ractysh Design Private Limited ('Ractysh Architecture', 'we', 'us', 'our') is committed to protecting the privacy of individuals who visit our website, use our services, or interact with our studio. This Privacy Policy explains how we collect, use, disclose and safeguard your personal information when you visit our website or engage with our architecture and design consultancy services.",
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content:
      "We may collect personal information that you voluntarily provide to us when you express interest in our services, submit a consultation request, subscribe to our newsletter, or otherwise contact us. This may include your full name, email address, telephone number, postal address, project requirements, budget range, property location, and any other details you choose to share with us about your project. We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, device information, and browsing behaviour through cookies and similar technologies.",
  },
  {
    id: "how-we-use-information",
    title: "3. How We Use Information",
    content:
      "We use the information we collect to respond to your inquiries, provide architectural and design consultation services, process project requests, send administrative information, deliver marketing communications (with your consent where required), improve our website and services, comply with legal obligations, and protect our rights and interests. We process your information on the basis of legitimate business interests, contractual necessity, or your consent, as applicable.",
  },
  {
    id: "consultation-requests",
    title: "4. Consultation Requests",
    content:
      "When you submit a consultation request through our website, we collect the information necessary to evaluate your project brief and respond with a considered proposal. This information is reviewed by our senior architectural team and stored securely in our project management system. We retain consultation request data for the duration of the project relationship and for a reasonable period thereafter for archival and reference purposes.",
  },
  {
    id: "newsletter-subscriptions",
    title: "5. Newsletter Subscriptions",
    content:
      "When you subscribe to our newsletter (Studio Notes), we collect your email address and, optionally, your name. We use this information to send you architecture updates, project stories, and design intelligence from the studio. You may unsubscribe at any time using the link provided in each email communication. We use Resend as our email service provider, and your data is processed in accordance with their privacy commitments.",
  },
  {
    id: "career-applications",
    title: "6. Career Applications",
    content:
      "If you submit a career application or portfolio to the studio, we collect your personal information, professional background, work samples, and any other details you provide. This information is used solely for the purpose of evaluating your application and is retained for the duration of the recruitment process and, with your consent, for future opportunities.",
  },
  {
    id: "data-protection",
    title: "7. Data Protection",
    content:
      "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These measures include secure servers, encrypted data transmission, access controls, and regular security assessments. While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
  },
  {
    id: "cookies-policy",
    title: "8. Cookies Policy",
    content:
      "Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyse site traffic, and understand where our visitors come from. Cookies are small text files stored on your device by your web browser. We use essential cookies for website functionality, analytics cookies to understand how visitors interact with our site, and preference cookies to remember your settings. You can control cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of our website.",
  },
  {
    id: "third-party-services",
    title: "9. Third Party Services",
    content:
      "We engage trusted third-party service providers to support our operations, including website hosting (Vercel), email delivery (Resend), database management (MongoDB), and analytics. These providers are contractually obligated to handle your data in accordance with applicable privacy laws and are prohibited from using your personal information for any purpose other than providing services to us. We do not sell your personal information to third parties.",
  },
  {
    id: "contact-information",
    title: "10. Contact Information",
    content:
      "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
    contact: true,
  },
  {
    id: "updates-to-this-policy",
    title: "11. Updates To This Policy",
    content:
      "We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or operational needs. The updated policy will be posted on this page with the effective date noted at the top. We encourage you to review this policy periodically to stay informed about how we are protecting your information.",
  },
];

const certifications = [
  "Registered Design Consultancy",
  "Professional Architecture Services",
  "Industry Best Practices",
  "Data Privacy Compliant",
  "Secure Consultation Process",
];

export default function PrivacyPolicyPage() {
  return (
    <div className="architecture-site min-h-screen bg-white text-nearblack">
      <ArchitectureNav activeSection="" navOverLight={true} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-warm-100 py-32 pt-40 text-nearblack sm:py-40 sm:pt-48 lg:py-48 lg:pt-56">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#111 0.5px, transparent 0.5px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[900px] px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-[0.4em] text-nearblack/40 transition-colors hover:text-nearblack"
          >
            <svg
              className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-px w-12 bg-executive-red" />
            <p className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-executive-red">
              Legal
            </p>
          </div>

          <h1 className="mt-6 font-display text-[3.2rem] font-light leading-[0.92] tracking-tighter text-nearblack sm:text-[4.5rem] lg:text-[5.5rem]">
            Privacy
            <br />
            <span className="italic text-executive-red/80">Policy</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-nearblack/60 sm:text-lg">
            Effective Date: June 2026
          </p>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-nearblack/60 sm:text-lg">
            This Privacy Policy explains how Ractysh Design Private Limited collects, uses, discloses and safeguards your personal
            information when you visit our website or engage with our studio.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-20 sm:py-28 lg:py-36">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(#111 0.5px, transparent 0.5px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[900px] px-5 sm:px-8 lg:px-12">
          <div className="space-y-16">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="privacy-section">
                <h2 className="font-display text-2xl font-normal leading-tight tracking-tight text-nearblack sm:text-3xl">
                  {section.title}
                </h2>
                <div className="mt-2 h-px w-16 bg-executive-red/60" />
                <p className="mt-6 text-base leading-relaxed text-nearblack/70 sm:text-lg">
                  {section.content}
                </p>
                {section.contact && (
                  <div className="mt-6 rounded-lg border border-nearblack/10 bg-warm-50 p-6">
                    <p className="text-base font-semibold text-nearblack">
                      Ractysh Design Private Limited
                    </p>
                    <p className="mt-2 text-base text-nearblack/70">
                      Email:{" "}
                      <a
                        href="mailto:ractyshdesign@gmail.com"
                        className="text-executive-red underline underline-offset-2 transition-colors hover:text-executive-red/80"
                      >
                        ractyshdesign@gmail.com
                      </a>
                    </p>
                    <p className="text-base text-nearblack/70">
                      Coimbatore, Tamil Nadu, India
                    </p>
                    <p className="mt-3 text-sm text-nearblack/50">
                      We respond to all privacy inquiries within 15 business
                      days.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Certifications Section */}
          <div className="mt-24 rounded-xl border border-[#C8A45D]/30 bg-gradient-to-br from-warm-50 to-white p-8 sm:p-12">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-[#C8A45D]" />
              <p className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-[#C8A45D]">
                Certifications &amp; Compliance
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#C8A45D]/30 bg-[#C8A45D]/5 text-xs text-[#C8A45D]">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-nearblack/80">
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-4 border-2 border-nearblack/20 px-10 py-5 text-[0.75rem] font-black uppercase tracking-[0.4em] text-nearblack transition-all duration-500 hover:border-executive-red hover:bg-executive-red hover:text-white"
            >
              <svg
                className="h-5 w-5 transition-transform duration-500 group-hover:-translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </section>

      <ArchitectureFooter />
    </div>
  );
}
