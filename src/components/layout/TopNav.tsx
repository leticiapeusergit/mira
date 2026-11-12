import styles from "./TopNav.module.css";

export function TopNav() {
  return (
    <header className={styles.topNav}>
      <img src="/assets/brand/logo.svg" alt="Prediktive Mira" width={185.33} height={21} />
      <img className={styles.avatar} src="/assets/avatars/user.png" alt="Your profile" width={32} height={32} />
    </header>
  );
}
