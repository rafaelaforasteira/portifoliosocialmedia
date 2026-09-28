import Image from "next/image";
import { HERO_PORTRAIT } from "@/lib/constants/hero";
export function HeroPortrait() {
  return <div className="portrait-plane" data-depth="10"><div className="portrait-reveal"><Image src={HERO_PORTRAIT.src} alt={HERO_PORTRAIT.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1800px) 58vw, 1040px" priority quality={85} style={{ objectPosition: HERO_PORTRAIT.objectPosition }} /></div></div>;
}
