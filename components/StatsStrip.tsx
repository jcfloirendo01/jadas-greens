import styles from "./StatsStrip.module.css";

export default function StatsStrip() {
  return (
    <div className="wrap">
      <div className={styles.strip}>
        <div className={styles.cell} data-stat>
          <div className={styles.num}>1<span className={styles.small}>variety</span></div>
          <div className={`mono ${styles.lbl}`}>Olmetie — currently</div>
        </div>
        <div className={styles.cell} data-stat>
          <div className={styles.num}>2<span className={styles.small}>soon</span></div>
          <div className={`mono ${styles.lbl}`}>Thurinus + Rincon — coming</div>
        </div>
        <div className={styles.cell} data-stat>
          <div className={styles.num}>0<span className={styles.small}>soil</span></div>
          <div className={`mono ${styles.lbl}`}>100% hydroponic</div>
        </div>
        <div className={styles.cell} data-stat>
          <div className={styles.num}>2024</div>
          <div className={`mono ${styles.lbl}`}>Family farm, est.</div>
        </div>
      </div>
    </div>
  );
}
