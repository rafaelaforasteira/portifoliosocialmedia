import gsap from "gsap";
import { HERO_MOTION as motion, HERO_TIMING as timing, HERO_VIDEO_MOTION as framing } from "@/lib/constants/hero-intro";

/** The video is the only clock for both framing and interface. */
export function animateHero(root: HTMLElement, video: HTMLVideoElement) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const timeline = gsap.timeline({ paused: true });
  const compact = window.matchMedia("(max-width: 900px)");
  const wide = window.matchMedia("(min-aspect-ratio: 2/1)");
  const profile = () => compact.matches ? framing.compact : wide.matches ? framing.ultrawide : framing.desktopHD;
  const layers = root.querySelectorAll<HTMLElement>(".hero-video, .hero-final-frame");
  const setOrigin = () => gsap.set(layers, { transformOrigin: profile().origin });
  setOrigin();
  const zoom = gsap.fromTo(layers, { scale: framing.scaleFrom, xPercent: 0 }, {
    scale: () => profile().scaleTo,
    xPercent: () => profile().xPercent,
    duration: framing.zoomEnd - framing.zoomStart,
    ease: "sine.inOut", paused: false,
  });
  timeline.add(zoom, framing.zoomStart);
  const find = (name: string) => root.querySelector<HTMLElement>(`[data-reveal="${name}"]`);
  const fade = (name: string, at: number, y: number, duration: number) => {
    const element = find(name);
    if (element) timeline.fromTo(element, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration, ease: "power3.out", immediateRender: true }, at);
  };
  fade("eyebrow", timing.eyebrow, motion.labelOffset, motion.labelDuration);
  for (const name of ["titleLine1", "titleLine2"] as const) {
    const element = find(name);
    if (element) timeline.fromTo(element,
      { y: 0, yPercent: motion.titleOffsetPercent, autoAlpha: 0 },
      { y: 0, yPercent: 0, autoAlpha: 1, duration: motion.titleDuration, ease: "power4.out", immediateRender: true }, timing[name]);
  }
  fade("description", timing.description, motion.descriptionOffset, motion.descriptionDuration);
  fade("cta", timing.cta, motion.ctaOffset, motion.ctaDuration);

  let frame: number | undefined;
  let frameType: "video" | "animation" | undefined;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let fallback = false;
  let lastProgress = video.currentTime;
  const onFraming = () => {
    setOrigin();
    zoom.invalidate();
    zoom.totalTime(Math.max(0, (fallback ? timing.settled : video.currentTime) - framing.zoomStart), true);
  };
  compact.addEventListener("change", onFraming);
  wide.addEventListener("change", onFraming);
  const clearWatchdog = () => { if (watchdog !== undefined) clearTimeout(watchdog); watchdog = undefined; };
  const cancelFrame = () => {
    if (frame !== undefined) {
      if (frameType === "video") video.cancelVideoFrameCallback(frame);
      else cancelAnimationFrame(frame);
    }
    frame = undefined;
  };
  const finalUI = () => { timeline.time(timing.settled, false); };
  const showFallback = () => {
    if (disposed) return;
    fallback = true;
    cancelFrame(); clearWatchdog(); video.pause();
    root.dataset.introState = media.matches ? "reduced" : "fallback";
    finalUI();
  };
  // One watchdog for unavailable/stalled playback; never used for choreography.
  const armWatchdog = () => {
    clearWatchdog();
    if (!fallback && video.currentTime < timing.settled) watchdog = setTimeout(showFallback, motion.fallbackDelayMs);
  };
  const sync = () => {
    if (disposed || fallback) return;
    timeline.time(video.currentTime, false);
    root.dataset.introState = video.ended ? "ended" : video.currentTime >= timing.settled ? "settled" : "playing";
    if (video.currentTime >= timing.settled) { cancelFrame(); clearWatchdog(); }
  };
  const tick = () => { frame = undefined; sync(); schedule(); };
  const schedule = () => {
    if (disposed || fallback || frame !== undefined || video.paused || video.ended || video.currentTime >= timing.settled) return;
    if (typeof video.requestVideoFrameCallback === "function") {
      frameType = "video"; frame = video.requestVideoFrameCallback(tick);
    } else {
      frameType = "animation"; frame = requestAnimationFrame(tick);
    }
  };
  const onPlay = () => {
    if (fallback || media.matches) { video.pause(); return; }
    sync(); armWatchdog(); schedule();
  };
  const onPause = () => { cancelFrame(); if (!video.ended) armWatchdog(); };
  const onTime = () => {
    if (fallback) return;
    sync();
    if (video.currentTime !== lastProgress) { lastProgress = video.currentTime; armWatchdog(); }
  };
  const onSeek = () => { sync(); schedule(); };
  const onEnd = () => {
    if (fallback) return;
    cancelFrame(); clearWatchdog(); finalUI(); root.dataset.introState = "ended";
    // Keep the video element and its final decoded frame. Never reset currentTime.
  };
  const start = () => {
    if (disposed || fallback) return;
    if (media.matches) { showFallback(); return; }
    video.muted = true; video.defaultMuted = true;
    armWatchdog();
    video.play()?.catch(() => { if (!disposed) showFallback(); });
  };
  const onPreference = () => {
    if (media.matches) showFallback();
    // Do not replay the intro when the preference is switched off.
  };
  const onVisibility = () => {
    if (document.hidden) { cancelFrame(); clearWatchdog(); }
    else { sync(); armWatchdog(); schedule(); }
  };
  video.addEventListener("loadedmetadata", start);
  video.addEventListener("play", onPlay);
  video.addEventListener("playing", onPlay);
  video.addEventListener("pause", onPause);
  video.addEventListener("timeupdate", onTime);
  video.addEventListener("seeked", onSeek);
  video.addEventListener("waiting", armWatchdog);
  video.addEventListener("ended", onEnd);
  video.addEventListener("error", showFallback);
  media.addEventListener("change", onPreference);
  document.addEventListener("visibilitychange", onVisibility);
  if (video.error) showFallback(); else start();

  return () => {
    disposed = true; cancelFrame(); clearWatchdog();
    compact.removeEventListener("change", onFraming);
    wide.removeEventListener("change", onFraming);
    video.removeEventListener("loadedmetadata", start);
    video.removeEventListener("play", onPlay);
    video.removeEventListener("playing", onPlay);
    video.removeEventListener("pause", onPause);
    video.removeEventListener("timeupdate", onTime);
    video.removeEventListener("seeked", onSeek);
    video.removeEventListener("waiting", armWatchdog);
    video.removeEventListener("ended", onEnd);
    video.removeEventListener("error", showFallback);
    media.removeEventListener("change", onPreference);
    document.removeEventListener("visibilitychange", onVisibility);
    timeline.revert();
  };
}
