"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SideNav.module.css";

type NavItem = { label: string; href: string; icon: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboards", href: "/dashboards", icon: "nav-dashboards" },
  { label: "Pipeline", href: "/pipeline", icon: "nav-pipeline" },
  { label: "Candidates", href: "/candidates", icon: "nav-candidates" },
  { label: "Jobs", href: "/jobs", icon: "nav-jobs" },
  { label: "Clients", href: "/clients", icon: "nav-clients" },
  { label: "External Applications", href: "/external-applications", icon: "nav-applications" },
  { label: "Reports", href: "/reports", icon: "nav-reports" },
  { label: "Settings", href: "/settings", icon: "nav-settings" },
];

const STORAGE_KEY = "mira:sidenav-collapsed";

export function SideNav() {
  const pathname = usePathname();
  /** Icons-only rail. Starts collapsed; the choice is remembered per browser. */
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setCollapsed(saved === "1");
    } catch {
      // Storage unavailable: keep the default.
    }
  }, []);

  const toggle = () =>
    setCollapsed((c) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, c ? "0" : "1");
      } catch {
        // Ignore: the toggle still works for this visit.
      }
      return !c;
    });

  return (
    <nav className={styles.sideNav} data-collapsed={collapsed || undefined} aria-label="Main">
      <button
        type="button"
        className={styles.collapse}
        aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        aria-expanded={!collapsed}
        onClick={toggle}
      >
        <img src="/assets/icons/nav-chevron.svg" alt="" width={20} height={20} />
      </button>

      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.item}
                data-active={active || undefined}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
              >
                <img src={`/assets/icons/${item.icon}.svg`} alt="" width={18} height={18} />
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={`${styles.item} ${styles.feedback}`}
        aria-label={collapsed ? "Send Feedback" : undefined}
        title={collapsed ? "Send Feedback" : undefined}
      >
        <img src="/assets/icons/nav-feedback.svg" alt="" width={18} height={18} />
        <span className={styles.label}>Send Feedback</span>
      </button>
    </nav>
  );
}
