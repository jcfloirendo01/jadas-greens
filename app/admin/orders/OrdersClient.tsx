"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/lib/types";
import styles from "./orders.module.css";

const STATUSES: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "processing", label: "Processing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_COLOR: Record<string, string> = {
  new: "#DCFCE7", processing: "#FEF9C3",
  out_for_delivery: "#DBEAFE", delivered: "#D1FAE5", cancelled: "#FEE2E2",
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const supabase = createClient();

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdating(id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdating(null);
  }

  const filtered = orders.filter(o => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return o.customer_name.toLowerCase().includes(s) || o.customer_phone.includes(s) || o.customer_address.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search name, phone, address…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles.filters}>
          {STATUSES.map(s => (
            <button key={s.value} className={`${styles.filterBtn} ${filter === s.value ? styles.active : ""}`} onClick={() => setFilter(s.value as "all" | OrderStatus)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Date</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className={styles.empty}>No orders found.</td></tr>
            )}
            {filtered.map(o => (
              <tr key={o.id}>
                <td>
                  <strong>{o.customer_name}</strong><br />
                  <a href={`tel:${o.customer_phone}`} className={styles.phone}>{o.customer_phone}</a><br />
                  <span className={styles.addr}>{o.customer_address}</span>
                </td>
                <td>
                  {o.items.map((item, i) => (
                    <div key={i}>{item.quantity}× {item.product_name}</div>
                  ))}
                </td>
                <td className={styles.peso}>₱{o.total}</td>
                <td><span className={styles.zone}>{o.delivery_zone.replace("_", " ")}</span></td>
                <td>
                  <span className={styles.badge} style={{ background: STATUS_COLOR[o.status] }}>
                    {o.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className={styles.date}>{new Date(o.created_at).toLocaleDateString("en-PH")}<br /><small>{new Date(o.created_at).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}</small></td>
                <td>
                  <select
                    className={styles.statusSelect}
                    value={o.status}
                    disabled={updating === o.id}
                    onChange={e => updateStatus(o.id, e.target.value as OrderStatus)}
                  >
                    <option value="new">New</option>
                    <option value="processing">Processing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.summary}>
        Showing {filtered.length} of {orders.length} orders
        {filter !== "all" && ` · filtered by "${filter.replace(/_/g, " ")}"`}
      </div>
    </div>
  );
}
