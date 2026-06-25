"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ArchitectureHeroView } from "@/lib/architectureCms";
import { heroSupportingContent } from "@/lib/architecturePremiumContent";
import Image from "next/image";
import {
  easeOut,
  power4Out,
  heroLogoReveal,
  heroHeadingReveal,
  heroDescriptionReveal,
  heroActionsReveal,
  consultationDeskId,
} from "./constants";
import {
  MaskRevealH1,
  ArchitecturalText,
  BrandLogo,
  renderArchitecturalText,
} from "./utility-components";
import type { AnchorNavigateHandler } from "./types";

const carouselImages = [
  "/images/architecture/landing/hero-carousel-1.jpg",
  "/images/architecture/landing/hero-carousel-2.jpg",
  "/images/architecture/landing/hero-carousel-3.jpg",
  "/images/architecture/landing/hero-carousel-4.jpg",
];

function useMobileHeroFrame() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export function HeroFilm({
  hero,
  onContentReveal,
  onAnchorNavigate
}: {
  hero: ArchitectureHeroView;
  onContentReveal: () => void;
  onAnchorNavigate: AnchorNavigateHandler;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isMobileHero = useMobileHeroFrame();
  const [currentImg, setCurrentImg] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduceMotion || isMobileHero ? ["0%", "0%"] : ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "-12%"]);

  useEffect(() => {
    onContentReveal();
  }, [onContentReveal]);

  const nextImg = useCallback(() => {
    setCurrentImg((prev) => (prev + 1) % carouselImages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextImg, 5000);
    return () => clearInterval(interval);
  }, [nextImg]);

  return (
    <section ref={ref} className="arch-hero relative overflow-hidden text-white">
      <motion.div className="absolute inset-0 w-full h-[116%]" style={{ y: bgY }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImg}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.25, ease: easeOut }}
          >
            <Image
              src={carouselImages[currentImg]}
              alt=""
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="arch-hero-overlay absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.48 }}
        transition={{ duration: 1.15, ease: power4Out }}
      />
      <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {carouselImages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setCurrentImg(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentImg ? "w-8 bg-white/90" : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
      <motion.div
        id="architecture-hero-content"
        className="arch-hero-content relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-5 py-28 text-center sm:px-8 lg:px-12"
        style={{ y: contentY }}
      >
        <motion.div
          className="hero-logo-lockup"
          initial="hidden"
          animate="visible"
          variants={heroLogoReveal}
        >
          <BrandLogo />
          <span className="brand-word">{heroSupportingContent.eyebrow}</span>
        </motion.div>
        <MaskRevealH1
          className="arch-hero-title mt-8 font-display"
          initial="hidden"
          animate="visible"
          variants={heroHeadingReveal}
          data-parallax-text
        >
          {hero.heading
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => (
              <span key={line} className="arch-title-line">
                {renderArchitecturalText(line)}
              </span>
            ))}
        </MaskRevealH1>
        <ArchitecturalText
          className="arch-hero-subtitle mt-8 max-w-2xl"
          initial="hidden"
          animate="visible"
          variants={heroDescriptionReveal}
        >
          {isMobileHero ? heroSupportingContent.mobileDescription : hero.description}
        </ArchitecturalText>
        <motion.div
          className="arch-hero-actions"
          initial="hidden"
          animate="visible"
          variants={heroActionsReveal}
        >
          {isMobileHero ? (
            <a href="#works" className="arch-hero-cta is-primary" onClick={(event) => onAnchorNavigate(event, "#works")}>
              <span>View Works</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ) : (
            <>
              <a href={hero.primaryCtaHref} className="arch-hero-cta is-primary" onClick={(event) => onAnchorNavigate(event, hero.primaryCtaHref)}>
                <span>{hero.primaryCtaText}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={hero.secondaryCtaHref} className="arch-hero-cta" onClick={(event) => onAnchorNavigate(event, hero.secondaryCtaHref)}>
                <span>{hero.secondaryCtaText}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </>
          )}
        </motion.div>
        {!isMobileHero ? (
          <motion.p
            className="mt-6 max-w-2xl text-sm leading-7 text-white/68"
            initial="hidden"
            animate="visible"
            variants={heroDescriptionReveal}
          >
            {heroSupportingContent.caption}
          </motion.p>
        ) : null}
      </motion.div>
      {isMobileHero ? (
        <motion.a
          href={`#${consultationDeskId}`}
          className="arch-hero-floating-cta"
          onClick={(event) => onAnchorNavigate(event, `#${consultationDeskId}`)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: power4Out, delay: 0.65 }}
        >
          <span>Consultation</span>
          <ArrowUpRight aria-hidden="true" />
        </motion.a>
      ) : null}
      <motion.div
        className="arch-scroll-line absolute bottom-8 left-1/2 z-10 h-16 w-px -translate-x-1/2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75, ease: power4Out, delay: 0.8 }}
      >
        <span />
      </motion.div>
    </section>
  );
}
