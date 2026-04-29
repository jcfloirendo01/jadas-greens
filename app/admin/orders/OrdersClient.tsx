"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Order, OrderItem, OrderStatus, DeliveryZone, PaymentMethod } from "@/lib/types";
import ExportButton from "@/components/admin/ExportButton";
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
const EXPORT_FIELDS = [
  { key: "id", label: "Order ID" },
  { key: "customer_name", label: "Customer" },
  { key: "customer_phone", label: "Phone" },
  { key: "customer_address", label: "Address" },
  { key: "total", label: "Total (₱)" },
  { key: "payment_method", label: "Payment" },
  { key: "delivery_zone", label: "Zone" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Date" },
];
const ZONES: DeliveryZone[] = ["gran_seville", "banlic", "other"];

interface ItemRow { product_name: string; quantity: number; unit_price: number; }

const emptyForm = () => ({
  customer_name: "", customer_phone: "", customer_address: "",
  delivery_zone: "other" as DeliveryZone, status: "new" as OrderStatus,
  payment_method: "cash" as PaymentMethod, notes: "",
  items: [{ product_name: "", quantity: 1, unit_price: 40 }] as ItemRow[],
});

function calcItemSubtotal(qty: number, unitPrice: number): number {
  // Apply 3-for-₱100 bundle deal for the standard ₱40 lettuce price
  if (unitPrice === 40) {
    return Math.floor(qty / 3) * 100 + (qty % 3) * 40;
  }
  return qty * unitPrice;
}

function calcTotal(items: ItemRow[]) {
  return items.reduce((s, it) => s + calcItemSubtotal(it.quantity, it.unit_price), 0);
}

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  // Modal state
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdating(id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdating(null);
  }

  function openAdd() {
    setForm(emptyForm());
    setErr(null);
    setModal("add");
  }

  function openEdit(o: Order) {
    setSelected(o);
    setForm({
      customer_name: o.customer_name,
      customer_phone: o.customer_phone,
      customer_address: o.customer_address,
      delivery_zone: o.delivery_zone,
      status: o.status,
      payment_method: o.payment_method ?? "cash",
      notes: o.notes ?? "",
      items: o.items.map(it => ({ product_name: it.product_name, quantity: it.quantity, unit_price: it.unit_price })),
    });
    setErr(null);
    setModal("edit");
  }

  function openDelete(o: Order) {
    setSelected(o);
    setErr(null);
    setModal("delete");
  }

  function closeModal() { setModal(null); setSelected(null); setErr(null); }

  function setItem(i: number, field: keyof ItemRow, value: string | number) {
    setForm(f => {
      const items = f.items.map((it, idx) => idx === i ? { ...it, [field]: value } : it);
      return { ...f, items };
    });
  }

  function addItem() {
    setForm(f => ({ ...f, items: [...f.items, { product_name: "", quantity: 1, unit_price: 40 }] }));
  }

  function removeItem(i: number) {
    setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  }

  async function handleAdd() {
    if (!form.customer_name.trim()) { setErr("Customer name is required."); return; }
    if (form.items.some(it => !it.product_name.trim())) { setErr("All items need a product name."); return; }
    setSaving(true); setErr(null);
    const total = calcTotal(form.items);
    const items: OrderItem[] = form.items.map(it => ({
      product_id: "", product_name: it.product_name,
      quantity: it.quantity, unit_price: it.unit_price,
      subtotal: calcItemSubtotal(it.quantity, it.unit_price),
    }));
    const { data, error } = await supabase.from("orders").insert({
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      customer_address: form.customer_address,
      delivery_zone: form.delivery_zone,
      status: form.status,
      payment_method: form.payment_method,
      notes: form.notes || null,
      items, total,
    }).select().single();
    if (error) { setErr(error.message); setSaving(false); return; }
    setOrders(prev => [data as Order, ...prev]);
    setSaving(false);
    closeModal();
  }

  async function handleEdit() {
    if (!selected) return;
    if (!form.customer_name.trim()) { setErr("Customer name is required."); return; }
    if (form.items.some(it => !it.product_name.trim())) { setErr("All items need a product name."); return; }
    setSaving(true); setErr(null);
    const total = calcTotal(form.items);
    const items: OrderItem[] = form.items.map(it => ({
      product_id: "", product_name: it.product_name,
      quantity: it.quantity, unit_price: it.unit_price,
      subtotal: calcItemSubtotal(it.quantity, it.unit_price),
    }));
    const { error } = await supabase.from("orders").update({
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      customer_address: form.customer_address,
      delivery_zone: form.delivery_zone,
      status: form.status,
      payment_method: form.payment_method,
      notes: form.notes || null,
      items, total,
    }).eq("id", selected.id);
    if (error) { setErr(error.message); setSaving(false); return; }
    setOrders(prev => prev.map(o => o.id === selected.id
      ? { ...o, ...form, items, total, notes: form.notes || null } : o));
    setSaving(false);
    closeModal();
  }

  async function handleDelete() {
    if (!selected) return;
    setSaving(true); setErr(null);
    const { error } = await supabase.from("orders").delete().eq("id", selected.id);
    if (error) { setErr(error.message); setSaving(false); return; }
    setOrders(prev => prev.filter(o => o.id !== selected.id));
    setSaving(false);
    closeModal();
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
        <button className={styles.addBtn} onClick={openAdd}>+ Add Order</button>
        <ExportButton data={filtered} filename="orders" fields={EXPORT_FIELDS} />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th><th>Items</th><th>Total</th>
              <th>Payment</th><th>Zone</th><th>Status</th><th>Date</th><th>Update</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9} className={styles.empty}>No orders found.</td></tr>
            )}
            {filtered.map(o => (
              <tr key={o.id}>
                <td>
                  {o.status === "new" && <span className={styles.newDot} title="New order" />}
                  <strong>{o.customer_name}</strong><br />
                  <a href={`tel:${o.customer_phone}`} className={styles.phone}>{o.customer_phone}</a><br />
                  <span className={styles.addr}>{o.customer_address}</span>
                </td>
                <td>{o.items.map((item, i) => <div key={i}>{item.quantity}× {item.product_name}</div>)}</td>
                <td className={styles.peso}>₱{o.total}</td>
                <td>
                  <span className={styles.payBadge} data-method={o.payment_method ?? "cash"}>
                    {o.payment_method === "gcash" ? "GCash" : "Cash"}
                  </span>
                </td>
                <td><span className={styles.zone}>{o.delivery_zone.replace("_", " ")}</span></td>
                <td>
                  <span className={styles.badge} style={{ background: STATUS_COLOR[o.status] }}>
                    {o.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className={styles.date}>
                  {new Date(o.created_at).toLocaleDateString("en-PH")}<br />
                  <small>{new Date(o.created_at).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}</small>
                </td>
                <td>
                  <select className={styles.statusSelect} value={o.status} disabled={updating === o.id}
                    onChange={e => updateStatus(o.id, e.target.value as OrderStatus)}>
                    <option value="new">New</option>
                    <option value="processing">Processing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(o)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => openDelete(o)}>Delete</button>
                  </div>
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

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className={styles.backdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{modal === "add" ? "Add Order" : "Edit Order"}</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Customer Name *</label>
                <input className={styles.input} value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} />
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Phone</label>
                  <input className={styles.input} value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Zone</label>
                  <select className={styles.input} value={form.delivery_zone} onChange={e => setForm(f => ({ ...f, delivery_zone: e.target.value as DeliveryZone }))}>
                    {ZONES.map(z => <option key={z} value={z}>{z.replace("_", " ")}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Address</label>
                <input className={styles.input} value={form.customer_address} onChange={e => setForm(f => ({ ...f, customer_address: e.target.value }))} />
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Status</label>
                  <select className={styles.input} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as OrderStatus }))}>
                    {STATUSES.filter(s => s.value !== "all").map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Payment</label>
                  <select className={styles.input} value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value as PaymentMethod }))}>
                    <option value="cash">Cash on Delivery</option>
                    <option value="gcash">GCash</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Items</label>
                {form.items.map((it, i) => (
                  <div key={i} className={styles.itemRow}>
                    <input className={styles.input} placeholder="Product name" value={it.product_name}
                      onChange={e => setItem(i, "product_name", e.target.value)} style={{ flex: 2 }} />
                    <input className={styles.inputSm} type="number" min={1} placeholder="Qty" value={it.quantity}
                      onChange={e => setItem(i, "quantity", parseInt(e.target.value) || 1)} />
                    <input className={styles.inputSm} type="number" min={0} step="0.01" placeholder="Price" value={it.unit_price}
                      onChange={e => setItem(i, "unit_price", parseFloat(e.target.value) || 0)} />
                    {form.items.length > 1 && (
                      <button className={styles.removeItem} onClick={() => removeItem(i)}>✕</button>
                    )}
                  </div>
                ))}
                <button className={styles.addItemBtn} onClick={addItem}>+ Add item</button>
                <div className={styles.totalPreview}>
                  Total: ₱{calcTotal(form.items)}
                  {form.items.some(it => it.unit_price === 40 && it.quantity >= 3) && (
                    <span className={styles.bundleNote}> · Bundle deal applied</span>
                  )}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Notes</label>
                <textarea className={styles.textarea} value={form.notes} rows={2} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>

              {err && <div className={styles.errMsg}>{err}</div>}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              <button className={styles.saveBtn} disabled={saving} onClick={modal === "add" ? handleAdd : handleEdit}>
                {saving ? "Saving…" : modal === "add" ? "Add Order" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal === "delete" && selected && (
        <div className={styles.backdrop} onClick={closeModal}>
          <div className={styles.modalSm} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Order</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p>Delete order for <strong>{selected.customer_name}</strong>? This cannot be undone.</p>
              {err && <div className={styles.errMsg}>{err}</div>}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              <button className={styles.deleteSaveBtn} disabled={saving} onClick={handleDelete}>
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
