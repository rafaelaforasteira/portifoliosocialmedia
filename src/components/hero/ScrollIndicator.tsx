import { HERO_COPY } from "@/lib/constants/hero-intro";
export function ScrollIndicator() {
  return <a className="hero-cta" href={HERO_COPY.href} data-reveal="cta"><span>{HERO_COPY.cta}</span><span aria-hidden="true">↓</span></a>;
}
