"use client";
import { useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Order } from "@/lib/types";
import styles from "./RevenueChart.module.css";

type Period = "7d" | "30d" | "12m";

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "12m", label: "12 Months" },
];

function buildData(orders: Order[], period: Period) {
  const now = new Date();
  if (period === "7d") {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toDateString();
      return {
        label: d.toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" }),
        revenue: orders.filter(o => new Date(o.created_at).toDateString() === dayStr && o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
        orders: orders.filter(o => new Date(o.created_at).toDateString() === dayStr).length,
      };
    });
  }
  if (period === "30d") {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (29 - i));
      const dayStr = d.toDateString();
      return {
        label: d.toLocaleDateString("en-PH", { month: "short", day: "numeric" }),
        revenue: orders.filter(o => new Date(o.created_at).toDateString() === dayStr && o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
        orders: orders.filter(o => new Date(o.created_at).toDateString() === dayStr).length,
      };
    });
  }
  // 12m
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return {
      label: d.toLocaleDateString("en-PH", { month: "short", year: "2-digit" }),
      revenue: orders.filter(o => {
        const od = new Date(o.created_at);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && o.status !== "cancelled";
      }).reduce((s, o) => s + o.total, 0),
      orders: orders.filter(o => {
        const od = new Date(o.created_at);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
      }).length,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      <div className={styles.tooltipRevenue}>₱{payload[0]?.value ?? 0}</div>
      <div className={styles.tooltipOrders}>{payload[1]?.value ?? 0} orders</div>
    </div>
  );
}

export default function RevenueChart({ orders }: { orders: Order[] }) {
  const [period, setPeriod] = useState<Period>("7d");
  const data = useMemo(() => buildData(orders, period), [orders, period]);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const interval = period === "30d" ? 4 : 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>Revenue</div>
          <div className={styles.total}>₱{totalRevenue.toLocaleString()}</div>
        </div>
        <div className={styles.tabs}>
          {PERIODS.map(p => (
            <button
              key={p.value}
              className={`${styles.tab} ${period === p.value ? styles.tabActive : ""}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5FA432" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#5FA432" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,47,26,0.07)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#5A5E48", fontFamily: "JetBrains Mono, monospace" }}
            tickLine={false}
            axisLine={false}
            interval={interval}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#5A5E48" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₱${v}`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#5FA432"
            strokeWidth={2.5}
            fill="url(#revGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#5FA432", strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="transparent"
            fill="transparent"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
