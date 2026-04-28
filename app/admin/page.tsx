import { createClient } from "@/lib/supabase-server";
import type { Order } from "@/lib/types";
import styles from "./dashboard.module.css";
import adminStyles from "./admin.module.css";

const STATUS_COLORS: Record<string, string> = {
  new: "#DCFCE7",
  processing: "#FEF9C3",
  out_for_delivery: "#DBEAFE",
  delivered: "#D1FAE5",
  cancelled: "#FEE2E2",
};
const STATUS_TEXT: Record<string, string> = {
  new: "New", processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered", cancelled: "Cancelled",
};

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className={`${styles.stat} ${accent ? styles.accent : ""}`}>
      <div className={styles.statVal}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  );
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: orders }, { data: customers }, { data: products }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("customers").select("id"),
    supabase.from("products").select("*"),
  ]);

  const allOrders = (orders ?? []) as Order[];
  const today = new Date().toDateString();
  const ordersToday = allOrders.filter(o => new Date(o.created_at).toDateString() === today);
  const pendingOrders = allOrders.filter(o => o.status === "new" || o.status === "processing");
  const revenueTotal = allOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const revenueToday = ordersToday.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  // Weekly revenue chart (last 7 days)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const weekData = weekDays.map(d => ({
    label: d.toLocaleDateString("en-PH", { weekday: "short" }),
    revenue: allOrders.filter(o => new Date(o.created_at).toDateString() === d.toDateString() && o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
  }));
  const maxRevenue = Math.max(...weekData.map(d => d.revenue), 1);

  const recent = allOrders.slice(0, 8);

  return (
    <>
      <h1 className={adminStyles.pageTitle}>Dashboard</h1>
      <p className={adminStyles.pageSub}>Overview of sales and orders for Jada&apos;s Greens.</p>

      <div className={styles.statsGrid}>
        <StatCard label="Total Orders" value={allOrders.length} />
        <StatCard label="Revenue Today" value={`₱${revenueToday}`} sub={`${ordersToday.length} order${ordersToday.length !== 1 ? "s" : ""}`} accent />
        <StatCard label="Pending Orders" value={pendingOrders.length} sub="New + Processing" />
        <StatCard label="Total Revenue" value={`₱${revenueTotal}`} />
        <StatCard label="Customers" value={(customers ?? []).length} />
        <StatCard label="Active Products" value={(products ?? []).filter((p: { available: boolean }) => p.available).length} />
      </div>

      <div className={styles.twoCol}>
        {/* Weekly chart */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Revenue — Last 7 Days</h3>
          <div className={styles.chart}>
            {weekData.map((d) => (
              <div key={d.label} className={styles.bar}>
                <div className={styles.barFill} style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} title={`₱${d.revenue}`} />
                <div className={styles.barVal}>₱{d.revenue}</div>
                <div className={styles.barLbl}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Orders</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign:"center", color:"var(--ink-soft)", padding:24 }}>No orders yet.</td></tr>
              )}
              {recent.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.customer_name}</strong><br /><small>{o.customer_phone}</small></td>
                  <td className={styles.mono}>₱{o.total}</td>
                  <td>
                    <span className={styles.badge} style={{ background: STATUS_COLORS[o.status] ?? "#F3F4F6" }}>
                      {STATUS_TEXT[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className={styles.mono}>{new Date(o.created_at).toLocaleDateString("en-PH")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
