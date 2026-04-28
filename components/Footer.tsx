import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>
              <Image src="/assets/logo-circle.png" alt="" width={64} height={64} />
              <span className={styles.name}>Jada&apos;s Greens</span>
            </div>
            <p>A small hydroponic lettuce farm in Cabuyao, Laguna. Hydroponically grown, family run, and supervised by one very dedicated french bulldog. Est. 2024.</p>
          </div>
          <div>
            <h5 className="mono">Visit</h5>
            <ul>
              <li>Block 10B Lot 7</li>
              <li>Almeria St., Gran Seville</li>
              <li>Banlic, Cabuyao</li>
              <li>Laguna, Philippines</li>
            </ul>
          </div>
          <div>
            <h5 className="mono">Contact</h5>
            <ul>
              <li><Link href="tel:09760920033">📞 0976 092 0033</Link></li>
              <li><Link href="https://www.facebook.com/people/Jadas-Greens/61568664689559/" target="_blank" rel="noopener">Facebook Page</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="mono">Site</h5>
            <ul>
              <li><Link href="#about">Our Farm</Link></li>
              <li><Link href="#varieties">Lettuce</Link></li>
              <li><Link href="#how">How We Grow</Link></li>
              <li><Link href="#order">Order</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <span className="mono">© 2026 Jada&apos;s Greens · Cabuyao, Laguna</span>
          <span className="mono">Hydroponically Grown · Est. 2024</span>
        </div>
      </div>
    </footer>
  );
}
