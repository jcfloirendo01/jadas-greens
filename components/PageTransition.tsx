"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import styles from "./PageTransition.module.css";

export default function PageTransition() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isFirst = useRef(true);

  const isAdminRoute = pathname?.startsWith("/admin") || pathname === "/login";

  // Initial page reveal — curtain slides up and off
  useEffect(() => {
    if (isAdminRoute) return;
    const curtain = curtainRef.current;
    if (!curtain) return;
    gsap.set(curtain, { scaleY: 1, transformOrigin: "top" });
    gsap.to(curtain, {
      scaleY: 0,
      duration: 1.2,
      ease: "power4.inOut",
      transformOrigin: "top",
      delay: 0.15,
    });
    isFirst.current = false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Enter animation on route change
  useEffect(() => {
    if (isAdminRoute || isFirst.current) return;
    const curtain = curtainRef.current;
    if (!curtain) return;
    gsap.to(curtain, {
      scaleY: 0,
      duration: 1.0,
      ease: "power4.inOut",
      transformOrigin: "top",
    });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intercept internal link clicks for the leave animation
  useEffect(() => {
    if (isAdminRoute) return;
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("tel") ||
        href.startsWith("/admin") ||
        href === "/login" ||
        href === pathname
      ) return;

      e.preventDefault();
      const curtain = curtainRef.current;
      if (!curtain) return;

      gsap.fromTo(
        curtain,
        { scaleY: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 0.85,
          ease: "power4.inOut",
          transformOrigin: "bottom",
          onComplete: () => router.push(href),
        }
      );
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, router, isAdminRoute]);

  if (isAdminRoute) return null;
  return <div ref={curtainRef} className={styles.curtain} />;
}
