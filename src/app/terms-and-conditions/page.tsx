import type { Metadata } from "next";
import Link from "next/link";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";
import { buildMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(pageSeo["/terms-and-conditions"]);

const sections = [
  {
    id: "acceptance-of-terms",
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using the Ractysh Design Private Limited ('Ractysh Architecture', 'we', 'us', 'our') website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must refrain from using our website and services. These terms apply to all visitors, users, and clients of our platform.",
  },
  {
    id: "website-usage",
    title: "2. Website Usage",
    content:
      "You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use and enjoyment of the site. Prohibited behaviour includes harassing, abusing, defaming, or intimidating others, uploading malicious content, or attempting to gain unauthorised access to our systems.",
  },
  {
    id: "intellectual-property",
    title: "3. Intellectual Property",
    content:
      "All content on this website—including text, images, graphics, logos, project renderings, architectural drawings, and design concepts—is the intellectual property of Ractysh Design Private Limited unless otherwise stated. You may not reproduce, distribute, modify, or commercially exploit any content without our prior written consent.",
  },
  {
    id: "user-responsibilities",
    title: "4. User Responsibilities",
    content:
      "You are responsible for maintaining the confidentiality of any account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information when interacting with our website and to promptly update any information that becomes inaccurate or outdated.",
  },
  {
    id: "accuracy-of-information",
    title: "5. Accuracy of Information",
    content:
      "While we strive to ensure that all information on our website is accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website for any purpose.",
  },
  {
    id: "third-party-links",
    title: "6. Third Party Links",
    content:
      "Our website may contain links to third-party websites or services that are not owned or controlled by Ractysh Design Private Limited. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. You acknowledge and agree that we shall not be liable for any damage or loss caused by or in connection with the use of such external sites.",
  },
  {
    id: "limitation-of-liability",
    title: "7. Limitation of Liability",
    content:
      "To the fullest extent permitted by law, Ractysh Design Private Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of our website or services, whether based on warranty, contract, tort, or any other legal theory.",
  },
  {
    id: "service-availability",
    title: "8. Service Availability",
    content:
      "We reserve the right to modify, suspend, or discontinue any aspect of our website or services at any time without prior notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of our services. We strive to maintain high availability but do not guarantee uninterrupted access to our website.",
  },
  {
    id: "governing-law",
    title: "9. Governing Law",
    content:
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Coimbatore, Tamil Nadu.",
  },
  {
    id: "termination",
    title: "10. Termination",
    content:
      "We reserve the right to terminate or suspend your access to our website and services immediately, without prior notice or liability, for any reason whatsoever, including without limitation a breach of these Terms and Conditions. Upon termination, your right to use the website will cease immediately.",
  },
  {
    id: "contact-information",
    title: "11. Contact Information",
    content:
      "If you have any questions, concerns, or requests regarding these Terms and Conditions, please contact us:",
    contact: true,
  },
];

const certifications = [
  "Registered Design Consultancy",
  "Professional Architecture Services",
  "Industry Best Practices",
  "Standard Contractual Clauses",
  "Client Protection Policies",
  "Compliant Business Practices",
];

export default function TermsConditionsPage() {
  return (
    <div className="architecture-site min-h-screen bg-white text-nearblack">
      <ArchitectureNav activeSection="" navOverLight={true} />

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
            Terms
            <br />
            <span className="italic text-executive-red/80">
              &amp; Conditions
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-nearblack/60 sm:text-lg">
            Effective Date: June 2026
          </p>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-nearblack/60 sm:text-lg">
            These Terms and Conditions govern your use of the Ractysh Design Private Limited website and services. Please read them carefully.
          </p>
        </div>
      </section>

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
                      We respond to all inquiries within 15 business days.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

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
