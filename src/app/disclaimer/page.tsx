import type { Metadata } from "next";
import Link from "next/link";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";
import { buildMetadata, pageSeo } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(pageSeo["/disclaimer"]);

const sections = [
  {
    id: "general-information",
    title: "1. General Information",
    content:
      "The information provided on the Ractysh Design Private Limited ('Ractysh Architecture', 'we', 'us', 'our') website is for general informational purposes only. While we endeavour to keep the information accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on the website.",
  },
  {
    id: "professional-advice-disclaimer",
    title: "2. Professional Advice Disclaimer",
    content:
      "The content on this website does not constitute professional architectural, engineering, or design advice. All architectural services are provided under a separate written agreement, and no client relationship is formed solely by accessing or using this website. You should consult with a qualified professional for advice specific to your project before making any decisions based on the information provided here.",
  },
  {
    id: "no-guarantees",
    title: "3. No Guarantees",
    content:
      "Project renderings, visualisations, and concept designs displayed on our website are for illustrative purposes only. Final outcomes may vary based on site conditions, regulatory approvals, client decisions, and other factors. We do not guarantee that any particular result or outcome will be achieved through engagement with our services.",
  },
  {
    id: "external-links",
    title: "4. External Links",
    content:
      "Our website may contain links to external websites that are not provided or maintained by, nor in any way affiliated with, Ractysh Design Private Limited. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. The inclusion of any link does not imply endorsement by us of the linked site or its content.",
  },
  {
    id: "intellectual-property",
    title: "5. Intellectual Property",
    content:
      "All intellectual property rights in the content, design, and materials on this website—including but not limited to architectural drawings, project imagery, logos, and text—are owned by or licensed to Ractysh Design Private Limited. Unauthorised use, reproduction, or distribution of any material from this website may violate copyright, trademark, and other applicable laws.",
  },
  {
    id: "limitation-of-liability",
    title: "6. Limitation of Liability",
    content:
      "To the fullest extent permitted by applicable law, Ractysh Design Private Limited shall not be liable for any loss or damage, whether direct, indirect, incidental, consequential, or punitive, arising out of or in connection with your use of, or inability to use, this website or the information contained herein. This limitation applies even if we have been advised of the possibility of such damages.",
  },
  {
    id: "contact-details",
    title: "7. Contact Details",
    content:
      "If you have any questions, concerns, or requests regarding this Disclaimer, please contact us:",
    contact: true,
  },
];

const certifications = [
  "Registered Design Consultancy",
  "Professional Architecture Services",
  "Industry Best Practices",
  "Transparent Communication",
  "Client-First Approach",
  "Ethical Business Standards",
];

export default function DisclaimerPage() {
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
            <span className="italic text-executive-red/80">Disclaimer</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-nearblack/60 sm:text-lg">
            Effective Date: June 2026
          </p>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-nearblack/60 sm:text-lg">
            This Disclaimer outlines important information regarding the use of the Ractysh Design Private Limited website and the limitations of our liability.
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
