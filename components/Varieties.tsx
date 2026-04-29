"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./Varieties.module.css";

const varieties = [
  {
    tag: "In Season ✓", tagClass: "", imgClass: "",
    attrs: "Curly · Crisp · Fresh", name: "Olmetie",
    latin: "Lactuca sativa — green leaf lettuce",
    desc: "Our flagship — and currently our only — variety. Frilly, bright green leaves with a soft, fresh crunch. Beautiful in salads, wraps, or piled high on a sandwich. Harvested whole-head, with roots on for longer life in your fridge.",
    price: "₱40 / pc · 3 for ₱100", avail: "Available now",
    images: [
      "/assets/olmetie/olmetie-01.jpg",
      "/assets/olmetie/olmetie-02.jpg",
      "/assets/olmetie/olmetie-03.jpg",
      "/assets/olmetie/olmetie-04.jpg",
    ],
  },
  {
    tag: "Coming Soon", tagClass: styles.coming, imgClass: styles.red,
    attrs: "Upright · Sweet · Ruby", name: "Thurinus",
    latin: "Red Romaine — coming soon",
    desc: "Tall, upright heads with deep ruby tips and a sweet, slightly nutty crunch. Perfect for caesar salads with a twist of color, or grilled cut-side down.",
    price: "Pricing soon", avail: "Next planting",
    images: [
      "/assets/thurinus/thurinus-01.jpg",
      "/assets/thurinus/thurinus-02.jpg",
      "/assets/thurinus/thurinus-03.jpg",
      "/assets/thurinus/thurinus-04.jpg",
    ],
  },
  {
    tag: "Coming Soon", tagClass: styles.coming, imgClass: styles.greenVariant,
    attrs: "Upright · Crisp · Bright", name: "Rincon",
    latin: "Green Romaine — coming soon",
    desc: "Classic green romaine — tall, ribbed leaves with a satisfying crunch and clean flavor. The salad-bowl workhorse, ready for caesar, BLTs, or wraps.",
    price: "Pricing soon", avail: "Next planting",
    images: [
      "/assets/rincon/rincon-01.jpg",
      "/assets/rincon/rincon-02.jpg",
      "/assets/rincon/rincon-03.jpg",
      "/assets/rincon/rincon-04.jpg",
    ],
  },
];

function Carousel({
  images, name, tag, tagClass,
}: {
  images: string[];
  name: string;
  tag: string;
  tagClass: string;
}) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () => setCurrent(c => (c + 1) % images.length);

  return (
    <div className={styles.carousel}>
      {/* slides */}
      <div
        className={styles.carouselTrack}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className={styles.carouselSlide}>
            <Image
              src={src}
              alt={`${name} photo ${i + 1}`}
              fill
              sizes="(max-width: 1000px) 100vw, 40vw"
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* variety tag — top-left, above images */}
      <span className={`${styles.tag} ${tagClass}`}>{tag}</span>

      {/* bottom nav bar: dots + arrow buttons */}
      <div className={styles.carouselNav}>
        <div className={styles.carouselDots}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`${styles.carouselDot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className={styles.carouselBtns}>
          <button className={styles.carouselBtn} onClick={prev} aria-label="Previous">&#8249;</button>
          <button className={styles.carouselBtn} onClick={next} aria-label="Next">&#8250;</button>
        </div>
      </div>
    </div>
  );
}

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
                <Carousel
                  images={v.images}
                  name={v.name}
                  tag={v.tag}
                  tagClass={v.tagClass}
                />
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
