// Motion tokens for GSAP / Anime.js. Mirrors DESIGN.md → motion. Change DESIGN.md first.
export const dur = {
  instant: 0.1,
  fast: 0.16,
  base: 0.24,
  slow: 0.4,
  max: 0.6,
  loaderCount: 1.1,
  loaderCurtain: 0.6,
} as const;

/** milliseconds, for Anime.js */
export const ms = Object.fromEntries(Object.entries(dur).map(([k, v]) => [k, Math.round(v * 1000)])) as {
  [K in keyof typeof dur]: number;
};

export const gsapEase = {
  outExpo: "expo.out",
  outQuart: "quart.out",
  inOut: "power4.inOut",
} as const;

export const animeEase = {
  outExpo: "outExpo",
  outQuart: "outQuart",
  inOut: "inOutQuart",
} as const;

export const cubic = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  outQuart: [0.25, 1, 0.5, 1] as [number, number, number, number],
  inOut: [0.76, 0, 0.24, 1] as [number, number, number, number],
};

export const stagger = { letters: 0.03, items: 0.05, cards: 0.07 } as const;
export const distance = { reveal: 16, hoverLift: 2, magneticMax: 6 } as const;
export const marqueeSpeed = 40; // px/s
export const typingSpeed = 28; // ms per character
