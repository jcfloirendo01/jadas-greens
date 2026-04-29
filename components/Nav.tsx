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
          <span className="mono" style={{ color: "var(--ink-soft)" }}>📞 0976 092 0033</span>
          <Link className="pill leaf" href="#order">
            <span className="dot" style={{ background: "var(--cream)", width: 7, height: 7, borderRadius: "50%", display: "inline-block" }} />
            Order Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
