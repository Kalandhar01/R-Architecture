import type { MouseEvent, ReactNode } from "react";
import type { ArchitectureHeroView, ArchitectureProjectView } from "@/lib/architectureCms";

export type DeskState = "idle" | "submitting" | "success" | "error";
export type NavSectionId = "works" | "consultation" | "";
export type AnchorNavigateHandler = (event: MouseEvent<HTMLAnchorElement>, href: string) => void;

export type {
  ArchitectureHeroView,
  ArchitectureProjectView,
};

export type { ReactNode };
