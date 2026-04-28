import styles from "./Marquee.module.css";

const items = [
  "Olmetie Lettuce","Hydroponically Grown","No Soil","No Pesticides",
  "Harvested Fresh","₱40 per piece","3 for ₱100","Free Delivery",
];

export default function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i}><i className={styles.leaf} />{item}</span>
        ))}
      </div>
    </div>
  );
}
