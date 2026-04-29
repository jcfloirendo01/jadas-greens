"use client";
import { useMemo, useState } from "react";
import type { Order } from "@/lib/types";
import styles from "./RevenueCard.module.css";

type Period = "day" | "week" | "month";

export default function RevenueCard({ orders }: { orders: Order[] }) {
  const [period, setPeriod] = useState<Period>("day");

  const { revenue, count, label } = useMemo(() => {
    const now = new Date();
    let filtered: Order[] = [];

    if (period === "day") {
      const today = now.toDateString();
      filtered = orders.filter(o => new Date(o.created_at).toDateString() === today && o.status !== "cancelled");
      return { revenue: filtered.reduce((s, o) => s + o.total, 0), count: filtered.length, label: "Today" };
    }
    if (period === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = orders.filter(o => new Date(o.created_at) >= weekAgo && o.status !== "cancelled");
      return { revenue: filtered.reduce((s, o) => s + o.total, 0), count: filtered.length, label: "This Week" };
    }
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    filtered = orders.filter(o => new Date(o.created_at) >= monthStart && o.status !== "cancelled");
    return { revenue: filtered.reduce((s, o) => s + o.total, 0), count: filtered.length, label: "This Month" };
  }, [orders, period]);

  return (
    <div className={styles.card}>
      <div className={styles.tabs}>
        {(["day", "week", "month"] as Period[]).map(p => (
          <button
            key={p}
            className={`${styles.tab} ${period === p ? styles.active : ""}`}
            onClick={() => setPeriod(p)}
          >
            {p === "day" ? "Day" : p === "week" ? "Week" : "Month"}
          </button>
        ))}
      </div>
      <div className={styles.value}>₱{revenue.toLocaleString()}</div>
      <div className={styles.label}>Revenue — {label}</div>
      <div className={styles.sub}>{count} order{count !== 1 ? "s" : ""}</div>
    </div>
  );
}
