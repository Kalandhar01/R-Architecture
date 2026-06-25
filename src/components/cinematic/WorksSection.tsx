"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MouseEvent } from "react";
import type { ArchitectureProjectView } from "@/lib/architectureCms";
import { OptimizedImage as Image } from "@/components/OptimizedImage";
import {
  reveal, staggerReveal, delayedStaggerReveal, projectBoardReveal, imageScaleReveal,
  easeOut, power4Out, consultationDeskId,
} from "./constants";
import { MaskRevealH2, ArchitecturalText } from "./utility-components";
import { premiumScrollTo, getLenis } from "./scroll-utils";

function portfolioCardClass(project: ArchitectureProjectView, index: number) {
  if (index === 0) return "is-featured";
  if (project.featured) return "is-wide";
  if (index % 6 === 1) return "is-tall";
  if (index % 6 === 2) return "is-wide";
  if (index % 6 === 4) return "is-quiet";
  return "";
}

function projectGallery(project: ArchitectureProjectView) {
  return Array.from(new Set([project.image, ...project.galleryImages].filter(Boolean))).slice(0, 6);
}

function compactLocation(location: string) {
  return location.split(",")[0]?.trim() || location;
}

function completedYear(project: ArchitectureProjectView) {
  return `Completed ${project.year}`;
}

function highlightProjectType(projectType: string) {
  if (/(villa|residence|estate|house)/i.test(projectType)) return "Private Residence";
  if (/(office|commercial|pavilion)/i.test(projectType)) return "Commercial Architecture";
  return projectType;
}

function designApproach(project: ArchitectureProjectView) {
  return [
    `Material selection for ${project.title} is guided by natural stone, warm surfaces and durable details that age with quiet confidence.`,
    "Spatial planning is organized around calm thresholds, courtyard moments and connected living zones so movement through the project feels composed rather than forced.",
    "Climate response shapes shaded edges, cross ventilation and deep openings, while natural lighting is calibrated to bring softness into the interiors throughout the day."
  ];
}

function numericMetric(value: string) {
  const match = value.match(/^(.*?)([\d,]+)(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    value: Number(match[2].replace(/,/g, "")),
    suffix: match[3]
  };
}

function ProjectMetric({ value, label }: { value: string; label: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const metric = numericMetric(value);

  useEffect(() => {
    if (!metric || reduceMotion) return;

    let frame = 0;
    const startedAt = performance.now();
    const duration = 1100;
    const formatter = new Intl.NumberFormat("en-IN", { useGrouping: !/(completed|planned)/i.test(metric.prefix) });

    const tick = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      const next = Math.round(metric.value * eased);
      if (ref.current) {
        ref.current.textContent = `${metric.prefix}${formatter.format(next)}${metric.suffix}`;
      }
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [metric, reduceMotion]);

  return (
    <div className="arch-project-case-metric" data-modal-reveal>
      <span ref={ref}>{value}</span>
      <small>{label}</small>
    </div>
  );
}

function PortfolioProjectCard({
  project,
  index,
  onSelect
}: {
  project: ArchitectureProjectView;
  index: number;
  onSelect: (project: ArchitectureProjectView) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-7%", "7%"]);

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`arch-portfolio-card ${portfolioCardClass(project, index)}`}
      variants={reveal}
      onClick={() => onSelect(project)}
    >
      <motion.span className="arch-portfolio-image-mask" variants={projectBoardReveal}>
        <motion.span className="arch-portfolio-image-plane" style={{ y: imageY }} variants={imageScaleReveal} data-arch-project-image>
          <Image
            src={project.image}
            alt={project.alt}
            fill
            priority={index === 0}
            sizes={index === 0 ? "(min-width: 1280px) 58vw, (min-width: 1024px) 54vw, 100vw" : "(min-width: 1280px) 34vw, (min-width: 1024px) 42vw, 100vw"}
            className="object-cover"
          />
        </motion.span>
      </motion.span>
      <span className="arch-portfolio-shade" aria-hidden="true" />
      <span className="arch-portfolio-index">{project.number}</span>
      <span className="arch-portfolio-content">
        <span className="arch-portfolio-kicker">{project.category || project.projectType}</span>
        <span className="arch-portfolio-title">{project.title}</span>
        <span className="arch-portfolio-description">{project.description}</span>
        <span className="arch-portfolio-location">{project.location}</span>
      </span>
      <span className="arch-portfolio-arrow" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </motion.button>
  );
}

function ProjectDetailModal({
  project,
  onClose,
  onConsultationClick
}: {
  project: ArchitectureProjectView;
  onClose: () => void;
  onConsultationClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const gallery = projectGallery(project);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const approach = designApproach(project);
  const features = ["Courtyard Planning", "Natural Ventilation", "Stone Materials", "Luxury Living"];
  const metrics = [
    { value: project.area || project.scale, label: "Scale" },
    { value: highlightProjectType(project.projectType), label: "Project Type" },
    { value: compactLocation(project.location), label: "Location" },
    { value: completedYear(project), label: "Timeline" }
  ];

  const showPreviousImage = useCallback(() => {
    setLightboxIndex((index) => (index === null ? gallery.length - 1 : (index - 1 + gallery.length) % gallery.length));
  }, [gallery.length]);

  const showNextImage = useCallback(() => {
    setLightboxIndex((index) => (index === null ? 0 : (index + 1) % gallery.length));
  }, [gallery.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxIndex !== null) { setLightboxIndex(null); return; }
        onClose();
      }
      if (lightboxIndex !== null && event.key === "ArrowLeft") showPreviousImage();
      if (lightboxIndex !== null && event.key === "ArrowRight") showNextImage();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = getLenis();
    lenis?.stop?.();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start?.();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, onClose, showNextImage, showPreviousImage]);

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let context: { revert: () => void } | null = null;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      if (cancelled || !modalRef.current || !bodyRef.current) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = scrollModule;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const scroller = bodyRef.current;
        gsap.utils.toArray<HTMLElement>("[data-modal-reveal]", modalRef.current).forEach((item) => {
          gsap.fromTo(item, { opacity: 0, y: 28 }, {
            opacity: 1, y: 0, duration: 0.78, ease: "power4.out",
            scrollTrigger: { trigger: item, scroller, start: "top 88%", once: true }
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-modal-image]", modalRef.current).forEach((item) => {
          const image = item.querySelector("img");
          gsap.fromTo(item, { clipPath: "inset(0% 0% 100% 0%)" }, {
            clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "power4.out",
            scrollTrigger: { trigger: item, scroller, start: "top 88%", once: true }
          });
          if (image) {
            gsap.fromTo(image, { scale: 1.08 }, {
              scale: 1, duration: 1.18, ease: "power4.out",
              scrollTrigger: { trigger: item, scroller, start: "top 88%", once: true }
            });
          }
        });
        ScrollTrigger.refresh();
      }, modalRef);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [project.id, reduceMotion]);

  return (
    <motion.div
      ref={modalRef}
      className="arch-project-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: easeOut }}
      onClick={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <motion.article
        className="arch-project-modal-panel"
        initial={{ opacity: 0, y: 46, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.55, ease: power4Out }}
      >
        <button type="button" className="arch-project-modal-close" onClick={onClose} aria-label="Close project view">
          <X aria-hidden="true" />
        </button>
        <div
          className="arch-project-modal-body"
          ref={bodyRef}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onWheel={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          <div className="arch-project-modal-hero">
            <Image src={project.image} alt={project.alt} fill priority sizes="100vw" className="object-cover" />
          </div>
          <div className="arch-project-modal-copy" data-modal-reveal>
            <p className="arch-kicker text-executive-red">{project.projectType}</p>
            <h3 className="font-display">{project.title}</h3>
            <p>{project.description}</p>
          </div>
          <dl className="arch-project-modal-meta" data-modal-reveal>
            <div><dt>Location</dt><dd>{project.location}</dd></div>
            <div><dt>Project Type</dt><dd>{project.projectType}</dd></div>
            <div><dt>Year</dt><dd>{project.year}</dd></div>
            <div><dt>Scale</dt><dd>{project.area || project.scale}</dd></div>
          </dl>
          <div className="arch-project-case-metrics">
            {metrics.map((metric) => (
              <ProjectMetric key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>
          <section className="arch-project-story" data-modal-reveal>
            <span>Design Approach</span>
            <h4 className="font-display">Material, climate and light shape the experience.</h4>
            {approach.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
          <section className="arch-project-features" data-modal-reveal>
            <span>Architectural Features</span>
            <ul>
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
          <section className="arch-project-gallery-section">
            <div className="arch-project-gallery-head" data-modal-reveal>
              <span>Project Gallery</span>
              <p>{gallery.length} studies in material, proportion and atmosphere.</p>
            </div>
            <div className="arch-project-modal-gallery">
              {gallery.map((image, imageIndex) => (
                <button
                  key={`${project.id}-${image}`}
                  type="button"
                  className={imageIndex === 0 ? "is-large" : ""}
                  data-modal-image
                  onClick={() => setLightboxIndex(imageIndex)}
                >
                  <Image
                    src={image}
                    alt={`${project.title} gallery image ${imageIndex + 1}`}
                    fill
                    sizes={imageIndex === 0 ? "(min-width: 1024px) 42vw, 100vw" : "(min-width: 1024px) 24vw, 100vw"}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </section>
          <div className="arch-project-modal-cta" data-modal-reveal>
            <span>Start Similar Project</span>
            <h4 className="font-display">Schedule Consultation</h4>
            <p>Share the site, ambition and atmosphere you want the space to hold.</p>
            <a href={`#${consultationDeskId}`} onClick={onConsultationClick}>
              <span>Schedule Consultation</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {lightboxIndex !== null ? (
          <motion.div
            className="arch-project-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
            onClick={(event) => { if (event.currentTarget === event.target) setLightboxIndex(null); }}
          >
            <button type="button" className="arch-project-lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close gallery viewer">
              <X aria-hidden="true" />
            </button>
            <button type="button" className="arch-project-lightbox-arrow is-prev" onClick={showPreviousImage} aria-label="Previous gallery image">
              <ChevronLeft aria-hidden="true" />
            </button>
            <motion.div
              key={gallery[lightboxIndex]}
              className="arch-project-lightbox-image"
              initial={{ opacity: 0, scale: 0.985, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.55, ease: power4Out }}
            >
              <Image
                src={gallery[lightboxIndex]}
                alt={`${project.title} enlarged gallery image ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
            <button type="button" className="arch-project-lightbox-arrow is-next" onClick={showNextImage} aria-label="Next gallery image">
              <ChevronRight aria-hidden="true" />
            </button>
            <div className="arch-project-lightbox-caption">
              <span>{project.title}</span>
              <small>{String(lightboxIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</small>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function WorksSection({ projects }: { projects: ArchitectureProjectView[] }) {
  const [selectedProject, setSelectedProject] = useState<ArchitectureProjectView | null>(null);
  const viewedProjectsRef = useRef(new Set<string>());

  const openProject = useCallback((project: ArchitectureProjectView) => {
    setSelectedProject(project);
    if (viewedProjectsRef.current.has(project.id)) return;
    viewedProjectsRef.current.add(project.id);
    void fetch("/api/architecture/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "project", path: window.location.pathname, projectId: project.id, projectSlug: project.slug })
    }).catch(() => undefined);
  }, []);

  const closeProject = useCallback(() => setSelectedProject(null), []);

  const startSimilarProject = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setSelectedProject(null);
    window.requestAnimationFrame(() => {
      const target = document.getElementById(consultationDeskId);
      if (!target) return;
      void premiumScrollTo(target, () => undefined);
      window.history.replaceState(null, "", `#${consultationDeskId}`);
    });
  }, []);

  return (
    <section id="works" className="arch-works-section arch-portfolio-section bg-white text-nearblack">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <motion.div className="arch-works-intro" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerReveal} data-arch-section>
          <motion.p className="arch-kicker text-executive-red" variants={reveal}>Our Works</motion.p>
          <MaskRevealH2 className="arch-section-title font-display" data-parallax-text>
            A living portfolio of private architectural work.
          </MaskRevealH2>
          <ArchitecturalText>
            Residences, work environments and private estates composed through proportion, light, material discipline and long-term purpose.
          </ArchitecturalText>
        </motion.div>
        {projects.length ? (
          <motion.div className="arch-portfolio-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={delayedStaggerReveal}>
            {projects.map((project, index) => (
              <PortfolioProjectCard key={project.id} project={project} index={index} onSelect={openProject} />
            ))}
          </motion.div>
        ) : (
          <motion.div className="arch-portfolio-empty" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal}>
            <p>Selected architecture works are being curated.</p>
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {selectedProject ? <ProjectDetailModal project={selectedProject} onClose={closeProject} onConsultationClick={startSimilarProject} /> : null}
      </AnimatePresence>
    </section>
  );
}
