import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function animateHero(root: HTMLElement) {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const q = gsap.utils.selector(root);
    const timeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.2 } });
    timeline.from(q(".atmosphere"), { opacity: 0, duration: 1.8 }, .15)
      .from(q(".portrait-reveal"), { opacity: 0, scale: 1.03, filter: "blur(5px)" }, .25)
      .from(q('[data-reveal="intro"]'), { opacity: 0, y: 22 }, .4)
      .from(q('[data-reveal="main"]'), { opacity: 0, y: 35 }, .6)
      .from(q(".clues, .glass-fragment, .edition"), { opacity: 0, duration: 1.5 }, .9)
      .from(q('[data-reveal="cta"]'), { opacity: 0, y: 8 }, 1.1)
      .from(q('[data-reveal="arrow"]'), { opacity: 0 }, 1.3);
    gsap.to(q(".headline"), { y: -28, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: .6 } });
    gsap.to(q(".portrait-reveal"), { y: 35, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: .8 } });
  });
  mm.add("(min-width: 701px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]")).map(el => ({
      depth: Number(el.dataset.depth), x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
    }));
    const move = (e: PointerEvent) => { const rect = root.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - .5; const y = (e.clientY - rect.top) / rect.height - .5; layers.forEach(layer => { layer.x(x * layer.depth); layer.y(y * layer.depth); }); };
    const reset = () => layers.forEach(layer => { layer.x(0); layer.y(0); });
    root.addEventListener("pointermove", move); root.addEventListener("pointerleave", reset);
    return () => { root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", reset); };
  });
  return () => mm.revert();
}
