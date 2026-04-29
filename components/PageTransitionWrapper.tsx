"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const PageTransition = dynamic(() => import("./PageTransition"), { ssr: false });

export default function PageTransitionWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <PageTransition />;
}
