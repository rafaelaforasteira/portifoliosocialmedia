export const HERO_TIMING = {
  eyebrow: 1.40,
  titleLine1: 2.05,
  titleLine2: 2.38,
  description: 3.20,
  cta: 3.70,
  settled: 4.20,
} as const;

export const HERO_MOTION = {
  labelDuration: .45,
  titleDuration: .75,
  descriptionDuration: .6,
  ctaDuration: .5,
  labelOffset: 16,
  descriptionOffset: 24,
  ctaOffset: 20,
  titleOffsetPercent: 110,
  fallbackDelayMs: 8000,
} as const;

export const HERO_VIDEO = {
  src: "/videos/hero-intro.mp4",
  poster: "/videos/hero-poster.webp",
  finalFrame: "/videos/hero-final.webp",
} as const;

// Approved copy; description is intentionally empty until supplied.
export const HERO_COPY = {
  eyebrow: "RAFFAELA FORASTEIRA",
  titleLine1: "TRANSFORMANDO REDES SOCIAIS",
  titleLine2: "EM MÁQUINAS DE VENDAS",
  description: "",
  cta: "Vem me conhecer",
  href: "#continuacao",
};
