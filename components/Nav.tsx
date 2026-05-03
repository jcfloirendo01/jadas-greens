"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={`wrap ${styles.row}`}>
        <Link href="#" className={styles.brand}>
          <Image src="/assets/logo-circle.png" alt="Jada's Greens" width={44} height={44} />
          <span className={styles.brandText}>Jada&apos;s Greens</span>
        </Link>
        <div className={styles.links}>
          <Link href="#about">Our Farm</Link>
          <Link href="#varieties">Lettuce</Link>
          <Link href="#how">How We Grow</Link>
          <Link href="#delivery">Delivery</Link>
          <Link href="#order">Order</Link>
        </div>
        <div className={styles.cta}>
          <a href="tel:09760920033" className={`mono ${styles.phone}`}>
            <span className={styles.phoneIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z" />
              </svg>
            </span>
            <span className={styles.phoneNum}>0976 092 0033</span>
          </a>
          <Link className="pill leaf" href="#order">
            <span className="dot" style={{ background: "var(--cream)", width: 7, height: 7, borderRadius: "50%", display: "inline-block" }} />
            Order Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
