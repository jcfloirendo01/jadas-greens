import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <header className={styles.hero}>
      <div className="wrap">
        <div className={styles.eyebrow}>
          <span className="mono">EST. 2024 · Cabuyao, Laguna</span>
          <span className={styles.dash} />
          <span className="mono">Hydroponically Grown · Pesticide-Free</span>
        </div>

        <h1 className={styles.h1}>
          Fresh<br />
          <span className={styles.green}>Lettuce,</span><br />
          Grown Right Here.
        </h1>

        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.sub}>
              <span className={styles.lead}>
                Crisp, nutrient-rich hydroponic lettuce — grown sustainably without soil,
                harvested fresh, and delivered straight to your door in Gran Seville.
              </span>
              A small family farm in Cabuyao, Laguna, growing clean, pesticide-free greens
              with a soft spot for our resident French bulldog mascot.
            </div>
            <div className="cta-row">
              <Link className="pill leaf" href="#order">
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--cream)", display: "inline-block" }} />
                Order Lettuce
              </Link>
              <Link className="pill" href="#about">About the Farm →</Link>
            </div>
            <div className={styles.meta}>
              <div>
                <div className={`mono ${styles.metaKey}`}>Price</div>
                <div className={styles.metaVal}>₱40 / piece</div>
              </div>
              <div>
                <div className={`mono ${styles.metaKey}`}>Bundle</div>
                <div className={styles.metaVal}>3 for ₱100</div>
              </div>
              <div>
                <div className={`mono ${styles.metaKey}`}>Delivery</div>
                <div className={styles.metaVal}>Free in Gran Seville</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <span className={styles.ghost}>100% HYDRO</span>
            <div className={styles.cardTop}>
              <span className="mono" style={{ color: "rgba(255,253,246,0.85)" }}>100% Hydroponic</span>
              <div className={styles.badge}>
                <Image src="/assets/logo-circle.png" alt="" width={64} height={64} />
              </div>
            </div>
            <div className={styles.priceCircles}>
              <div className={styles.bubble}>
                <div className={styles.bubbleBig}>3 for ₱100</div>
                <div className={styles.bubbleLbl}>ONLY!</div>
              </div>
              <div className={`${styles.bubble} ${styles.bubbleSmall}`}>
                <div className={styles.bubbleBig}>₱40</div>
                <div className={styles.bubbleLbl}>PER PIECE</div>
              </div>
            </div>
            <div className={styles.cardBottom}>
              <div>
                <h2 className={styles.cardH2}>Fresh<br />Lettuce</h2>
                <p className={styles.cardDesc}>
                  Crisp, nutrient-rich hydroponic lettuce grown sustainably without soil —
                  offering freshness, vibrant flavor, and eco-friendly appeal.
                </p>
              </div>
              <div className={styles.freeDeliv}>
                <div className={styles.ico} />
                <div className={styles.freeLbl}>FREE DELIVERY</div>
                <small>within Gran Seville Subdivision</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
