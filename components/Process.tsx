import styles from "./Process.module.css";

const steps = [
  { n: "01", title: "Seed", body: "Non-GMO Olmetie seeds nestle into a soil-free plug. The plug holds the seedling steady while roots develop in clean water." },
  { n: "02", title: "Float", body: "Plugs are transferred into our hydroponic channels. Roots dangle in nutrient-rich water that recirculates around the clock — no waste, no runoff." },
  { n: "03", title: "Tend", body: "We check the water's nutrients and pH every day. No pesticides, no chemicals. Just care, sunlight, and clean water doing what they do best." },
  { n: "04", title: "Harvest", body: "Heads are cut by hand the morning of delivery — roots still on so they keep growing in your fridge. Crisp on Tuesday. Crisp on Friday." },
  { n: "05", title: "Deliver", body: "We bring it straight to your gate within Gran Seville Subdivision — free. Outside the subdivision? Just message us; we work it out." },
];

export default function Process() {
  return (
    <section id="how" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className={styles.process}>
          <div data-process-head>
            <span className="mono" style={{ color: "var(--ink-soft)" }}>004 — How we grow</span>
            <h2 className={`section-title ${styles.title}`}>
              Soil-free,<br /><span className="green">fuss-free.</span>
            </h2>
          </div>
          <div className={styles.steps}>
            {steps.map((s) => (
              <div key={s.n} className={styles.step} data-step>
                <div className={styles.num}>{s.n}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
