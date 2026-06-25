"use client";

import Link from "next/link";
import { OptimizedImage as Image } from "@/components/OptimizedImage";

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

interface ArchitectureNavProps {
  navOverLight?: boolean;
  activeSection?: string;
}

export default function ArchitectureNav({ navOverLight = true, activeSection }: ArchitectureNavProps) {
  return (
    <header
      className={`architecture-nav fixed left-0 right-0 top-0 z-40 ${navOverLight ? "is-over-light" : ""}`}
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
          <Link href="/" className={`architecture-nav-link ${activeSection === "home" ? "is-active" : ""}`}>
            Home
          </Link>
          <Link href="/services" className={`architecture-nav-link ${activeSection === "services" ? "is-active" : ""}`}>
            Services
          </Link>
        </div>
      </nav>
    </header>
  );
}
