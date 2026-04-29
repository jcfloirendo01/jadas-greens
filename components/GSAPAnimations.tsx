"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GSAPAnimations() {
  useEffect(() => {
    // Synced with PageTransition curtain reveal (~1.2s + 0.15s delay)
    const heroDelay = 1.0;

    const ctx = gsap.context(() => {

      // ——— HERO (entrance on page load) ———
      const heroTl = gsap.timeline({ delay: heroDelay });

      heroTl
        .fromTo(
          "[data-hero-eyebrow]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0
        )
        .fromTo(
          "[data-hero-line]",
          { y: "105%" },
          { y: "0%", duration: 1.0, ease: "power4.out", stagger: 0.1 },
          0.2
        )
        .fromTo(
          "[data-hero-desc]",
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.65
        )
        .fromTo(
          "[data-hero-cta]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          0.82
        )
        .fromTo(
          "[data-hero-meta]",
          { opacity: 0 },
          { opacity: 1, duration: 0.7 },
          0.95
        )
        .fromTo(
          "[data-hero-card]",
          { opacity: 0, x: 56, rotationY: 6 },
          { opacity: 1, x: 0, rotationY: 0, duration: 1.1, ease: "power3.out" },
          0.3
        )
        .fromTo(
          "[data-hero-bubble]",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.8)", stagger: 0.14 },
          0.95
        );

      // ——— ABOUT ———
      gsap.fromTo(
        "[data-about-tag]",
        { opacity: 0, x: -24 },
        {
          opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: "[data-about-tag]", start: "top 85%" },
        }
      );

      gsap.fromTo(
        "[data-about-line]",
        { y: "105%" },
        {
          y: "0%", duration: 1.0, ease: "power4.out", stagger: 0.1,
          scrollTrigger: { trigger: "[data-about-h2]", start: "top 80%" },
        }
      );

      gsap.fromTo(
        "[data-about-p]",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: "[data-about-p]", start: "top 88%" },
        }
      );

      gsap.fromTo(
        "[data-about-visual]",
        { opacity: 0, scale: 0.88 },
        {
          opacity: 1, scale: 1, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: "[data-about-visual]", start: "top 78%" },
        }
      );

      gsap.fromTo(
        "[data-about-cta]",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6,
          scrollTrigger: { trigger: "[data-about-cta]", start: "top 90%" },
        }
      );

      // ——— STATS ———
      gsap.fromTo(
        "[data-stat]",
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: "[data-stat]", start: "top 85%" },
        }
      );

      // ——— VARIETIES ———
      gsap.fromTo(
        "[data-variety-head]",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: "[data-variety-head]", start: "top 85%" },
        }
      );

      gsap.fromTo(
        "[data-variety-card]",
        { opacity: 0, y: 64 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: "[data-variety-card]", start: "top 82%" },
        }
      );

      // ——— PROCESS ———
      gsap.fromTo(
        "[data-process-head]",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: "[data-process-head]", start: "top 85%" },
        }
      );

      gsap.fromTo(
        "[data-step]",
        { opacity: 0, x: -32 },
        {
          opacity: 1, x: 0, duration: 0.75, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: "[data-step]", start: "top 82%" },
        }
      );

      // ——— MARQUEE ———
      gsap.fromTo(
        "[data-marquee]",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: "[data-marquee]", start: "top 92%" },
        }
      );

    });

    return () => ctx.revert();
  }, []);

  return null;
}
