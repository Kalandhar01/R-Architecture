"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check, Loader2, Mail } from "lucide-react";
import { heroSupportingContent, ctaSectionContent, processContent, statisticsContent, footerContent } from "@/lib/architecturePremiumContent";
import { OptimizedImage as Image } from "@/components/OptimizedImage";
import { ProjectTypeSelect } from "@/components/ProjectTypeSelect";
import {
  reveal, staggerReveal, delayedStaggerReveal, maskCopyReveal,
  imageReveal, imageScaleReveal, formFieldReveal,
  consultationDeskReveal, heroLogoReveal, power4Out,
  consultationDeskId, architectureFooterColumns, architectureFooterStatement,
} from "./constants";
import { MaskRevealH2, ArchitecturalText, BrandLogo } from "./utility-components";
import type { AnchorNavigateHandler } from "./types";

type DeskState = "idle" | "submitting" | "success" | "error";

function FinalContactCTA({ onAnchorNavigate }: { onAnchorNavigate: AnchorNavigateHandler }) {
  return (
    <motion.div
      className="arch-contact-final-cta mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.24 }} variants={staggerReveal}
    >
      <motion.p className="arch-kicker arch-consultation-label" variants={reveal}>{ctaSectionContent.kicker}</motion.p>
      <MaskRevealH2 className="arch-contact-final-title font-display" data-parallax-text>
        <span className="arch-title-line">The right project begins</span>
        <span className="arch-title-line">with the right</span>
        <span className="arch-title-line">conversation.</span>
      </MaskRevealH2>
      <ArchitecturalText className="arch-contact-final-copy" variants={formFieldReveal}>{ctaSectionContent.body}</ArchitecturalText>
      <motion.div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" variants={staggerReveal}>
        <motion.a
          className="arch-contact-final-button"
          href={ctaSectionContent.primary.href}
          variants={formFieldReveal}
          onClick={(event) => onAnchorNavigate(event, ctaSectionContent.primary.href)}
        >
          <span>{ctaSectionContent.primary.label}</span>
          <ArrowUpRight aria-hidden="true" />
        </motion.a>
      </motion.div>
      <motion.p className="mt-5 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-nearblack/52" variants={formFieldReveal}>
        {ctaSectionContent.reassurance}
      </motion.p>
    </motion.div>
  );
}

function ArchitectureJournalFooter({ onAnchorNavigate }: { onAnchorNavigate: AnchorNavigateHandler }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<DeskState>("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [showNewsletterNotice, setShowNewsletterNotice] = useState(false);
  const newsletterSubmitting = newsletterState === "submitting";
  const newsletterSubscribed = newsletterState === "success";

  useEffect(() => {
    if (!newsletterSubscribed) { setShowNewsletterNotice(false); return; }
    setShowNewsletterNotice(true);
    const fadeTimer = window.setTimeout(() => setShowNewsletterNotice(false), 2800);
    const resetTimer = window.setTimeout(() => { setNewsletterState("idle"); setNewsletterMessage(""); }, 3600);
    return () => { window.clearTimeout(fadeTimer); window.clearTimeout(resetTimer); };
  }, [newsletterSubscribed]);

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newsletterSubmitting) return;
    const email = newsletterEmail.trim();
    if (!email) { setNewsletterState("error"); setNewsletterMessage("Enter your email address."); return; }
    setNewsletterState("submitting");
    setNewsletterMessage("Subscribing...");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "architecture_footer_newsletter" }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean; success?: boolean; alreadySubscribed?: boolean; message?: string;
      };
      if (!response.ok || payload.ok === false || payload.success === false) {
        throw new Error(payload.message || "Unable to subscribe right now.");
      }
      setNewsletterState("success");
      setNewsletterMessage(payload.alreadySubscribed ? "Already subscribed" : "Subscribed");
      setNewsletterEmail("");
    } catch (error) {
      setNewsletterState("error");
      setNewsletterMessage(error instanceof Error ? error.message : "Unable to subscribe right now. Please try again.");
    }
  }

  return (
    <motion.footer
      className="arch-journal-footer"
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.22 }} variants={staggerReveal}
    >
      <div className="arch-journal-footer-grid" aria-hidden="true" />
      <div className="arch-journal-footer-inner">
        <motion.div className="arch-journal-footer-top" variants={staggerReveal}>
          <motion.div className="arch-journal-footer-brand" variants={heroLogoReveal}>
            <BrandLogo />
            <span>
              <span aria-hidden="true">&#10022;</span>
              {heroSupportingContent.eyebrow}
            </span>
          </motion.div>
        </motion.div>
        <motion.p className="max-w-3xl text-sm leading-8 text-white/66" variants={reveal}>
          {footerContent.brandStatement}
        </motion.p>
        <motion.h2 className="arch-journal-footer-statement font-display" variants={staggerReveal}>
          {architectureFooterStatement.map((line) => (
            <motion.span key={line} variants={maskCopyReveal}>{line}</motion.span>
          ))}
        </motion.h2>
        <motion.div className="arch-journal-newsletter" variants={reveal}>
          <div className="arch-journal-newsletter-copy">
            <span>Studio Notes</span>
            <p>Receive architecture updates, project stories and design intelligence from Ractysh.</p>
          </div>
          <div>
            <div className={`arch-journal-newsletter-shell ${newsletterSubscribed ? "is-success" : ""}`}>
              <form className="arch-journal-newsletter-form" onSubmit={handleNewsletterSubmit}>
                <label className="sr-only" htmlFor="architecture-newsletter-email">Email address</label>
                <span className="arch-journal-newsletter-input-wrap">
                  <Mail aria-hidden="true" />
                  <input
                    id="architecture-newsletter-email" name="email" type="email" required
                    value={newsletterEmail}
                    onChange={(event) => {
                      setNewsletterEmail(event.target.value);
                      if (!newsletterSubmitting) { setNewsletterState("idle"); setNewsletterMessage(""); }
                    }}
                    aria-describedby="architecture-newsletter-status"
                    placeholder="Email address"
                  />
                </span>
                <button type="submit" disabled={newsletterSubmitting}>
                  {newsletterSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
                  <span>{newsletterSubmitting ? "Sending" : "Subscribe"}</span>
                </button>
              </form>
              <AnimatePresence>
                {newsletterSubscribed ? (
                  <motion.div
                    className="arch-journal-newsletter-success" role="status" aria-live="polite"
                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    animate={{ opacity: showNewsletterNotice ? 1 : 0, y: showNewsletterNotice ? 0 : 10, filter: showNewsletterNotice ? "blur(0px)" : "blur(8px)" }}
                    exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: power4Out }}
                  >
                    <Check aria-hidden="true" />
                    <span>{newsletterMessage || "Subscribed"}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <p
              id="architecture-newsletter-status"
              className={`arch-journal-newsletter-status ${newsletterState === "error" ? "is-error" : ""}`}
              aria-live="polite"
            >
              {newsletterSubscribed ? "" : newsletterMessage}
            </p>
          </div>
        </motion.div>
        <motion.div className="arch-journal-footer-columns" variants={delayedStaggerReveal}>
          {architectureFooterColumns.map((column) => (
            <motion.div key={column.title} className="arch-journal-footer-column" variants={staggerReveal}>
              <motion.h3 variants={reveal}>{column.title}</motion.h3>
              <motion.div variants={delayedStaggerReveal}>
                {column.items.map((item) =>
                  "href" in item && item.href ? (
                    <motion.a key={item.label} className="arch-journal-footer-link" href={item.href} variants={formFieldReveal} onClick={(event) => onAnchorNavigate(event, item.href)}>
                      {item.label}
                    </motion.a>
                  ) : (
                    <motion.span key={item.label} className="arch-journal-footer-location" variants={formFieldReveal}>
                      {item.label}
                    </motion.span>
                  )
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="arch-journal-footer-strip" variants={reveal}>
          <span>{heroSupportingContent.eyebrow}</span>
          <span>{footerContent.locations.items.map((item) => item.label).join(" • ")}</span>
          <span>{footerContent.legalInfo.copyright}</span>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export function ContactSection({ onAnchorNavigate }: { onAnchorNavigate: AnchorNavigateHandler }) {
  const [state, setState] = useState<DeskState>("idle");
  const [message, setMessage] = useState("Every private brief is reviewed by the Ractysh architecture desk.");
  const reduceMotion = useReducedMotion();
  const consultationImageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: consultationImageProgress } = useScroll({ target: consultationImageRef, offset: ["start end", "end start"] });
  const consultationImageY = useTransform(consultationImageProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["8%", "-8%"]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("submitting");
    setMessage("Preparing your consultation request for the architecture desk.");
    try {
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/architecture-consultation", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to route the consultation.");
      setState("success");
      setMessage("Consultation Request Received. Our team will review your requirements and reach out shortly.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to route the consultation.");
    }
  }

  return (
    <section id="consultation" className="arch-contact-section arch-luxury-consultation arch-contact-experience bg-white text-nearblack" data-arch-section>
      <motion.div
        className="arch-contact-trust-panel mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={staggerReveal}
      >
        <div className="flex flex-col gap-16 lg:gap-24">
          <motion.div variants={staggerReveal} className="max-w-4xl">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-executive-red" />
              <motion.p className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-executive-red" variants={reveal}>
                {statisticsContent.kicker}
              </motion.p>
            </div>
            <MaskRevealH2 className="mt-8 font-display text-[4rem] font-light leading-[0.88] tracking-tighter sm:text-[5.5rem] lg:text-[7rem]" data-parallax-text>
              {statisticsContent.title.map((line, i) => (
                <span key={line} className="block whitespace-nowrap">
                  {i % 2 !== 0 ? <span className="italic text-executive-red/90">{line}</span> : line}
                </span>
              ))}
            </MaskRevealH2>
            <motion.p className="mt-10 max-w-xl text-lg leading-relaxed text-nearblack/60 sm:text-xl" variants={reveal}>
              Built across residences, workplaces and specialist commissions, our portfolio is measured by long-term trust, technical precision and the consistency of delivery from brief to handover.
            </motion.p>
          </motion.div>

          <motion.div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-6" variants={delayedStaggerReveal}>
            {statisticsContent.metrics.map((metric, idx) => (
              <motion.article
                key={metric.label}
                className="group relative flex min-h-[180px] flex-1 flex-col justify-between overflow-hidden rounded-[1rem] border border-nearblack/5 bg-stone-50 p-6 transition-all duration-700 hover:border-executive-red/30 hover:bg-white lg:min-w-[200px] lg:p-7"
                variants={reveal}
                whileHover={{ y: -4 }}
              >
                <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-[0.03]">
                  <svg width="100%" height="100%" className="text-nearblack">
                    <pattern id={`metric-pattern-${idx}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
                      <circle cx="30" cy="30" r="1.5" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#metric-pattern-${idx})`} />
                  </svg>
                </div>
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-executive-red/[0.03] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-end gap-1 overflow-hidden">
                      <span
                        className="font-display text-[3.5rem] font-light leading-[0.8] tracking-tighter text-nearblack transition-transform duration-700 group-hover:-translate-y-1 sm:text-[4rem]"
                        data-metric-counter
                        data-value={metric.value}
                      >
                        {metric.value}
                      </span>
                      <span className="font-display text-[2rem] font-light text-executive-red transition-transform duration-700 group-hover:-translate-y-2 sm:text-[2.5rem]">
                        {metric.suffix}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-3 h-px w-6 bg-executive-red/30 transition-all duration-700 group-hover:w-12 group-hover:bg-executive-red" />
                    <h3 className="font-display text-base font-medium tracking-tight text-nearblack sm:text-lg">{metric.label}</h3>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none rounded-[1rem]">
                  <div className="absolute left-6 top-0 h-px w-0 bg-executive-red/40 transition-all duration-700 group-hover:w-[calc(100%-3rem)]" />
                  <div className="absolute bottom-6 left-0 h-0 w-px bg-executive-red/40 transition-all duration-700 group-hover:h-[calc(100%-3rem)]" />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={staggerReveal}
      >
        <div className="arch-contact-process grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div className="lg:sticky lg:top-28 lg:h-fit" variants={staggerReveal}>
            <motion.p className="arch-kicker text-executive-red" variants={reveal}>{processContent.kicker}</motion.p>
            <MaskRevealH2 className="arch-section-title mt-5 font-display" data-parallax-text>{processContent.title}</MaskRevealH2>
            <motion.p className="mt-6 max-w-xl text-base leading-8 text-nearblack/66 sm:text-lg" variants={reveal}>{processContent.body}</motion.p>
          </motion.div>
          <motion.div className="arch-contact-process-list" variants={delayedStaggerReveal}>
            <motion.span
              className="arch-contact-process-line"
              variants={{
                hidden: { scaleY: 0, opacity: 0 },
                visible: { scaleY: 1, opacity: 1, transition: { duration: 1, ease: power4Out } }
              }}
            />
            {processContent.steps.map((step) => (
              <motion.article key={step.number} variants={reveal}>
                <span>{step.number}</span>
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-executive-red/90">{step.summary}</p>
                  <h3 className="font-display">{step.name}</h3>
                  <p>{step.body}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <FinalContactCTA onAnchorNavigate={onAnchorNavigate} />

      <div id={consultationDeskId} className="arch-consultation-private-grid mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-36">
        <motion.div className="arch-consultation-editorial" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={staggerReveal}>
          <motion.div className="arch-consultation-image-shell" ref={consultationImageRef} variants={imageReveal}>
            <motion.div className="arch-consultation-image" style={{ y: consultationImageY }} variants={imageScaleReveal}>
              <Image
                src="/images/architecture/ractysh-kerala-courtyard-consultation.webp"
                alt="Premium South Indian contemporary villa courtyard with natural stone, warm lighting, and tropical planting."
                fill
                sizes="(max-width: 1023px) 100vw, 48vw"
                className="object-cover"
              />
            </motion.div>
            <motion.div className="arch-consultation-image-note" variants={formFieldReveal}>
              <span>Private Consultation Desk</span>
              <span>Material, light, site and proportion reviewed together</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="arch-consultation-form-stage" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.14 }} variants={staggerReveal}>
          <motion.form className="consultation-desk arch-consultation-desk arch-luxury-consultation-desk" onSubmit={handleSubmit} variants={consultationDeskReveal}>
            <input className="hidden" tabIndex={-1} name="website" autoComplete="off" aria-label="Leave this field empty" />
            <input type="hidden" name="sourcePage" value="architecture-domain" />
            <motion.div className="arch-consultation-form-head" variants={formFieldReveal}>
              <p>RACTYSH</p>
              <h3 className="font-display">
                <span>Architecture</span>
                <span>Begins With</span>
                <span>Clarity.</span>
              </h3>
              <span>Share your project details and the architecture desk will review the brief privately and respond with senior direction.</span>
            </motion.div>
            <motion.div className="arch-consultation-field-grid grid gap-4 md:grid-cols-2" variants={staggerReveal}>
              <motion.label variants={formFieldReveal}>
                <span>Name</span>
                <input name="name" autoComplete="name" required placeholder="Principal contact" />
              </motion.label>
              <motion.label variants={formFieldReveal}>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" required placeholder="studio@example.com" />
              </motion.label>
              <motion.label variants={formFieldReveal}>
                <span>Phone</span>
                <input name="phone" type="tel" autoComplete="tel" placeholder="+91 94438 55819" />
              </motion.label>
              <motion.div className="arch-projecttype-field" variants={formFieldReveal}>
                <span className="arch-projecttype-label">Project Type</span>
                <ProjectTypeSelect name="projectType" defaultValue="Architectural Design" />
              </motion.div>
              <motion.label variants={formFieldReveal} style={{ gridColumn: "1 / -1" }}>
                <span>Message</span>
                <textarea name="message" rows={3} required placeholder="Describe your project briefly..." className="w-full resize-none" />
              </motion.label>
            </motion.div>
            <motion.div className="arch-desk-footer" variants={formFieldReveal}>
              <p className={`desk-message ${state === "error" ? "is-error" : ""} ${state === "success" ? "is-success" : ""}`}>{message}</p>
              <motion.button
                className="desk-action arch-consultation-submit"
                type="submit"
                disabled={state === "submitting"}
                whileHover={state === "submitting" ? undefined : { y: -2 }}
                whileTap={state === "submitting" ? undefined : { scale: 0.985 }}
              >
                {state === "submitting" ? <Loader2 className="animate-spin" aria-hidden="true" /> : state === "success" ? <Check aria-hidden="true" /> : null}
                <span>{state === "submitting" ? "Sending Request" : state === "success" ? "Request Received" : "Request Consultation"}</span>
                <ArrowUpRight aria-hidden="true" />
              </motion.button>
            </motion.div>
            <AnimatePresence>
              {state === "success" ? (
                <motion.div
                  className="arch-consultation-success"
                  initial={{ opacity: 0, y: 18, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.72, ease: power4Out }}
                >
                  <Check aria-hidden="true" />
                  <strong>Consultation Request Received.</strong>
                  <span>Our team will review your requirements and reach out shortly.</span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </div>

      <ArchitectureJournalFooter onAnchorNavigate={onAnchorNavigate} />
    </section>
  );
}
