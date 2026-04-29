"use client";
import { useState } from "react";
import type { Order } from "@/lib/types";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";
import styles from "../../app/admin/admin.module.css";

interface Props {
  children: React.ReactNode;
  email: string | null | undefined;
  initialNewOrders: Order[];
}

export default function AdminShell({ children, email, initialNewOrders }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.rightPanel}>
        <AdminHeader
          email={email}
          initialNewOrders={initialNewOrders}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
