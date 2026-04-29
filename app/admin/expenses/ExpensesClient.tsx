"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Expense, ExpenseCategory } from "@/lib/types";
import ExportButton from "@/components/admin/ExportButton";
import styles from "./expenses.module.css";

const CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: "nutrients",   label: "Nutrients",   icon: "🧪" },
  { value: "cups",        label: "Cups",        icon: "🥤" },
  { value: "soil",        label: "Soil / Media",icon: "🪴" },
  { value: "seeds",       label: "Seeds",       icon: "🌱" },
  { value: "tools",       label: "Tools",       icon: "🔧" },
  { value: "packaging",   label: "Packaging",   icon: "📦" },
  { value: "utilities",   label: "Utilities",   icon: "💡" },
  { value: "other",       label: "Other",       icon: "📋" },
];

const EXPORT_FIELDS = [
  { key: "expense_date", label: "Date" },
  { key: "category",     label: "Category" },
  { key: "description",  label: "Description" },
  { key: "amount",       label: "Amount (₱)" },
  { key: "notes",        label: "Notes" },
];

const emptyForm = () => ({
  category: "other" as ExpenseCategory,
  description: "",
  amount: "",
  expense_date: new Date().toISOString().split("T")[0],
  notes: "",
});

export default function ExpensesClient({
  initialExpenses,
  totalRevenue,
}: {
  initialExpenses: Expense[];
  totalRevenue: number;
}) {
  const [expenses, setExpenses]     = useState<Expense[]>(initialExpenses);
  const [modal, setModal]           = useState<"add" | "delete" | null>(null);
  const [selected, setSelected]     = useState<Expense | null>(null);
  const [form, setForm]             = useState(emptyForm());
  const [saving, setSaving]         = useState(false);
  const [err, setErr]               = useState<string | null>(null);
  const [filterCat, setFilterCat]   = useState<ExpenseCategory | "all">("all");
  const supabase = createClient();

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit     = totalRevenue - totalExpenses;

  const filtered = filterCat === "all"
    ? expenses
    : expenses.filter(e => e.category === filterCat);

  function openAdd() { setForm(emptyForm()); setErr(null); setModal("add"); }
  function openDelete(e: Expense) { setSelected(e); setErr(null); setModal("delete"); }
  function closeModal() { setModal(null); setSelected(null); setErr(null); }

  async function handleAdd() {
    if (!form.description.trim()) { setErr("Description is required."); return; }
    const amt = parseInt(form.amount as string);
    if (!amt || amt <= 0) { setErr("Enter a valid amount."); return; }
    setSaving(true); setErr(null);
    const { data, error } = await supabase.from("expenses").insert({
      category: form.category,
      description: form.description.trim(),
      amount: amt,
      expense_date: form.expense_date,
      notes: form.notes.trim() || null,
    }).select().single();
    if (error) { setErr(error.message); setSaving(false); return; }
    setExpenses(prev => [data as Expense, ...prev]);
    setSaving(false);
    closeModal();
  }

  async function handleDelete() {
    if (!selected) return;
    setSaving(true); setErr(null);
    const { error } = await supabase.from("expenses").delete().eq("id", selected.id);
    if (error) { setErr(error.message); setSaving(false); return; }
    setExpenses(prev => prev.filter(e => e.id !== selected.id));
    setSaving(false);
    closeModal();
  }

  const catMeta = (val: ExpenseCategory) => CATEGORIES.find(c => c.value === val)!;

  return (
    <div>
      {/* Summary cards */}
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryVal}>₱{totalRevenue.toLocaleString()}</div>
          <div className={styles.summaryLabel}>Gross Revenue</div>
        </div>
        <div className={styles.summaryDivider}>−</div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryVal} ${styles.expenseVal}`}>₱{totalExpenses.toLocaleString()}</div>
          <div className={styles.summaryLabel}>Total Expenses</div>
        </div>
        <div className={styles.summaryDivider}>=</div>
        <div className={`${styles.summaryCard} ${styles.profitCard}`}>
          <div className={`${styles.summaryVal} ${netProfit >= 0 ? styles.profitPos : styles.profitNeg}`}>
            ₱{Math.abs(netProfit).toLocaleString()}
          </div>
          <div className={styles.summaryLabel}>{netProfit >= 0 ? "Net Profit" : "Net Loss"}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.catFilters}>
          <button className={`${styles.catBtn} ${filterCat === "all" ? styles.catActive : ""}`}
            onClick={() => setFilterCat("all")}>All</button>
          {CATEGORIES.map(c => (
            <button key={c.value}
              className={`${styles.catBtn} ${filterCat === c.value ? styles.catActive : ""}`}
              onClick={() => setFilterCat(c.value)}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <div className={styles.toolbarRight}>
          <button className={styles.addBtn} onClick={openAdd}>+ Add Expense</button>
          <ExportButton data={filtered} filename="expenses" fields={EXPORT_FIELDS} />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Notes</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className={styles.empty}>No expenses recorded yet.</td></tr>
            )}
            {filtered.map(e => {
              const cat = catMeta(e.category);
              return (
                <tr key={e.id}>
                  <td className={styles.dateCell}>
                    {new Date(e.expense_date + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td>
                    <span className={styles.catTag}>
                      {cat.icon} {cat.label}
                    </span>
                  </td>
                  <td className={styles.descCell}>{e.description}</td>
                  <td className={styles.amountCell}>₱{e.amount.toLocaleString()}</td>
                  <td className={styles.notesCell}>{e.notes ?? <span className={styles.none}>—</span>}</td>
                  <td>
                    <button className={styles.deleteBtn} onClick={() => openDelete(e)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={3} className={styles.footLabel}>
                  {filtered.length} expense{filtered.length !== 1 ? "s" : ""}
                  {filterCat !== "all" ? ` · ${catMeta(filterCat).label}` : ""}
                </td>
                <td className={styles.footTotal}>
                  ₱{filtered.reduce((s, e) => s + e.amount, 0).toLocaleString()}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Add Modal */}
      {modal === "add" && (
        <div className={styles.backdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Expense</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Category</label>
                <div className={styles.catGrid}>
                  {CATEGORIES.map(c => (
                    <button key={c.value} type="button"
                      className={`${styles.catOption} ${form.category === c.value ? styles.catOptionActive : ""}`}
                      onClick={() => setForm(f => ({ ...f, category: c.value }))}>
                      <span className={styles.catOptionIcon}>{c.icon}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Date *</label>
                  <input type="date" className={styles.input}
                    value={form.expense_date}
                    onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Amount (₱) *</label>
                  <input type="number" min={1} placeholder="e.g. 250" className={styles.input}
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Description *</label>
                <input type="text" className={styles.input}
                  placeholder="e.g. A-B Nutrient Solution 1L"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Notes (optional)</label>
                <textarea className={styles.textarea} rows={2}
                  placeholder="Where you bought it, brand, etc."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              {err && <div className={styles.errMsg}>{err}</div>}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              <button className={styles.saveBtn} disabled={saving} onClick={handleAdd}>
                {saving ? "Saving…" : "Add Expense"}
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
              <h2 className={styles.modalTitle}>Delete Expense</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p>Delete <strong>{selected.description}</strong> (₱{selected.amount})? This cannot be undone.</p>
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
