"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { animateHero } from "@/lib/animations/hero";
import { HeroPortrait } from "./HeroPortrait";
import { HeroHeadline } from "./HeroHeadline";
import { ScrollIndicator } from "./ScrollIndicator";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => { if (root.current) return animateHero(root.current); }, { scope: root });
  return <section ref={root} className="hero" aria-label="Raffaela Forasteira — Social Media">
    <div className="hero-stage">
      <header className="identity"><a href="#inicio" aria-label="Raffaela Forasteira, início"><span>RAFFAELA</span><span>FORASTEIRA</span></a><span className="identity-role">SOCIAL MEDIA</span></header>
      <span id="inicio" className="top-anchor" />
      <div className="atmosphere" data-depth="-12" aria-hidden="true" />
      <HeroPortrait /><div className="portrait-shade" aria-hidden="true" /><HeroHeadline />
      <div className="edition" aria-hidden="true"><span>PORTFÓLIO</span><span className="edition-line" /><span>VOL. 01</span></div>
      <ScrollIndicator />
      <div className="frame-footer" aria-hidden="true"><span className="frame-index"><i />01 /</span><span className="frame-caption">RAFFAELA FORASTEIRA</span><span className="frame-cross">+</span></div>
    </div>
  </section>;
}
