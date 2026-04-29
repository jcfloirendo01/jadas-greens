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
          <div className={styles.colVisit}>
            <h5 className="mono">Visit</h5>
            <p className={styles.visitPara}>Block 10B Lot 7, Almeria St., Gran Seville, Banlic, Cabuyao, Laguna, Philippines</p>
          </div>
          <div className={styles.colContact}>
            <h5 className="mono">Contact</h5>
            <ul>
              <li><Link href="tel:09760920033">📞 0976 092 0033</Link></li>
              <li>
                <Link href="https://www.facebook.com/people/Jadas-Greens/61568664689559/" target="_blank" rel="noopener" className={styles.fbLink}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                  Facebook Page
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.colSite}>
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
