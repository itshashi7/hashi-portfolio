"use client";

import { useSyncExternalStore } from "react";

export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "experiments", label: "Experiments" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
] as const;
export type SectionId = (typeof SECTIONS)[number]["id"];

let active: SectionId = "home";
const listeners = new Set<() => void>();

export function setActiveSection(id: SectionId) {
  if (id === active) return;
  active = id;
  listeners.forEach((l) => l());
}

export function useActiveSection(): SectionId {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => active,
    () => "home",
  );
}
