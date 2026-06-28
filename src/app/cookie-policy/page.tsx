import type { Metadata } from "next";
import Link from "next/link";
import ArchitectureNav from "@/components/ArchitectureNav";
import ArchitectureFooter from "@/components/ArchitectureFooter";

export const metadata: Metadata = {
  title: "Cookie Policy | Ractysh Design Private Limited",
  description:
    "Cookie Policy for Ractysh Design Private Limited. Learn how we use cookies and similar tracking technologies.",
  openGraph: {
    title: "Cookie Policy | Ractysh Design Private Limited",
    description:
      "Cookie Policy for Ractysh Design Private Limited. Learn how we use cookies and similar tracking technologies.",
  },
};

const sections = [
  {
    id: "what-cookies-are",
    title: "1. What Cookies Are",
    content:
      "Cookies are small text files that are placed on your device by your web browser when you visit a website. They are widely used to make websites work efficiently, enhance user experience, and provide information to website owners. Cookies may be set by the website you visit ('first-party cookies') or by third-party services integrated into the site ('third-party cookies').",
  },
  {
    id: "essential-cookies",
    title: "2. Essential Cookies",
    content:
      "Essential cookies are necessary for the basic functionality of our website. They enable core features such as page navigation, secure area access, and form submissions. Without these cookies, certain parts of our website may not function properly. These cookies do not collect any personally identifiable information and are typically session-based, expiring when you close your browser.",
  },
  {
    id: "analytics-cookies",
    title: "3. Analytics Cookies",
    content:
      "Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They allow us to count visits, track traffic sources, and measure user engagement with our content. This data helps us improve our website structure, content relevance, and overall user experience. We use industry-standard analytics tools that anonymise IP addresses where possible.",
  },
  {
    id: "functional-cookies",
    title: "4. Functional Cookies",
    content:
      "Functional cookies enable our website to remember choices you make and provide enhanced, more personalised features. These cookies may remember your preferences, language settings, or region to tailor your experience. While these cookies enhance usability, they are not strictly essential for the website to function. Information collected by these cookies is anonymised and cannot track your browsing activity on other websites.",
  },
  {
    id: "managing-cookies",
    title: "5. Managing Cookies",
    content:
      "You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by adjusting your browser settings. Most web browsers allow you to control cookies through their settings preferences. However, if you choose to disable certain cookies, some features of our website may not function optimally, and your experience may be affected.",
  },
  {
    id: "browser-settings",
    title: "6. Browser Settings",
    content:
      "You can configure your browser to accept all cookies, reject all cookies, or notify you when a cookie is set. Each browser is different, so we recommend consulting the help menu of your specific browser for instructions on managing cookies. Common browser options include: Chrome — Settings > Privacy and Security > Cookies and other site data; Firefox — Options > Privacy & Security > Cookies and Site Data; Safari — Preferences > Privacy > Cookies and website data.",
  },
  {
    id: "cookie-updates",
    title: "7. Cookie Updates",
    content:
      "We may update this Cookie Policy from time to time to reflect changes in our practices, legal requirements, or the cookies we use. When we make changes, the updated policy will be posted on this page with the effective date noted at the top. We encourage you to review this policy periodically to stay informed about how we use cookies.",
  },
];

const certifications = [
  "Registered Design Consultancy",
  "Professional Architecture Services",
  "Industry Best Practices",
  "Privacy Compliant",
  "Transparent Data Practices",
  "User-Centric Design",
];

export default function CookiePolicyPage() {
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
            Cookie
            <br />
            <span className="italic text-executive-red/80">Policy</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-nearblack/60 sm:text-lg">
            Effective Date: June 2026
          </p>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-nearblack/60 sm:text-lg">
            This Cookie Policy explains how Ractysh Design Private Limited uses cookies and similar tracking technologies on our website.
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
