import styles from "./Select.module.css";

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
  width?: number;
};

/** Inline "Label: Value" filter select. */
export function Select({ label, value, options, onChange, width }: SelectProps) {
  return (
    <label className={styles.field} style={{ width }}>
      <span className={styles.text}>
        {label}: <span className={styles.value}>{value}</span>
      </span>
      <img src="/assets/icons/select-chevron.svg" alt="" width={22} height={22} />
      <select
        className={styles.native}
        value={value}
        aria-label={label}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
