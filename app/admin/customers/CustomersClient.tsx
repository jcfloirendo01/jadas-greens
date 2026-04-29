"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
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

const emptyForm = () => ({ name: "", phone: "", address: "", notes: "" });

export default function CustomersClient({ customers: initial }: { customers: Customer[] }) {
  const [customers, setCustomers] = useState<Customer[]>(initial);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function openAdd() { setForm(emptyForm()); setErr(null); setModal("add"); }
  function openEdit(c: Customer) {
    setSelected(c);
    setForm({ name: c.name, phone: c.phone, address: c.address, notes: "" });
    setErr(null);
    setModal("edit");
  }
  function openDelete(c: Customer) { setSelected(c); setErr(null); setModal("delete"); }
  function closeModal() { setModal(null); setSelected(null); setErr(null); }

  async function handleAdd() {
    if (!form.name.trim()) { setErr("Name is required."); return; }
    setSaving(true); setErr(null);
    const { data, error } = await supabase.from("customers").insert({
      name: form.name, phone: form.phone, address: form.address,
      notes: form.notes || null,
    }).select().single();
    if (error) { setErr(error.message); setSaving(false); return; }
    const newC: Customer = { ...data, order_count: 0, total_spent: 0, last_order: null };
    setCustomers(prev => [newC, ...prev]);
    setSaving(false); closeModal();
  }

  async function handleEdit() {
    if (!selected) return;
    if (!form.name.trim()) { setErr("Name is required."); return; }
    setSaving(true); setErr(null);
    const { error } = await supabase.from("customers").update({
      name: form.name, phone: form.phone, address: form.address,
      notes: form.notes || null,
    }).eq("id", selected.id);
    if (error) { setErr(error.message); setSaving(false); return; }
    setCustomers(prev => prev.map(c => c.id === selected.id
      ? { ...c, name: form.name, phone: form.phone, address: form.address } : c));
    setSaving(false); closeModal();
  }

  async function handleDelete() {
    if (!selected) return;
    setSaving(true); setErr(null);
    const { error } = await supabase.from("customers").delete().eq("id", selected.id);
    if (error) { setErr(error.message); setSaving(false); return; }
    setCustomers(prev => prev.filter(c => c.id !== selected.id));
    setSaving(false); closeModal();
  }

  const filtered = search
    ? customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
    : customers;

  const exportData = filtered.map(c => ({
    ...c,
    last_order: c.last_order ? new Date(c.last_order).toLocaleDateString("en-PH") : "",
    created_at: new Date(c.created_at).toLocaleDateString("en-PH"),
  }));

  return (
    <>
      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search name or phone…" value={search} onChange={e => setSearch(e.target.value)} />
        <span className={styles.count}>{filtered.length} customer{filtered.length !== 1 ? "s" : ""}</span>
        <button className={styles.addBtn} onClick={openAdd}>+ Add Customer</button>
        <ExportButton data={exportData} filename="customers" fields={EXPORT_FIELDS} />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th><th>Phone</th><th>Address</th>
              <th>Orders</th><th>Total Spent</th><th>Last Order</th><th>Since</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className={styles.empty}>No customers found.</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td><a href={`tel:${c.phone}`} className={styles.phone}>{c.phone}</a></td>
                <td className={styles.addr}>{c.address}</td>
                <td className={styles.center}>{c.order_count}</td>
                <td className={styles.peso}>₱{c.total_spent}</td>
                <td className={styles.date}>{c.last_order ? new Date(c.last_order).toLocaleDateString("en-PH") : "—"}</td>
                <td className={styles.date}>{new Date(c.created_at).toLocaleDateString("en-PH")}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(c)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => openDelete(c)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className={styles.backdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{modal === "add" ? "Add Customer" : "Edit Customer"}</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Name *</label>
                <input className={styles.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Phone</label>
                <input className={styles.input} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Address</label>
                <input className={styles.input} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
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
                {saving ? "Saving…" : modal === "add" ? "Add Customer" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {modal === "delete" && selected && (
        <div className={styles.backdrop} onClick={closeModal}>
          <div className={styles.modalSm} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Customer</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p>Delete <strong>{selected.name}</strong>? This cannot be undone.</p>
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
    </>
  );
}
