"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { animateHero } from "@/lib/animations/hero";
import { HERO_COPY, HERO_VIDEO } from "@/lib/constants/hero-intro";
import { HeroHeadline } from "./HeroHeadline";
import { ScrollIndicator } from "./ScrollIndicator";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useGSAP(() => {
    if (root.current && video.current) return animateHero(root.current, video.current);
  }, { scope: root });
  return <section ref={root} className="hero" data-intro-state="loading" aria-label="Raffaela Forasteira — Social Media">
    <div className="hero-final-frame" style={{ backgroundImage: `url(${HERO_VIDEO.finalFrame})` }} aria-hidden="true" />
    <video ref={video} className="hero-video" src={HERO_VIDEO.src} poster={HERO_VIDEO.poster}
      autoPlay muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
    <div className="hero-grain" aria-hidden="true" />
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-content">
      <p className="hero-eyebrow" data-reveal="eyebrow">{HERO_COPY.eyebrow}</p>
      <HeroHeadline />
      {HERO_COPY.description && <p className="hero-description" data-reveal="description">{HERO_COPY.description}</p>}
      <ScrollIndicator />
    </div>
    <noscript><style>{`.hero-video{display:none}.hero [data-reveal]{opacity:1!important;visibility:visible!important;transform:none!important}`}</style></noscript>
  </section>;
}
