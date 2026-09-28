import { HERO_COPY } from "@/lib/constants/hero-intro";
export function HeroHeadline() {
  return <h1 className="hero-title" aria-label={`${HERO_COPY.titleLine1} ${HERO_COPY.titleLine2}`}>
    <span className="title-mask"><span className="title-line title-line-1" data-reveal="titleLine1">{HERO_COPY.titleLine1}</span></span>
    <span className="title-mask"><span className="title-line title-line-2" data-reveal="titleLine2">{HERO_COPY.titleLine2}</span></span>
  </h1>;
}
