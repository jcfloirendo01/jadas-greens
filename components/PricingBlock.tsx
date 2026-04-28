import styles from "./PricingBlock.module.css";

export default function PricingBlock() {
  return (
    <div className="wrap" style={{ marginBottom: 120 }}>
      <div className={styles.block}>
        <div>
          <span className="mono" style={{ color: "var(--leaf-soft)" }}>003 — Pricing</span>
          <h3 className={styles.h3}>Simple,<br />Honest Pricing.</h3>
          <p>One variety, two ways to buy. Order via Facebook or call us — we&apos;ll harvest the same day and deliver free within Gran Seville Subdivision.</p>
        </div>
        <div className={styles.tile}>
          <div className={styles.big}><span className={styles.peso}>₱</span>40</div>
          <div className={styles.lbl}>Per Piece</div>
          <small>Single head, root on</small>
        </div>
        <div className={styles.tile}>
          <div className={styles.big}><span className={styles.peso}>₱</span>100</div>
          <div className={styles.lbl}>3 Pieces — Best Value</div>
          <small>Save ₱20 vs. buying singly</small>
        </div>
      </div>
    </div>
  );
}
