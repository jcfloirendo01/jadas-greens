import Image from "next/image";
import Link from "next/link";
import styles from "./Delivery.module.css";

export default function Delivery() {
  return (
    <section id="delivery" className={styles.section}>
      <div className="wrap">
        <div className={styles.grid}>
          <div>
            <span className="mono" style={{ color: "var(--ink-soft)" }}>005 — Where we deliver</span>
            <h2 className={styles.h2} style={{ marginTop: 16 }}>
              Free Delivery,<br />Right to Your <span className={styles.green}>Gate.</span>
            </h2>
            <p>Place your order, and we&apos;ll bring fresh-cut Olmetie lettuce straight to your doorstep — same-day, no fees, no minimums within Gran Seville.</p>
            <ul className={styles.list}>
              <li>
                <span className={styles.check}>✓</span>
                <div>
                  <h4>Gran Seville Subdivision</h4>
                  <p>Free same-day delivery. No minimum order — even one head, we&apos;ll bring it.</p>
                </div>
              </li>
              <li>
                <span className={styles.check}>✓</span>
                <div>
                  <h4>Banlic, Cabuyao</h4>
                  <p>Pickup at the farm — Block 10B Lot 7 Almeria St., or arrange delivery for a small fee.</p>
                </div>
              </li>
              <li>
                <span className={styles.check}>✓</span>
                <div>
                  <h4>Cabuyao &amp; nearby Laguna</h4>
                  <p>Message us — we&apos;ll meet you halfway or arrange a courier. Lalamove / Grab welcome.</p>
                </div>
              </li>
            </ul>
            <div className="cta-row" style={{ marginTop: 28 }}>
              <Link className="pill leaf" href="tel:09760920033">
                <span style={{ width:7,height:7,borderRadius:"50%",background:"var(--cream)",display:"inline-block" }} />
                Call 0976 092 0033
              </Link>
              <Link className="pill" href="https://www.facebook.com/people/Jadas-Greens/61568664689559/" target="_blank" rel="noopener">Message on Facebook →</Link>
            </div>
          </div>

          {/* Map card */}
          <div className={styles.map}>
            {/* Actual Gran Seville polygon map */}
            <Image
              src="/assets/gran-seville-map.png"
              alt="Gran Seville Subdivision map"
              fill
              sizes="(max-width: 1000px) 100vw, 50vw"
              style={{ objectFit: "contain", objectPosition: "center", padding: "1.5rem" }}
            />

            {/* Subdivision label — upper right */}
            <div className={styles.mapTitle}>
              <span className="mono">Gran Seville Subdivision</span>
            </div>

            {/* Glowing pin — Block 10B Lot 7 (67.5% left, 8.4% top of image) */}
            <div className={styles.pin}>
              <div className={styles.pinRing} />
              <div className={styles.pinRingDelay} />
              <div className={styles.pinCore} />
              <div className={styles.pinLabel}>
                <span className={styles.pinName}>Block 10B Lot 7</span>
                <span className={styles.pinAddr}>Almeria St., Gran Seville</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
