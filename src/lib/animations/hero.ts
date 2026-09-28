import gsap from "gsap";
export function animateHero(root: HTMLElement) {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(root.querySelector(".portrait-reveal"), { opacity: 0, duration: 1, ease: "power2.out" });
  });
  return () => mm.revert();
}
