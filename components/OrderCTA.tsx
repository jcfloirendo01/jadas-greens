"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import OrderForm from "./OrderForm";
import styles from "./OrderCTA.module.css";

export default function OrderCTA() {
  const [open, setOpen] = useState(false);
  return (
    <section id="order" className={styles.section}>
      <div className="wrap">
        <div className={styles.grid}>
          <div>
            <span className="mono" style={{ color: "var(--ink-soft)" }}>006 — Order today</span>
            <h2 className={styles.h2} style={{ marginTop: 16 }}>
              Crisp Lettuce,<br /><span className={styles.green}>A Tap Away.</span>
            </h2>
            <p>Scan the code, message us on Facebook, or fill out the order form below. We&apos;ll harvest in the morning and deliver free within Gran Seville.</p>
            <div className={styles.actions}>
              <button className="pill leaf" onClick={() => setOpen(true)}>
                <span style={{ width:7,height:7,borderRadius:"50%",background:"var(--cream)",display:"inline-block" }} />
                Place an Order
              </button>
              <Link className="pill" href="tel:09760920033">Call 0976 092 0033</Link>
              <Link className="pill dark" href="https://www.facebook.com/people/Jadas-Greens/61568664689559/" target="_blank" rel="noopener">
                <span style={{ width:7,height:7,borderRadius:"50%",background:"var(--leaf)",display:"inline-block" }} />
                Facebook Page
              </Link>
            </div>
          </div>
          <div className={styles.qr}>
            <Image src="/assets/sticker-qr.png" alt="Scan to visit Jada's Greens on Facebook" width={280} height={280} style={{ maxWidth:"100%", height:"auto", display:"block", margin:"0 auto" }} />
            <div className={styles.qrLabel}>Scan to Order</div>
            <small>Opens our Facebook page</small>
          </div>
        </div>
      </div>
      {open && <OrderForm onClose={() => setOpen(false)} />}
    </section>
  );
}
