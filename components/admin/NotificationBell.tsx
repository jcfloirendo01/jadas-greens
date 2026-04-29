"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import styles from "./NotificationBell.module.css";

export default function NotificationBell({ initialNewOrders }: { initialNewOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialNewOrders);
  const [unread, setUnread] = useState(initialNewOrders.length);
  const [ringing, setRinging] = useState(initialNewOrders.length > 0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Real-time subscription for new orders
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const channel = supabase
      .channel("admin-notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        setOrders((prev) => [payload.new as Order, ...prev]);
        setUnread((n) => n + 1);
        setRinging(true);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
    setUnread(0);
    setRinging(false);
  };

  return (
    <div className={styles.wrap} ref={ref}>
      <button className={`${styles.bell} ${ringing ? styles.ringing : ""}`} onClick={handleOpen} aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && <span className={styles.badge}>{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropHead}>
            <span className={styles.dropTitle}>Orders</span>
            <span className={styles.dropCount}>{orders.length} new</span>
          </div>
          <div className={styles.list}>
            {orders.length === 0 && (
              <div className={styles.empty}>No new orders</div>
            )}
            {orders.slice(0, 8).map((o) => (
              <div key={o.id} className={styles.item}>
                <div className={styles.itemDot} />
                <div className={styles.itemBody}>
                  <div className={styles.itemName}>{o.customer_name}</div>
                  <div className={styles.itemMeta}>
                    ₱{o.total} · {new Date(o.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {orders.length > 8 && (
            <div className={styles.dropFooter}>+{orders.length - 8} more — view Orders tab</div>
          )}
        </div>
      )}
    </div>
  );
}
