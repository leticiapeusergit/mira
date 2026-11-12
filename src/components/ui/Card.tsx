import styles from "./Card.module.css";

type CardProps = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article";
  padded?: boolean;
};

/** White rounded surface used by every Reports panel. */
export function Card({ as: Tag = "div", padded = true, className, ...rest }: CardProps) {
  return <Tag className={`${styles.card} ${padded ? styles.padded : ""} ${className ?? ""}`} {...rest} />;
}
