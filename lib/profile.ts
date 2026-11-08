import data from "@/content/profile.json";

export type Project = (typeof data.projects)[number] & {
  links: { repo?: string; demo?: string };
};
export type Category = "Backend" | "Cloud" | "AI" | "Tools";

export const profile = data;
export const projects = data.projects as Project[];

/** Public URL of the site (project page). Keep in sync with BASE_PATH in next.config.ts. */
export const SITE_URL = "https://itshashi7.github.io/hashi-portfolio";

/** True for strings the site must render as a visible TODO. */
export const isTodo = (v: unknown): v is string => typeof v === "string" && v.trim().startsWith("TODO");

/** Prefix a site-relative path with the base path (raw <a href> links don't get it automatically). */
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;

/** CV download URL, or null while the CV is held back (see TODO.md). */
export const resumeHref: string | null = isTodo(data.links.resume) ? null : asset(data.links.resume);

export const mailto = (subject = "Role for Hashim") =>
  `mailto:${data.links.email}?subject=${encodeURIComponent(subject)}`;

export const categories: Category[] = ["Backend", "Cloud", "AI", "Tools"];

export const yearsLabel = (start: string, endLabel: string | null) => `${start.slice(0, 4)} – ${endLabel ?? ""}`.trim();
