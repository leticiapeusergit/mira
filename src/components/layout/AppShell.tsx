import { SideNav } from "./SideNav";
import { TopNav } from "./TopNav";
import styles from "./AppShell.module.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <TopNav />
      <div className={styles.body}>
        <SideNav />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
