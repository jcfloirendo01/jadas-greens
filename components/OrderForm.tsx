"use client";
import { useState } from "react";
import styles from "./OrderForm.module.css";

interface Props { onClose: () => void; }

type Zone = "gran_seville" | "banlic" | "other";

export default function OrderForm({ onClose }: Props) {
  const [qty, setQty] = useState(1);
  const [zone, setZone] = useState<Zone>("gran_seville");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const total = qty <= 2 ? qty * 40 : Math.floor(qty / 3) * 100 + (qty % 3) * 40;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name, customer_phone: phone,
          customer_address: address, delivery_zone: zone,
          notes, items: [{ product_id: "olmetie", product_name: "Olmetie", quantity: qty, unit_price: 40, subtotal: total }],
          total,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        {status === "success" ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>🌱</div>
            <h3>Order received!</h3>
            <p>Thanks, {name}! We&apos;ll harvest your Olmetie and deliver it to you soon. We&apos;ll confirm via a call to {phone}.</p>
            <button className="pill leaf" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3 className={styles.h3}>Place Your Order</h3>
            <p className={styles.sub}>We&apos;ll confirm by call and deliver same-day within Gran Seville.</p>

            <div className={styles.field}>
              <label className="mono">Your Name *</label>
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Maria Santos" />
            </div>
            <div className={styles.field}>
              <label className="mono">Phone Number *</label>
              <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xx xxx xxxx" type="tel" />
            </div>
            <div className={styles.field}>
              <label className="mono">Delivery Address *</label>
              <input required value={address} onChange={e => setAddress(e.target.value)} placeholder="House no., street, Gran Seville" />
            </div>
            <div className={styles.field}>
              <label className="mono">Delivery Zone *</label>
              <select value={zone} onChange={e => setZone(e.target.value as Zone)}>
                <option value="gran_seville">Gran Seville Subdivision (FREE)</option>
                <option value="banlic">Banlic, Cabuyao (pickup or small fee)</option>
                <option value="other">Other — we&apos;ll arrange</option>
              </select>
            </div>

            <div className={styles.qty}>
              <label className="mono">Quantity (Olmetie heads)</label>
              <div className={styles.qtyRow}>
                <button type="button" onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty(q => q+1)}>+</button>
              </div>
              <div className={styles.priceCalc}>
                Total: <strong>₱{total}</strong>
                {qty >= 3 && <span className={styles.saving}> · Bundle deal applied!</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label className="mono">Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any special instructions..." />
            </div>

            {status === "error" && <p className={styles.err}>Something went wrong. Please call us directly at 0976 092 0033.</p>}

            <div className={styles.footer}>
              <button type="submit" className="pill leaf" disabled={status === "loading"} style={{ fontSize:15, padding:"14px 28px" }}>
                {status === "loading" ? "Sending…" : `Confirm Order · ₱${total}`}
              </button>
              <span style={{ fontSize:12, color:"var(--ink-soft)" }}>We&apos;ll call to confirm</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
