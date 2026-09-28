import { Hero } from "@/components/hero/Hero";
import { SiteHeader } from "@/components/navigation/SiteHeader";
export default function Home() {
  return <><SiteHeader /><main><Hero /><section id="continuacao" className="scroll-space" aria-label="Continuação do portfólio em breve" tabIndex={-1} /></main></>;
}
