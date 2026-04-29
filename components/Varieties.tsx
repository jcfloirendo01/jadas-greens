import styles from "./Varieties.module.css";

const varieties = [
  {
    tag: "In Season ✓", tagClass: "", imgClass: "",
    attrs: "Curly · Crisp · Fresh", name: "Olmetie",
    latin: "Lactuca sativa — green leaf lettuce",
    desc: "Our flagship — and currently our only — variety. Frilly, bright green leaves with a soft, fresh crunch. Beautiful in salads, wraps, or piled high on a sandwich. Harvested whole-head, with roots on for longer life in your fridge.",
    price: "₱40 / pc · 3 for ₱100", avail: "Available now",
    gradient: "url(#lett1)",
    gradDef: <radialGradient id="lett1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#B7E287"/><stop offset="60%" stopColor="#5FA432"/><stop offset="100%" stopColor="#3F6E1F"/></radialGradient>,
    path: "M100 30 C 60 30, 30 60, 35 100 C 20 95, 10 110, 20 130 C 5 135, 10 160, 40 160 C 50 175, 90 175, 100 165 C 110 175, 150 175, 160 160 C 190 160, 195 135, 180 130 C 190 110, 180 95, 165 100 C 170 60, 140 30, 100 30 Z",
    stroke: "#2D3415", veins: ["M70 60 Q 80 90, 75 130","M100 50 Q 100 100, 100 160","M130 60 Q 120 90, 125 130"],
  },
  {
    tag: "Coming Soon", tagClass: styles.coming, imgClass: styles.red,
    attrs: "Upright · Sweet · Ruby", name: "Thurinus",
    latin: "Red Romaine — coming soon",
    desc: "Tall, upright heads with deep ruby tips and a sweet, slightly nutty crunch. Perfect for caesar salads with a twist of color, or grilled cut-side down.",
    price: "Pricing soon", avail: "Next planting",
    gradient: "url(#lett2)",
    gradDef: <radialGradient id="lett2" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#E08A6F"/><stop offset="55%" stopColor="#A93D27"/><stop offset="100%" stopColor="#5C1F12"/></radialGradient>,
    path: "M100 25 C 75 25, 60 50, 65 80 C 55 78, 50 95, 60 110 C 50 115, 55 140, 75 145 C 80 165, 95 170, 100 168 C 105 170, 120 165, 125 145 C 145 140, 150 115, 140 110 C 150 95, 145 78, 135 80 C 140 50, 125 25, 100 25 Z",
    stroke: "#2D1009", veins: ["M85 50 Q 90 100, 88 160","M100 40 Q 100 100, 100 168","M115 50 Q 110 100, 112 160"],
  },
  {
    tag: "Coming Soon", tagClass: styles.coming, imgClass: styles.greenVariant,
    attrs: "Upright · Crisp · Bright", name: "Rincon",
    latin: "Green Romaine — coming soon",
    desc: "Classic green romaine — tall, ribbed leaves with a satisfying crunch and clean flavor. The salad-bowl workhorse, ready for caesar, BLTs, or wraps.",
    price: "Pricing soon", avail: "Next planting",
    gradient: "url(#lett3)",
    gradDef: <radialGradient id="lett3" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#D4E89C"/><stop offset="55%" stopColor="#7BB13C"/><stop offset="100%" stopColor="#3F6E1F"/></radialGradient>,
    path: "M100 25 C 75 25, 60 50, 65 80 C 55 78, 50 95, 60 110 C 50 115, 55 140, 75 145 C 80 165, 95 170, 100 168 C 105 170, 120 165, 125 145 C 145 140, 150 115, 140 110 C 150 95, 145 78, 135 80 C 140 50, 125 25, 100 25 Z",
    stroke: "#2D3415", veins: ["M85 50 Q 90 100, 88 160","M100 40 Q 100 100, 100 168","M115 50 Q 110 100, 112 160"],
  },
];

export default function Varieties() {
  return (
    <section id="varieties">
      <div className="wrap">
        <div className="section-head" data-variety-head>
          <span className="mono label" style={{ color: "var(--ink-soft)" }}>002 — The Lettuce</span>
          <h2 className="section-title">What We&apos;re<br /><span className="green">Growing.</span></h2>
        </div>
        <div className={styles.grid}>
          {varieties.map((v) => (
            <article key={v.name} className={styles.card} data-variety-card>
              <div className={`${styles.img} ${v.imgClass}`}>
                <span className={`${styles.tag} ${v.tagClass}`}>{v.tag}</span>
                <svg className={styles.svg} viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
                  <defs>{v.gradDef}</defs>
                  <g fill={v.gradient} stroke={v.stroke} strokeWidth="1.5" strokeLinejoin="round">
                    <path d={v.path} />
                  </g>
                  <g fill="none" stroke={v.stroke} strokeWidth="1" opacity="0.5">
                    {v.veins.map((d, i) => <path key={i} d={d} />)}
                  </g>
                </svg>
              </div>
              <div className={styles.body}>
                <span className="mono" style={{ color: "var(--ink-soft)" }}>{v.attrs}</span>
                <h3 className={styles.name}>{v.name}</h3>
                <span className={styles.latin}>{v.latin}</span>
                <p>{v.desc}</p>
                <div className={styles.meta}>
                  <span className={styles.price}>{v.price}</span>
                  <span className="mono">{v.avail}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
