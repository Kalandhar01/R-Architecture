"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import {
  consultationDeskId,
  contactHashAliases,
  contactPageAliases,
  navSectionIds,
  navScrollDuration,
  navScrollEase,
  type NavItemId,
} from "./constants";

let architectureLenis: {
  scrollTo: (target: HTMLElement | string | number, options?: {
    offset?: number; duration?: number; easing?: (time: number) => number;
    onComplete?: () => void; lock?: boolean; immediate?: boolean; force?: boolean;
  }) => void;
  resize?: () => void; start?: () => void; stop?: () => void;
} | null = null;

export function getLenis() {
  return architectureLenis;
}

export function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let lenis: import("lenis").default | null = null;
    let frame = 0;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.3,
        easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
        smoothWheel: true,
        wheelMultiplier: 0.74,
        touchMultiplier: 0.88,
        prevent: (node) => node.closest("[data-lenis-prevent]") !== null
      });
      architectureLenis = lenis;
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(raf);
      };
      frame = window.requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      if (frame) window.cancelAnimationFrame(frame);
      if (architectureLenis === lenis) architectureLenis = null;
      lenis?.destroy();
    };
  }, [reduceMotion]);

  return null;
}

export function navOffset() {
  const nav = document.querySelector<HTMLElement>(".architecture-nav");
  return Math.round((nav?.getBoundingClientRect().height || 74) + 18);
}

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

function targetIdFromHash(hash: string) {
  const targetId = decodeURIComponent(hash.replace(/^#/, "")).trim();
  if (!targetId) return null;
  return contactHashAliases.has(targetId.toLowerCase()) ? consultationDeskId : targetId;
}

export function navIdFromHash(hash: string) {
  if (hash === consultationDeskId || contactHashAliases.has(hash.toLowerCase())) return "consultation";
  return navSectionIds.includes(hash as NavItemId) ? (hash as NavItemId) : null;
}

function scrollTargetFromHref(href: string) {
  const trimmedHref = href.trim();
  if (!trimmedHref) return null;
  if (trimmedHref.startsWith("#")) return targetIdFromHash(trimmedHref);

  try {
    const url = new URL(trimmedHref, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.hash) return targetIdFromHash(url.hash);
    const targetPath = normalizePathname(url.pathname);
    if (contactPageAliases.has(targetPath)) return consultationDeskId;
  } catch {
    return null;
  }
  return null;
}

export async function premiumScrollTo(target: HTMLElement, onComplete: () => void) {
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navOffset());

  try {
    const [{ gsap }, { ScrollToPlugin }] = await Promise.all([import("gsap"), import("gsap/ScrollToPlugin")]);
    gsap.registerPlugin(ScrollToPlugin);
    architectureLenis?.scrollTo(window.scrollY, { immediate: true, force: true });
    gsap.killTweensOf(window);
    gsap.to(window, {
      scrollTo: { y: top, autoKill: false },
      duration: navScrollDuration,
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: () => architectureLenis?.resize?.(),
      onComplete: () => {
        architectureLenis?.resize?.();
        onComplete();
      }
    });
  } catch {
    if (architectureLenis) {
      architectureLenis.scrollTo(top, {
        duration: navScrollDuration, easing: navScrollEase, onComplete, lock: true
      });
      return;
    }
    window.scrollTo({ top, behavior: "smooth" });
    window.setTimeout(onComplete, navScrollDuration * 1000);
  }
}

export function scrollTargetFromHrefSafe(href: string) {
  return scrollTargetFromHref(href);
}

export function useArchitectureGsap(
  rootRef: React.RefObject<HTMLElement | null>,
  reduceMotion: boolean | null,
) {
  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let context: { revert: () => void } | null = null;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      const root = rootRef.current;
      if (cancelled || !root) return;

      const { gsap } = gsapModule;
      const { ScrollTrigger } = scrollModule;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-metric-counter]", root).forEach((counter) => {
          const finalValue = parseInt(counter.dataset.value || "0", 10);
          if (isNaN(finalValue)) return;
          gsap.fromTo(counter, { innerHTML: "0" }, {
            innerHTML: finalValue, duration: 2.5, ease: "power3.out",
            snap: { innerHTML: 1 },
            scrollTrigger: { trigger: counter, start: "top 85%", once: true }
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax-text]", root).forEach((item) => {
          gsap.to(item, {
            y: -34, ease: "none",
            scrollTrigger: { trigger: item, start: "top 90%", end: "bottom 18%", scrub: true }
          });
        });

        const contactHero = root.querySelector<HTMLElement>("[data-contact-hero]");
        if (contactHero) {
          const contactVideo = contactHero.querySelector<HTMLElement>("[data-contact-hero-video]");
          const contactRevealItems = gsap.utils.toArray<HTMLElement>("[data-contact-reveal]", contactHero);
          const contactTimeline = gsap.timeline({
            scrollTrigger: { trigger: contactHero, start: "top 72%", once: true }
          });
          if (contactVideo) {
            contactTimeline.fromTo(contactVideo, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1.02, duration: 1.9, ease: "power4.out" });
          }
          if (contactRevealItems.length) {
            contactTimeline.fromTo(contactRevealItems, { opacity: 0, y: 36 }, {
              opacity: 1, y: 0, duration: 1.05, ease: "power4.out", stagger: 0.16
            }, contactVideo ? ">-0.15" : 0);
          }
        }

        gsap.utils.toArray<HTMLElement>("[data-studio-story]", root).forEach((item) => {
          const media = item.querySelector<HTMLElement>("[data-studio-story-media]");
          const image = item.querySelector<HTMLElement>("[data-studio-story-image]");
          const copyItems = item.querySelectorAll<HTMLElement>("[data-studio-story-copy] > *");
          if (media) {
            gsap.fromTo(media, { clipPath: "inset(0% 0% 100% 0%)" }, {
              clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "power4.out",
              scrollTrigger: { trigger: item, start: "top 82%", once: true }
            });
          }
          if (image) {
            gsap.fromTo(image, { scale: 1.08 }, {
              scale: 1, duration: 1.35, ease: "power4.out",
              scrollTrigger: { trigger: item, start: "top 82%", once: true }
            });
            gsap.to(image, {
              yPercent: -7, ease: "none",
              scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true }
            });
          }
          if (copyItems.length) {
            gsap.fromTo(copyItems, { opacity: 0, y: 28 }, {
              opacity: 1, y: 0, duration: 0.82, stagger: 0.08, ease: "power4.out",
              scrollTrigger: { trigger: item, start: "top 78%", once: true }
            });
          }
        });

        ScrollTrigger.refresh();
      }, root);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [reduceMotion, rootRef]);
}
