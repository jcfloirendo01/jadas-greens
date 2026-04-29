"use client";
import { useRef, useState } from "react";
import styles from "./ExportButton.module.css";

export interface ExportField { key: string; label: string }

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  filename: string;
  fields: ExportField[];
}

export default function ExportButton({ data, filename, fields }: Props) {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState("");
  const [to, setTo] = useState(today);
  const ref = useRef<HTMLDivElement>(null);

  function exportCSV() {
    const filtered = data.filter((row) => {
      const d = new Date(row.created_at ?? row.since ?? 0);
      if (from && d < new Date(from)) return false;
      if (to && d > new Date(to + "T23:59:59")) return false;
      return true;
    });

    const header = fields.map(f => `"${f.label}"`).join(",");
    const rows = filtered.map(row =>
      fields.map(f => {
        const val = row[f.key];
        const str = val == null ? "" : String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(",")
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button className={styles.trigger} onClick={() => setOpen(v => !v)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export CSV
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.panelTitle}>Select Date Range</div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>From</label>
              <input
                type="date"
                className={styles.dateInput}
                value={from}
                max={to || today}
                onChange={e => setFrom(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>To</label>
              <input
                type="date"
                className={styles.dateInput}
                value={to}
                min={from}
                max={today}
                onChange={e => setTo(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.hint}>
            {!from ? "All records up to selected date" : `${from} → ${to}`}
          </div>
          <div className={styles.actions}>
            <button className={styles.cancel} onClick={() => setOpen(false)}>Cancel</button>
            <button className={styles.download} onClick={exportCSV}>
              Download .csv
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
