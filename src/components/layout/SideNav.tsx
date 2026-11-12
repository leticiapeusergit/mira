"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SideNav.module.css";

type NavItem = { label: string; href: string; icon: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Reports", href: "/reports", icon: "nav-reports" },
  { label: "Pipeline", href: "/pipeline", icon: "nav-pipeline" },
  { label: "Candidates", href: "/candidates", icon: "nav-candidates" },
  { label: "Jobs", href: "/jobs", icon: "nav-jobs" },
  { label: "Clients", href: "/clients", icon: "nav-clients" },
  { label: "External Applications", href: "/external-applications", icon: "nav-applications" },
  { label: "Settings", href: "/settings", icon: "nav-settings" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.sideNav} aria-label="Main">
      <button type="button" className={styles.collapse} aria-label="Collapse navigation">
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
              >
                <img src={`/assets/icons/${item.icon}.svg`} alt="" width={18} height={18} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button type="button" className={`${styles.item} ${styles.feedback}`}>
        <img src="/assets/icons/nav-feedback.svg" alt="" width={18} height={18} />
        Send Feedback
      </button>
    </nav>
  );
}
