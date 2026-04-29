"use client";
import ExportButton from "@/components/admin/ExportButton";
import styles from "./customers.module.css";

interface Customer {
  id: string; name: string; phone: string; address: string; created_at: string;
  order_count: number; total_spent: number; last_order: string | null;
}

const EXPORT_FIELDS = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "order_count", label: "Orders" },
  { key: "total_spent", label: "Total Spent (₱)" },
  { key: "last_order", label: "Last Order" },
  { key: "created_at", label: "Member Since" },
];

export default function CustomersClient({ customers }: { customers: Customer[] }) {
  const exportData = customers.map(c => ({
    ...c,
    last_order: c.last_order ? new Date(c.last_order).toLocaleDateString("en-PH") : "",
    created_at: new Date(c.created_at).toLocaleDateString("en-PH"),
  }));

  return (
    <>
      <div className={styles.toolbar}>
        <span className={styles.count}>{customers.length} customer{customers.length !== 1 ? "s" : ""}</span>
        <ExportButton data={exportData} filename="customers" fields={EXPORT_FIELDS} />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Last Order</th>
              <th>Since</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr><td colSpan={7} className={styles.empty}>No customers yet.</td></tr>
            )}
            {customers.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td><a href={`tel:${c.phone}`} className={styles.phone}>{c.phone}</a></td>
                <td className={styles.addr}>{c.address}</td>
                <td className={styles.center}>{c.order_count}</td>
                <td className={styles.peso}>₱{c.total_spent}</td>
                <td className={styles.date}>{c.last_order ? new Date(c.last_order).toLocaleDateString("en-PH") : "—"}</td>
                <td className={styles.date}>{new Date(c.created_at).toLocaleDateString("en-PH")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
