"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./HoverCard.module.css";

type HoverCardProps = {
  /** The hoverable/focusable element. */
  children: React.ReactNode;
  /** Content shown in the floating card. */
  content: React.ReactNode;
  /** Card width in px. Omit to size to content (min 302px). */
  width?: number;
  /** Size to content with no minimum width (for small tooltips). */
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Accessible name for the trigger. */
  label?: string;
};

type Point = { x: number; y: number };

const CURSOR_GAP = 16;
const VIEWPORT_MARGIN = 8;
const OPEN_DELAY = 60;

/**
 * Floating card that follows the mouse while the trigger is hovered.
 * With keyboard focus it anchors below the trigger instead.
 * Rendered in a portal so cards and tables never clip it.
 */
export function HoverCard({ children, content, width, compact, className, style, label }: HoverCardProps) {
  const [open, setOpen] = useState(false);
  /** Bumped on every open so the content remounts and its entrance (e.g. the chart draw) replays. */
  const [openCount, setOpenCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<Point | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLSpanElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const id = useId();

  useEffect(() => setMounted(true), []);
  useEffect(
    () => () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const show = (point: Point) => {
    setPos(point);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => {
      setOpen(true);
      setOpenCount((c) => c + 1);
    }, OPEN_DELAY);
  };

  const hide = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    setOpen(false);
  };

  const follow = (e: React.MouseEvent) => {
    const point = { x: e.clientX, y: e.clientY };
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setPos(point));
  };

  const anchorToTrigger = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) show({ x: rect.left, y: rect.bottom - CURSOR_GAP + 8 });
  };

  // Place the card bottom-right of the cursor, flipping when it would leave the viewport.
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !pos) return;
    const { offsetWidth: w, offsetHeight: h } = card;
    let left = pos.x + CURSOR_GAP;
    let top = pos.y + CURSOR_GAP;
    if (left + w > window.innerWidth - VIEWPORT_MARGIN) left = pos.x - CURSOR_GAP - w;
    if (top + h > window.innerHeight - VIEWPORT_MARGIN) top = pos.y - CURSOR_GAP - h;
    card.style.transform = `translate3d(${Math.max(VIEWPORT_MARGIN, left)}px, ${Math.max(VIEWPORT_MARGIN, top)}px, 0)`;
  }, [pos, open]);

  return (
    <span
      ref={triggerRef}
      className={`${styles.trigger} ${className ?? ""}`}
      style={style}
      tabIndex={0}
      aria-label={label}
      aria-describedby={open ? id : undefined}
      onMouseEnter={(e) => show({ x: e.clientX, y: e.clientY })}
      onMouseMove={follow}
      onMouseLeave={hide}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) anchorToTrigger();
      }}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      {children}
      {mounted &&
        createPortal(
          <span
            ref={cardRef}
            id={id}
            role="tooltip"
            className={styles.card}
            data-compact={compact || undefined}
            data-open={open || undefined}
            style={width ? { width } : undefined}
          >
            <span key={openCount} className={styles.content}>
              {content}
            </span>
          </span>,
          document.body,
        )}
    </span>
  );
}
