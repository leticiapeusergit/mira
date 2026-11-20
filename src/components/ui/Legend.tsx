import styles from "./Legend.module.css";

type LegendItem = { label: string; color: string; key?: string };

type LegendProps = {
  items: LegendItem[];
  /** Key (or label) of the highlighted item; the others dim. */
  active?: string | null;
  /** Makes items hoverable/focusable to highlight their series in the chart. */
  onActiveChange?: (key: string | null) => void;
};

export function Legend({ items, active = null, onActiveChange }: LegendProps) {
  const interactive = !!onActiveChange;
  return (
    <ul className={styles.legend} onMouseLeave={interactive ? () => onActiveChange(null) : undefined}>
      {items.map((item) => {
        const key = item.key ?? item.label;
        return (
          <li
            key={key}
            className={styles.item}
            data-interactive={interactive || undefined}
            data-dim={(active && active !== key) || undefined}
            tabIndex={interactive ? 0 : undefined}
            onMouseEnter={interactive ? () => onActiveChange(key) : undefined}
            onFocus={interactive ? () => onActiveChange(key) : undefined}
            onBlur={interactive ? () => onActiveChange(null) : undefined}
          >
            <span className={styles.swatch} style={{ background: item.color }} aria-hidden />
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}
