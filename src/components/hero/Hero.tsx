"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { animateHero } from "@/lib/animations/hero";
import { HeroPortrait } from "./HeroPortrait";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => { if (root.current) return animateHero(root.current); }, { scope: root });
  return <section ref={root} className="hero" aria-label="Retrato de Raffaela Forasteira">
    <div className="hero-stage"><HeroPortrait /></div>
    <div className="hero-grain" aria-hidden="true" />
    <div className="hero-shade" aria-hidden="true" />
  </section>;
}
