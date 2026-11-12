"use client";

import { useId, useRef, useState } from "react";
import styles from "./HoverCard.module.css";

type HoverCardProps = {
  /** The hoverable/focusable element. */
  children: React.ReactNode;
  /** Content shown in the floating card. */
  content: React.ReactNode;
  /** Card width in px. Omit to size to content (min 262px). */
  width?: number;
  /** Horizontal alignment of the card relative to the trigger. */
  align?: "start" | "center" | "end";
  /** Gap between trigger and card. */
  offset?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Accessible name for the trigger. */
  label?: string;
};

const OPEN_DELAY = 80;
const CLOSE_DELAY = 120;

/**
 * Shows a floating card below its trigger on hover or keyboard focus.
 * Used across Reports to reveal a metric's history.
 */
export function HoverCard({
  children,
  content,
  width,
  align = "center",
  offset = 8,
  className,
  style,
  label,
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const schedule = (next: boolean) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), next ? OPEN_DELAY : CLOSE_DELAY);
  };

  return (
    <span
      className={`${styles.root} ${className ?? ""}`}
      style={style}
      onMouseEnter={() => schedule(true)}
      onMouseLeave={() => schedule(false)}
      onFocus={() => schedule(true)}
      onBlur={() => schedule(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <span
        className={styles.trigger}
        tabIndex={0}
        aria-describedby={open ? id : undefined}
        aria-label={label}
      >
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className={styles.card}
        data-open={open || undefined}
        data-align={align}
        style={{ width, ["--offset" as string]: `${offset}px` }}
      >
        {content}
      </span>
    </span>
  );
}
