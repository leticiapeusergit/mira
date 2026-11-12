import styles from "./Tag.module.css";

export type TagTone = "neutral" | "error" | "success";

/** Small value chip used in table cells. */
export function Tag({ tone = "neutral", children }: { tone?: TagTone; children: React.ReactNode }) {
  return (
    <span className={styles.tag} data-tone={tone}>
      {children}
    </span>
  );
}
