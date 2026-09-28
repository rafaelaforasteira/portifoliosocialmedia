import Image from "next/image";
import { HERO_PORTRAIT } from "@/lib/constants/hero";
export function HeroPortrait() {
  return <div className="portrait-plane" data-depth="4">
    <div className="portrait-reveal">
      <Image src={HERO_PORTRAIT.src} alt={HERO_PORTRAIT.alt} fill sizes="(max-width: 700px) 190vw, (min-width: 2455px) 2160px, 88vw" priority quality={85} style={{ objectPosition: HERO_PORTRAIT.objectPosition }} />
      <div className="portrait-shade" aria-hidden="true" />
      <div className="portrait-grain" aria-hidden="true" />
    </div>
  </div>;
}
