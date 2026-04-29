import { createClient } from "@/lib/supabase-server";
import type { Order } from "@/lib/types";
import RevenueChart from "@/components/admin/RevenueChart";
import RevenueCard from "@/components/admin/RevenueCard";
import styles from "./dashboard.module.css";
import adminStyles from "./admin.module.css";

const STATUS_COLORS: Record<string, string> = {
  new: "#DCFCE7", processing: "#FEF9C3",
  out_for_delivery: "#DBEAFE", delivered: "#D1FAE5", cancelled: "#FEE2E2",
};
const STATUS_TEXT: Record<string, string> = {
  new: "New", processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered", cancelled: "Cancelled",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: orders }, { data: customers }, { data: products }, { data: expenses }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("customers").select("id"),
    supabase.from("products").select("*"),
    supabase.from("expenses").select("amount"),
  ]);

  const allOrders = (orders ?? []) as Order[];
  const pendingOrders = allOrders.filter(o => o.status === "new" || o.status === "processing");
  const revenueTotal = allOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const expenseTotal = (expenses ?? []).reduce((s: number, e: { amount: number }) => s + e.amount, 0);
  const netProfit = revenueTotal - expenseTotal;
  const recent = allOrders.slice(0, 8);

  return (
    <>
      <h1 className={adminStyles.pageTitle}>Dashboard</h1>
      <p className={adminStyles.pageSub}>Overview of sales and orders for Jada&apos;s Greens.</p>

      {/* Stat cards row */}
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <div className={styles.statVal}>{allOrders.length}</div>
          <div className={styles.statLabel}>Total Orders</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>{pendingOrders.length}</div>
          <div className={styles.statLabel}>Pending</div>
          <div className={styles.statSub}>New + Processing</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>₱{revenueTotal.toLocaleString()}</div>
          <div className={styles.statLabel}>Gross Revenue</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal} style={{ color: "#DC2626" }}>₱{expenseTotal.toLocaleString()}</div>
          <div className={styles.statLabel}>Total Expenses</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal} style={{ color: netProfit >= 0 ? "var(--leaf)" : "#DC2626" }}>
            ₱{Math.abs(netProfit).toLocaleString()}
          </div>
          <div className={styles.statLabel}>{netProfit >= 0 ? "Net Profit" : "Net Loss"}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>{(customers ?? []).length}</div>
          <div className={styles.statLabel}>Customers</div>
        </div>
      </div>

      {/* Revenue chart + dynamic revenue card */}
      <div className={styles.chartRow}>
        <RevenueChart orders={allOrders} />
        <RevenueCard orders={allOrders} />
      </div>

      {/* Recent orders table */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Recent Orders</h3>
        <div className={styles.tableWrap}>
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
                <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--ink-soft)", padding: "24px" }}>No orders yet.</td></tr>
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
