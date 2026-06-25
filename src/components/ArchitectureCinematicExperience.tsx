"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { MouseEvent } from "react";
import type { ArchitectureHeroView, ArchitectureProjectView } from "@/lib/architectureCms";
import ArchitecturePremiumSections from "@/components/ArchitecturePremiumSections";
import { ArchitectureTestimonials } from "@/components/ArchitectureTestimonials";
import { ArchitectureStudioAccessWidget } from "@/components/ArchitectureStudioAccessWidget";
import {
  power4Out,
  navItems,
  navSectionIds,
} from "./cinematic/constants";
import { BrandLogo } from "./cinematic/utility-components";
import { HeroFilm } from "./cinematic/HeroFilm";
import { WorksSection } from "./cinematic/WorksSection";
import { ContactSection } from "./cinematic/ContactSection";
import {
  SmoothScroll,
  useArchitectureGsap,
  navOffset,
  scrollTargetFromHrefSafe,
  navIdFromHash,
  premiumScrollTo,
} from "./cinematic/scroll-utils";
import type { NavSectionId } from "./cinematic/types";

export function ArchitectureCinematicExperience({
  hero,
  projects
}: {
  hero: ArchitectureHeroView;
  projects: ArchitectureProjectView[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [heroContentRevealed, setHeroContentRevealed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("arch-intro-revealed") === "true";
    }
    return false;
  });
  const [activeSection, setActiveSection] = useState<NavSectionId>("");
  const [navOverLight, setNavOverLight] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    document.documentElement.classList.add("arch-intro-lock");
    return () => {
      document.documentElement.classList.remove("arch-intro-lock");
    };
  }, []);

  useEffect(() => {
    if (heroContentRevealed) {
      document.documentElement.classList.remove("arch-intro-lock");
    } else {
      document.documentElement.classList.add("arch-intro-lock");
    }
  }, [heroContentRevealed]);

  useArchitectureGsap(rootRef, reduceMotion);

  useEffect(() => {
    void fetch("/api/architecture/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page", path: window.location.pathname })
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const scrollY = Math.max(window.scrollY, 0);
      const scrollDelta = scrollY - lastScrollYRef.current;
      const offset = navOffset() + 120;
      const current = navSectionIds.reduce<NavSectionId>((active, id) => {
        const section = document.getElementById(id);
        if (!section) return active;
        return section.offsetTop - offset <= scrollY ? id : active;
      }, "");

      setActiveSection(current);
      setNavOverLight(scrollY > window.innerHeight * 0.72);

      if (scrollY < 32) {
        setNavHidden(false);
      } else if (Math.abs(scrollDelta) > 8) {
        setNavHidden(scrollDelta > 0 && scrollY > 120);
      }

      lastScrollYRef.current = scrollY;
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const handleAnchorNavigate = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = scrollTargetFromHrefSafe(href);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    const navId = navIdFromHash(targetId);
    if (navId) setActiveSection(navId);
    setNavHidden(false);
    void premiumScrollTo(target, () => {
      if (navId) setActiveSection(navId);
    });
    window.history.replaceState(null, "", `#${targetId}`);
  }, []);

  const handleHeroContentReveal = useCallback(() => {
    setHeroContentRevealed(true);
    setNavHidden(false);
    try { sessionStorage.setItem("arch-intro-revealed", "true"); } catch { /* noop */ }
  }, []);

  const navVisible = heroContentRevealed && !navHidden;

  return (
    <main ref={rootRef} className="architecture-site bg-white text-nearblack" data-arch-root>
      <SmoothScroll />

      <motion.header
        className={`architecture-nav fixed left-0 right-0 top-0 z-40 ${navOverLight ? "is-over-light" : ""}`}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : -88 }}
        transition={{ duration: navVisible ? 0.56 : 0.42, ease: power4Out, delay: heroContentRevealed && !navHidden ? 0.12 : 0 }}
        style={{ pointerEvents: navVisible ? "auto" : "none" }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12" aria-label="Architecture navigation">
          <Link href="/" className="nav-mark" aria-label="Ractysh home">
            <BrandLogo />
            <span className="nav-brand-text">
              <span className="nav-brand-primary">RACTYSH</span>
              <span className="nav-brand-sub">Design Pvt Ltd</span>
            </span>
          </Link>
          <div className="architecture-nav-links">
            <a
              href="#services"
              className="architecture-nav-link"
              onClick={(event) => handleAnchorNavigate(event, "#services")}
            >
              Services
            </a>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`architecture-nav-link ${activeSection === item.id ? "is-active" : ""}`}
                aria-current={activeSection === item.id ? "page" : undefined}
                onClick={(event) => handleAnchorNavigate(event, `#${item.id}`)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </motion.header>

      <HeroFilm hero={hero} onContentReveal={handleHeroContentReveal} onAnchorNavigate={handleAnchorNavigate} />
      <ArchitecturePremiumSections onAnchorNavigate={handleAnchorNavigate} />
      <WorksSection projects={projects} />
      <ArchitectureTestimonials />
      <ContactSection onAnchorNavigate={handleAnchorNavigate} />

      <ArchitectureStudioAccessWidget />
    </main>
  );
}
