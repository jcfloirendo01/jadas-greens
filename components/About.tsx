import Image from "next/image";
import Link from "next/link";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <span className={styles.tag} data-about-tag>
              <span className={styles.dot} />
              <span className="mono">001 — Our Story</span>
            </span>
            <h2 className={styles.h2} data-about-h2>
              <div className={styles.lineWrap}><div className={styles.line} data-about-line>A small farm,</div></div>
              <div className={styles.lineWrap}><div className={styles.line} data-about-line><span className={styles.green}>a big crunch.</span></div></div>
            </h2>
            <p data-about-p>
              Jada&apos;s Greens started in 2024 in our backyard in Cabuyao, Laguna — a hydroponic
              setup born out of a simple idea: lettuce should taste like lettuce, and it shouldn&apos;t
              have to travel across the country to reach your salad bowl.
            </p>
            <p data-about-p>
              We grow our greens in nutrient-rich water — no soil, no pesticides, no chemicals.
              Just clean water, sunlight, and a lot of care. Every head is harvested by hand,
              washed, and delivered the same day to neighbours within Gran Seville.
            </p>
            <p data-about-p>
              And yes — that little french bulldog on our logo is real. He supervises every harvest.
            </p>
            <div className="cta-row" style={{ marginTop: 24 }} data-about-cta>
              <Link className="pill dark" href="#order">
                <span className={styles.dot} />Get a Bundle
              </Link>
              <Link className="pill" href="#how">See How We Grow →</Link>
            </div>
          </div>
          <div className={styles.visual} data-about-visual>
            <Image
              src="/assets/our-story.jpg"
              alt="Inside the Jada's Greens hydroponic farm"
              fill
              sizes="(max-width: 1000px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
