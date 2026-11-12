import styles from "./Legend.module.css";

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className={styles.legend}>
      {items.map((item) => (
        <li key={item.label} className={styles.item}>
          <span className={styles.swatch} style={{ background: item.color }} aria-hidden />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
