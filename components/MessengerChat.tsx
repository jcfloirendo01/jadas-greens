"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./MessengerChat.module.css";

const DEFAULT_MESSENGER_URL = "https://m.me/61568664689559";

export default function MessengerChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  const messengerUrl = process.env.NEXT_PUBLIC_MESSENGER_URL?.trim() || DEFAULT_MESSENGER_URL;

  return (
    <div className={styles.wrap}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Messenger chat">
          <div className={styles.header}>
            <div className={styles.avatar}>
              <Image src="/assets/logo-circle.png" alt="Jada's Greens" width={42} height={42} />
            </div>
            <div>
              <div className={styles.name}>Jada&apos;s Greens</div>
              <div className={styles.status}>Typically replies on Messenger</div>
            </div>
            <button className={styles.close} type="button" onClick={() => setOpen(false)} aria-label="Close Messenger chat">
              x
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.bubble}>
              Hi! Send us a message on Messenger for orders, delivery questions, or availability.
            </div>
          </div>

          <a className={styles.cta} href={messengerUrl} target="_blank" rel="noopener noreferrer">
            Continue in Messenger
          </a>
        </div>
      )}

      <button
        className={styles.chat}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close Messenger chat" : "Open Messenger chat"}
        aria-expanded={open}
      >
        <span className={styles.pulse} aria-hidden="true" />
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 36 36" focusable="false">
            <path
              fill="currentColor"
              d="M18 3C9.72 3 3.25 9.07 3.25 17.25c0 4.32 1.78 8.05 4.68 10.63v5.05c0 .58.61.94 1.11.66l4.46-2.47c1.4.39 2.91.6 4.5.6 8.28 0 14.75-6.07 14.75-14.25S26.28 3 18 3Zm1.47 19.18-3.74-4-7.3 4 8.03-8.52 3.82 4 7.21-4-8.02 8.52Z"
            />
          </svg>
        </span>
        <span className={styles.text}>
          <strong>Message us</strong>
          <span>Messenger</span>
        </span>
      </button>
    </div>
  );
}
