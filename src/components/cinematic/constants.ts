import type { Variants } from "framer-motion";
import { footerContent, heroSupportingContent } from "@/lib/architecturePremiumContent";

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const power4Out = [0.16, 1, 0.3, 1] as const;
export const heroVideoPlaybackRate = 1.35;
export const architecturalPhrasePattern = /(Spatial Intelligence|Architecture|Design|Planning|Visualization)/gi;
export const architecturalPhraseSet = new Set(["spatial intelligence", "architecture", "design", "planning", "visualization"]);

export const studioStoryImages = [
  {
    src: "/images/architecture/ractysh-who-we-are-editorial-villa.webp",
    alt: "Luxury modern villa courtyard with stone, timber, glass, tropical planting, and natural daylight"
  },
  {
    src: "/images/architecture/ractysh-coimbatore-linear-house.avif",
    alt: "South Indian residence with contemporary roof planes, stone, glass, lawn, and shaded tropical edges"
  },
  {
    src: "/images/architecture/architecture-content-gallery-lobby-07.webp",
    alt: "Interior architecture with refined lobby materials, warm light, and composed spatial depth"
  }
] as const;

export const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: power4Out }
  }
};

export const staggerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

export const delayedStaggerReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.28
    }
  }
};

export const maskReveal: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

export const maskLineReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1, opacity: 1,
    transition: { duration: 0.72, ease: power4Out }
  }
};

export const maskCopyReveal: Variants = {
  hidden: { y: "112%", opacity: 0 },
  visible: {
    y: "0%", opacity: 1,
    transition: { duration: 0.8, ease: power4Out }
  }
};

export const heroMaskCopyReveal: Variants = {
  hidden: { y: "112%", opacity: 0 },
  visible: {
    y: "0%", opacity: 1,
    transition: { duration: 1.2, ease: power4Out }
  }
};

export const wordPhraseReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.1
    }
  }
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: power4Out }
  }
};

export const imageReveal: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.4, ease: power4Out }
  }
};

export const projectBoardReveal: Variants = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.4, ease: power4Out }
  }
};

export const imageScaleReveal: Variants = {
  hidden: { scale: 1.08 },
  visible: {
    scale: 1,
    transition: { duration: 1.4, ease: power4Out }
  }
};

export const studioImageReveal: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.2, ease: power4Out }
  }
};

export const studioImageScaleReveal: Variants = {
  hidden: { scale: 1.08 },
  visible: {
    scale: 1,
    transition: { duration: 1.2, ease: power4Out }
  }
};

export const ruleReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1, opacity: 1,
    transition: { duration: 0.95, ease: power4Out }
  }
};

export const formFieldReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.68, ease: power4Out }
  }
};

export const consultationDeskReveal: Variants = {
  hidden: { clipPath: "inset(0% 100% 0% 0%)", opacity: 0 },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
    transition: {
      duration: 1.05, ease: power4Out,
      staggerChildren: 0.085, delayChildren: 0.2
    }
  }
};

export const heroLogoReveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: power4Out }
  }
};

export const heroDescriptionReveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: power4Out, delay: 0.3 }
  }
};

export const heroActionsReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: power4Out, delay: 0.6 }
  }
};

export const heroHeadingReveal: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: {
      duration: 1.2, ease: power4Out,
      staggerChildren: 0.085
    }
  }
};

export const consultationSectionId = "consultation";
export const consultationDeskId = "architecture-consultation-desk";
export const contactPageAliases = new Set(["/contact", "/contact-us", "/consultation", "/schedule", "/request-schedule"]);
export const contactHashAliases = new Set(["contact", "contact-us", "schedule", "request-schedule", "architecture-contact", "architecture-consultation"]);

export type NavItemId = "works" | "consultation" | "";

export const navItems: { id: NavItemId; label: string }[] = [
  { id: "works", label: "Works" },
  { id: "consultation", label: "Consultation" }
];

export const navSectionIds = navItems.map((item) => item.id);
export const navScrollDuration = 1.35;
export const navScrollEase = (time: number) =>
  time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;

export const architectureFooterColumns = [footerContent.studio, footerContent.services, footerContent.locations, footerContent.contact] as const;
export const architectureFooterStatement = ["Built Beyond", "Blueprints.", "Designed to Endure."] as const;

export { heroSupportingContent };
