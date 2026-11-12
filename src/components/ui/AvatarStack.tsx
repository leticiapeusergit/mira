import styles from "./AvatarStack.module.css";

type AvatarStackProps = {
  avatars: { src: string; name: string }[];
  /** Max avatars before collapsing into a "+N" bubble. */
  max?: number;
  size?: 20 | 24;
};

export function AvatarStack({ avatars, max = avatars.length, size = 24 }: AvatarStackProps) {
  const visible = avatars.slice(0, max);
  const hidden = avatars.length - visible.length;

  return (
    <span className={styles.stack} data-size={size}>
      {visible.map((a) => (
        <img key={a.name} className={styles.avatar} src={a.src} alt={a.name} title={a.name} width={size} height={size} />
      ))}
      {hidden > 0 && <span className={styles.more}>+{hidden}</span>}
    </span>
  );
}
