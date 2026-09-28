import Image from "next/image";
import { HERO_PORTRAIT } from "@/lib/constants/hero";
export function HeroPortrait() {
  return <>
    <div className="portrait-plane" data-depth="6"><div className="portrait-reveal"><Image src={HERO_PORTRAIT.src} alt={HERO_PORTRAIT.alt} fill sizes="(max-width: 700px) 1600px, (min-width: 2400px) 2400px, 100vw" priority quality={85} style={{ objectPosition: HERO_PORTRAIT.objectPosition }} /></div></div>
  </>;
}
