import type { MouseEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { OptimizedImage as Image } from "@/components/OptimizedImage";

interface ServiceCardProps {
  index?: number;
  title: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  description: string;
  features: readonly string[];
  cta: string;
  href: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function ServiceCard({
  index,
  title,
  shortDescription,
  image,
  imageAlt,
  description,
  features,
  cta,
  href,
  onNavigate
}: ServiceCardProps) {
  return (
    <motion.article
      className="group relative flex h-full flex-col overflow-hidden border border-nearblack/5 bg-white shadow-[0_2px_20px_rgba(17,17,17,0.03)] transition-all duration-500 hover:-translate-y-1 hover:border-executive-red/15 hover:shadow-[0_20px_60px_rgba(17,17,17,0.06)]"
      variants={reveal}
    >
      {/* ── Image Header ── */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-all duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nearblack/30 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-40" />

        {/* Floating Index */}
        {index ? (
          <div className="absolute left-6 top-6 overflow-hidden sm:left-8 sm:top-8">
            <motion.span
              className="block font-display text-3xl font-light leading-none text-white/60 transition-all duration-500 group-hover:text-white sm:text-4xl"
            >
              {String(index).padStart(2, "0")}
            </motion.span>
          </div>
        ) : null}

        {/* Top-right accent */}
        <div className="absolute right-0 top-0 h-12 w-12 translate-x-6 -translate-y-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 group-hover:translate-x-4 group-hover:-translate-y-4 sm:h-16 sm:w-16" />
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
        {/* Kicker */}
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-6 bg-executive-red/40 transition-all duration-500 group-hover:w-10 group-hover:bg-executive-red" />
          <p className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-nearblack/35">
            {shortDescription}
          </p>
        </div>

        {/* Title */}
        <h3 className="font-display text-3xl font-light leading-[0.95] tracking-tight text-nearblack transition-colors duration-500 group-hover:text-executive-red/90 sm:text-3xl lg:text-4xl">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-5 text-sm leading-relaxed text-nearblack/55 sm:text-base">
          {description}
        </p>

        {/* Features */}
        <div className="mt-6 grid gap-3 overflow-hidden border-t border-nearblack/5 pt-5 transition-all duration-500">
          {features.slice(0, 3).map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <span className="h-0.5 w-3 shrink-0 rounded-full bg-executive-red/30 transition-all duration-500 group-hover:w-5 group-hover:bg-executive-red" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-nearblack/35 transition-colors duration-500 group-hover:text-nearblack/50">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-6">
          <a
            href={href}
            className="inline-flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-nearblack/60 transition-all duration-500 hover:text-executive-red"
            onClick={(event) => onNavigate?.(event, href)}
          >
            <span>{cta}</span>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-nearblack/10 transition-all duration-500 group-hover:border-executive-red/30 group-hover:bg-executive-red/5">
              <ArrowUpRight className="h-3 w-3 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </div>

      {/* ── Corner brackets ── */}
      <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-nearblack/0 transition-all duration-700 group-hover:border-executive-red/30" />
      <div className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-nearblack/0 transition-all duration-700 group-hover:border-executive-red/30" />
    </motion.article>
  );
}
