"use client";

import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { OptimizedImage as Image } from "@/components/OptimizedImage";
import {
  architecturalPhrasePattern,
  architecturalPhraseSet,
  maskReveal,
  maskLineReveal,
  heroMaskCopyReveal,
  maskCopyReveal,
  wordPhraseReveal,
  wordReveal,
  reveal,
} from "./constants";

function WordReveal({ phrase }: { phrase: string }) {
  const words = phrase.split(/\s+/).filter(Boolean);
  return (
    <motion.span className="arch-word-phrase" variants={wordPhraseReveal}>
      {words.map((word, index) => (
        <motion.span key={`${word}-${index}`} className="arch-word" variants={wordReveal}>
          {word}{index < words.length - 1 ? " " : null}
        </motion.span>
      ))}
    </motion.span>
  );
}

function renderArchitecturalText(text: string) {
  return text.split(architecturalPhrasePattern).map((part, index) => {
    if (architecturalPhraseSet.has(part.toLowerCase())) {
      return <WordReveal key={`${part}-${index}`} phrase={part} />;
    }
    return part;
  });
}

function renderRevealChildren(children: ReactNode) {
  return typeof children === "string" ? renderArchitecturalText(children) : children;
}

type MaskRevealH1Props = Omit<HTMLMotionProps<"h1">, "children"> & { children: ReactNode };
type MaskRevealH2Props = Omit<HTMLMotionProps<"h2">, "children"> & { children: ReactNode };
type MaskRevealH3Props = Omit<HTMLMotionProps<"h3">, "children"> & { children: ReactNode };

function MaskRevealH1({ children, className = "", variants = maskReveal, ...props }: MaskRevealH1Props) {
  return (
    <motion.h1 className={`arch-mask-reveal ${className}`} variants={variants} {...props}>
      <motion.span className="arch-draft-line" variants={maskLineReveal} aria-hidden="true" />
      <motion.span className="arch-mask-reveal-copy" variants={heroMaskCopyReveal}>
        {renderRevealChildren(children)}
      </motion.span>
    </motion.h1>
  );
}

function MaskRevealH2({ children, className = "", variants = maskReveal, ...props }: MaskRevealH2Props) {
  return (
    <motion.h2 className={`arch-mask-reveal ${className}`} variants={variants} {...props}>
      <motion.span className="arch-draft-line" variants={maskLineReveal} aria-hidden="true" />
      <motion.span className="arch-mask-reveal-copy" variants={maskCopyReveal}>
        {renderRevealChildren(children)}
      </motion.span>
    </motion.h2>
  );
}

function MaskRevealH3({ children, className = "", variants = maskReveal, ...props }: MaskRevealH3Props) {
  return (
    <motion.h3 className={`arch-mask-reveal ${className}`} variants={variants} {...props}>
      <motion.span className="arch-draft-line" variants={maskLineReveal} aria-hidden="true" />
      <motion.span className="arch-mask-reveal-copy" variants={maskCopyReveal}>
        {renderRevealChildren(children)}
      </motion.span>
    </motion.h3>
  );
}

type ArchitecturalTextProps = Omit<HTMLMotionProps<"p">, "children"> & { children: string };

function ArchitecturalText({ children, className = "", variants = reveal, ...props }: ArchitecturalTextProps) {
  return (
    <motion.p className={className} variants={variants} {...props}>
      {renderArchitecturalText(children)}
    </motion.p>
  );
}

function BrandLogo() {
  return (
    <span className="brand-logo">
      <Image
        src="/images/architecture/ractysh-architecture-logo.webp"
        alt="Ractysh Design Private Limited emblem"
        fill
        sizes="(max-width: 720px) 44px, 56px"
        className="object-contain"
        placeholder="empty"
        style={{ background: "transparent" }}
      />
    </span>
  );
}

export {
  WordReveal,
  renderArchitecturalText,
  renderRevealChildren,
  MaskRevealH1,
  MaskRevealH2,
  MaskRevealH3,
  ArchitecturalText,
  BrandLogo,
};
