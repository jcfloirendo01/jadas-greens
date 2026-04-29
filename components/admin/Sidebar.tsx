"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import styles from "./Sidebar.module.css";

const nav = [
  { href: "/admin",           icon: "📊", label: "Dashboard" },
  { href: "/admin/orders",    icon: "📦", label: "Orders" },
  { href: "/admin/customers", icon: "👥", label: "Customers" },
  { href: "/admin/products",  icon: "🌿", label: "Products" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const path = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.brand}>
        <Image src="/assets/logo-circle.png" alt="" width={36} height={36} />
        <div className={styles.brandText}>
          <div className={styles.brandName}>Jada&apos;s Greens</div>
          <div className={styles.brandSub}>Admin CRM</div>
        </div>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">✕</button>
        )}
      </div>

      <nav className={styles.nav}>
        {nav.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.item} ${path === href ? styles.active : ""}`}
            onClick={onClose}
          >
            <span className={styles.icon}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <Link href="/" className={styles.viewSite} onClick={onClose}>← View Site</Link>
        <button className={styles.signOut} onClick={signOut}>Sign Out</button>
      </div>
    </aside>
  );
}
