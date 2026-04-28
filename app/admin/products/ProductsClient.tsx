"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import styles from "./products.module.css";

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [saving, setSaving] = useState<string | null>(null);
  const supabase = createClient();

  async function toggle(id: string, field: "available" | "coming_soon", value: boolean) {
    setSaving(id);
    const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
    if (!error) setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    setSaving(null);
  }

  async function updatePrice(id: string, price_single: number) {
    const { error } = await supabase.from("products").update({ price_single }).eq("id", id);
    if (!error) setProducts(prev => prev.map(p => p.id === id ? { ...p, price_single } : p));
  }

  return (
    <div className={styles.grid}>
      {products.map(p => (
        <div key={p.id} className={`${styles.card} ${!p.available && !p.coming_soon ? styles.unavailable : ""}`}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.name}>{p.name}</h3>
              <div className={styles.variety}>{p.variety}</div>
            </div>
            <div className={styles.badges}>
              {p.available && <span className={styles.badgeOn}>Available</span>}
              {p.coming_soon && <span className={styles.badgeSoon}>Coming Soon</span>}
              {!p.available && !p.coming_soon && <span className={styles.badgeOff}>Unavailable</span>}
            </div>
          </div>

          <p className={styles.desc}>{p.description}</p>

          <div className={styles.priceRow}>
            <label>Price per piece (₱)</label>
            <input
              type="number" min={1} value={p.price_single}
              onChange={e => updatePrice(p.id, parseInt(e.target.value))}
              className={styles.priceInput}
            />
          </div>

          <div className={styles.priceRow}>
            <span>Bundle: {p.price_bundle_qty} for ₱{p.price_bundle_total ?? "—"}</span>
          </div>

          <div className={styles.toggles}>
            <label className={styles.toggle}>
              <input type="checkbox" checked={p.available} disabled={saving === p.id}
                onChange={e => toggle(p.id, "available", e.target.checked)} />
              <span>Available for sale</span>
            </label>
            <label className={styles.toggle}>
              <input type="checkbox" checked={p.coming_soon} disabled={saving === p.id}
                onChange={e => toggle(p.id, "coming_soon", e.target.checked)} />
              <span>Mark as &quot;Coming Soon&quot;</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
