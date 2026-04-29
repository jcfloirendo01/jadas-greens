"use client";
import type { Order } from "@/lib/types";
import NotificationBell from "./NotificationBell";
import styles from "./AdminHeader.module.css";

interface Props {
  email: string | null | undefined;
  initialNewOrders: Order[];
  onMenuClick: () => void;
}

export default function AdminHeader({ email, initialNewOrders, onMenuClick }: Props) {
  const initials = email ? email[0].toUpperCase() : "?";
  const displayEmail = email ?? "Admin";

  return (
    <header className={styles.header}>
      <button className={styles.hamburger} onClick={onMenuClick} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      <div className={styles.right}>
        <NotificationBell initialNewOrders={initialNewOrders} />

        <div className={styles.divider} />

        <div className={styles.user}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userLabel}>Logged in as</div>
            <div className={styles.userEmail}>{displayEmail}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
