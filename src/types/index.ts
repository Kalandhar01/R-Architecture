export type DeskState = "idle" | "submitting" | "success" | "error";

export type NavSectionId = "works" | "consultation" | "services" | "";

export type AnchorNavigateHandler = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;

export interface ArchitectureHeroView {
  heading: string;
  description: string;
  videoUrl: string;
  posterUrl: string | null;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
}

export interface ArchitectureProjectView {
  id: string;
  slug: string;
  number: string;
  kicker: string;
  title: string;
  description: string;
  location: string;
  projectType: string;
  place: string;
  image: string;
  alt: string;
  scale: string;
  detail: string;
  year: string;
  area: string | null;
  status: string;
  galleryImages: string[];
  featured: boolean;
  category?: string;
}

export interface EmailDeliveryResult {
  sent: boolean;
  skipped?: boolean;
  error?: string;
  id?: string;
  sentAt?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  location?: string;
  budget?: string;
  message: string;
  sourcePage?: string;
  website?: string;
}
